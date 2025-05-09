import { APIGatewayAuthorizerResult } from "aws-lambda";

export interface ApiResponse {
    statusCode: number;
    body: string;
    headers?: { [key: string]: string };
  }
  
  export const createResponse = (
    statusCode: number,
    message: string,
    data?: object,
    headers?: { [key: string]: string }
  ): ApiResponse => {
    return {
      statusCode,
      body: JSON.stringify({ message, data }),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  };


export function generatePolicy(
    principalId: string,
    effect: 'Allow' | 'Deny',
    resource: string,
    role?: string,
    mail?: string
  ): APIGatewayAuthorizerResult {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context: {
        userRole: role,
        userEmail: mail
      },
    };
  }