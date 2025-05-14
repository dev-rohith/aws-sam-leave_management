import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from '../../utils/response';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ulid } from 'ulid';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { sendError } from '../../utils/error';

const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const sfn = new SFNClient({});


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const TableName = process.env.TABLE_NAME as string
    const stateMachineArn = process.env.STATE_MACHINE_ARN as string
    
    const { userEmail, principalId: userName } = event.requestContext.authorizer || {};
    const { name, startDate, endDate, reason }: applyLeaveEvent = event.body ? JSON.parse(event.body) : {};
    const leaveId: string = ulid();
    const apiBaseUrl = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;

    if (!startDate || !endDate || !reason || !name) {
      return response(400, 'name,leave startDate and endDate, leave reason is required for leaveRequest');
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

    const sendRequestInput = {
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
        input: JSON.stringify(sendRequestInput),
      })
    );


    return response(200, 'Leave applied successfully');
  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
