import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/response';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const smClient = new SecretsManagerClient({});
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TABLE_NAME;


interface UserItem {
  password: string;
  email: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody: RequestBody = event.body ? JSON.parse(event.body) : {};
    const { userName, password } = requestBody;
    if (!userName || !password) return createResponse(400, 'Username and password are required');

    const secret = await smClient.send(
      new GetSecretValueCommand({
        SecretId: 'LeaveJWTSecret',
      })
    );

    if (!secret.SecretString) return createResponse(500, 'JWT secret missing in Secrets Manager');
    const jwtSecret = secret.SecretString

    const result = await ddbClient.send(
      new GetCommand({
        TableName,
        Key: {
          PK: `USER#${userName}`,
          SK: 'PROFILE',
        },
      })
    );

    if (!result.Item) {
      return createResponse(404, 'User not found');
    }

    const userItem = result.Item as UserItem;
    const isPasswordVerified = await bcrypt.compare(password, userItem.password);
    if (!isPasswordVerified) return createResponse(401, 'Email or Password is invalid');

    const token: string = jwt.sign({ userName, userEmail: userItem.email }, jwtSecret, { expiresIn: 60 * 60 });

    return createResponse(200, 'Login successful', { token });
  } catch (err) {
    console.error(err);
    return createResponse(500, 'Internal server error');
  }
};
