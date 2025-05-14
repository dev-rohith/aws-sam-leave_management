import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { response } from '../../utils/response';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { sendError } from '../../utils/error';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userName, email, password }: RequestBody = event.body ? JSON.parse(event.body) : {};

    if (!userName || !email || !password) return response(400, 'Username, email, and password are required for signup');

    const getUserParams = {
      TableName,
      Key: {
        PK: `USER#${email}`, 
        SK: 'PROFILE',
      },
    };

    const existingUser = await ddbClient.send(new GetCommand(getUserParams));

    if (existingUser.Item) return response(400, 'User with this email already exists');

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    await ddbClient.send(new PutCommand({
      TableName,
      Item: {
        PK: `USER#${email}`,
        SK: 'PROFILE',
        email,
        userName,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        type: 'User',
      }
    }));

    return response(200, 'Successfully created the user');
    
  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
