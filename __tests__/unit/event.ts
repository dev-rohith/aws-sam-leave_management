import { APIGatewayProxyEvent } from "aws-lambda";

export const createEvent = (body: any = null): APIGatewayProxyEvent => ({
  body: body ? JSON.stringify(body) : null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "POST",
  isBase64Encoded: false,
  path: "/leave/apply",
  pathParameters: null,
  queryStringParameters: {},
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: "123456789012",
    apiId: "api-id",
    authorizer: {
      userEmail: "john.doe@example.com",
      principalId: "user123",
    },
    protocol: "HTTP/1.1",
    httpMethod: "POST",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "127.0.0.1",
      user: null,
      userAgent: "PostmanRuntime",
      userArn: null
    },
    path: "/leave/apply",
    stage: "Prod",
    requestId: "request-id",
    requestTimeEpoch: 0,
    resourceId: "resource-id",
    resourcePath: "/leave/apply"
  },
  resource: "/leave/apply"
});
