import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { response } from '../../utils/response'; 
import { sendError } from '../../utils/error';

const smClient = new SecretsManagerClient({});
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.TABLE_NAME as string

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody: RequestBody = event.body ? JSON.parse(event.body) : {};
    const { email, password } = requestBody as {email: string, password: string}
    if (!email || !password) return response(400, 'Email and password are required');
    
    const secret = await smClient.send(
      new GetSecretValueCommand({ 
        SecretId: 'LeaveJWTSecret',
      })
    );

    if (!secret.SecretString) return response(500, 'JWT secret missing in Secrets Manager');
    const jwtSecret = secret.SecretString

    const result = await ddbClient.send(
      new GetCommand({
        TableName,
        Key: {
          PK: `USER#${email}`,
          SK: 'PROFILE',
        },
      })
    );

    if (!result.Item) return response(404, 'User does not exist try to signup');

    const userItem = result.Item as UserItem;
    const isPasswordVerified = await bcrypt.compare(password, userItem.password);
    if (!isPasswordVerified) return response(401, 'Email or Password is invalid');

    const token: string = jwt.sign({ userName: userItem.userName, userEmail: userItem.email }, jwtSecret, { expiresIn: 60 * 60 });

    return response(200, 'Login successful', { token });
  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
