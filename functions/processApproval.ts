import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createResponse } from '../utils/response';

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const ddbDocClient = DynamoDBDocumentClient.from(client)
const TableName = process.env.TABLE_NAME
const sfn = new SFNClient({ region: process.env.AWS_REGION })

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { leaveId, userName } = event.pathParameters || {};
    const { action, requestToken } = event.queryStringParameters || {};

    if (!leaveId || !userName || !action || (action !== 'approved' && action !== 'rejected')) {
        return createResponse(400, "Missing or invalid parameters.")
    }
       
       await ddbDocClient.send(new UpdateCommand({
        TableName,
        Key: {
          PK: `PK#${userName}`,
          SK:`LEAVE#${leaveId}`,
        },
        UpdateExpression: "SET #status = :action",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":action": action.toUpperCase(),
        }
      }));   
      
      await sfn.send(new SendTaskSuccessCommand({
        taskToken: requestToken,
        output: JSON.stringify({ approvalStatus: action.toUpperCase() }) 
      }));    
      
      return  createResponse(200, 'Successfully processed action !!')
    
  } catch (err) {
    console.error(err);
    const error = {
      test: err
    }
    return createResponse(500, 'Internal Server Error', error);
  }
};
