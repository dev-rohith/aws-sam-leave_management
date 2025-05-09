import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../utils/response';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ulid } from 'ulid';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TableName = process.env.TABLE_NAME;
const stateMachineArn = process.env.STATE_MACHINE_ARN;
const sfn = new SFNClient({});

export interface applyLeaveEvent {
  name: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userEmail, principalId: userName } = event.requestContext.authorizer || {};
    const { name, startDate, endDate, reason }: applyLeaveEvent = event.body ? JSON.parse(event.body) : {};
    const leaveId: string = ulid();
    const apiBaseUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

    if (!startDate || !endDate || !reason || !name) {
      return createResponse(400, 'name,leave startDate and endDate, leave reason is required for leaveRequest');
    }

    await ddbDocClient.send(
      new PutCommand({
        TableName,
        Item: {
          PK: `PK#${userName}`,
          SK: `LEAVE#${leaveId}`,
          email: userEmail,
          leaveId,
          startDate,
          endDate,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      })
    );

    const sendApprovalInput = {
      userName,
      leaveId,
      userEmail,
      startDate,
      endDate,
      reason,
      status: 'PENDING',
      apiBaseUrl,
    };

    await sfn.send(
      new StartExecutionCommand({
        stateMachineArn,
        input: JSON.stringify(sendApprovalInput),
      })
    );

    return createResponse(200, 'Leave applied successfully');
  } catch (err) {
    console.error(err);
    return createResponse(500, 'Internal server Error');
  }
};
