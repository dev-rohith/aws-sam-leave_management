import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs'
import { createResponse } from '../../utils/response'; 
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({region: 'us-east-1'});
const ddbClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
      const {userName, email, password}: RequestBody = event.body ? JSON.parse(event.body) : {};
      if(!userName ||!email || !password) return createResponse(400, 'Username with email and password is required for signup')
      const salt = bcrypt.genSaltSync()
      const hashedPassword = bcrypt.hashSync(password, salt)
      const TableName = process.env.TABLE_NAME

      await ddbClient.send(new PutCommand({
        TableName,
        Item: {
          PK: `USER#${userName}`,
          SK: "PROFILE",
          email,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          type: "User"
        }
      }));
      
      return createResponse(200, 'Successfully created the user')
    } catch (err) {
      console.error(err);
      return createResponse(500, 'Internal server error');
    }
};



