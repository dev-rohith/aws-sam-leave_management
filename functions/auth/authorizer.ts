import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { generatePolicy } from '../../utils/policy'; 
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const smClient = new SecretsManagerClient({});

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const bearerToken: string[] = event.authorizationToken.split(' ');
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer')  throw new Error('Unauthorized: Missing bearer Token');

    const authToken = bearerToken[1]?.trim()
    const secret = await smClient.send(
      new GetSecretValueCommand({
        SecretId: 'LeaveJWTSecret',
      })
    );

    const jwtSecret = secret.SecretString
    if (!jwtSecret) throw new Error('Unauthorized: Token malformed');
  
    const decoded = jwt.verify(authToken, jwtSecret) as JwtPayload;
      if(!decoded) throw new Error('Unauthorized: Invalid token');
    
     const role: string = decoded?.role ?? 'user'
     const userEmail: string = decoded?.userEmail
     const userName: string = decoded?.userName
  
    return generatePolicy(userName , 'Allow', event.methodArn, role, userEmail );
    
  } catch (err) {
    console.error('Authorization error:', err);
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};




