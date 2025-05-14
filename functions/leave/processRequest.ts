import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SendTaskSuccessCommand, SFNClient } from '@aws-sdk/client-sfn';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { response } from '../../utils/response';
import { sendError } from '../../utils/error';

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const ddbDocClient = DynamoDBDocumentClient.from(client)
const sfn = new SFNClient({ region: process.env.AWS_REGION })

const TableName = process.env.TABLE_NAME as string

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { leaveId, userName } = event.pathParameters || {};
    const { action, requestToken } = event.queryStringParameters || {};

    if (!leaveId || !userName || !action || (action !== 'approved' && action !== 'rejected')) {
        return response(400, "Missing or invalid parameters.")
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
      
      return  response(200, 'Successfully processed action !!')
    
  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
