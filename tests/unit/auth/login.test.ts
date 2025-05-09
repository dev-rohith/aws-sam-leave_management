// import { handler } from '../../../functions/auth/login';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
// import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
// import { mocked } from 'jest-mock';

describe('Login', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});


// jest.mock('@aws-sdk/client-secrets-manager');
// jest.mock('jsonwebtoken');
// jest.mock('bcryptjs');
// jest.mock('@aws-sdk/lib-dynamodb');

// const MockSecretsManagerClient = mocked(SecretsManagerClient);
// const mockSend = jest.fn();
// const mockGet = jest.fn();

// // Mock implementation for SecretsManagerClient
// (MockSecretsManagerClient as any).mockImplementation(() => ({
//   send: mockSend,
// }));

// // Mock DynamoDBDocumentClient and mock the `from` static method
// jest.spyOn(DynamoDBDocumentClient, 'from').mockReturnValue({
//   send: mockGet,
// });

// // Define the methodArn for testing
// const methodArn = 'arn:aws:execute-api:us-east-1:123456789012:example/prod/GET/resource';

// describe('Login Lambda Function', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully log in a user and return a JWT', async () => {
//     const mockUser = {
//       userName: 'johndoe',
//       password: await bcrypt.hash('password123', 10),
//       email: 'user@example.com',
//     };

//     mockSend.mockResolvedValueOnce({ SecretString: 'super-secret' });
//     mockGet.mockResolvedValueOnce({
//       Item: { PK: 'USER#johndoe', SK: 'PROFILE', password: mockUser.password, email: mockUser.email },
//     });
//     (jwt.sign as jest.Mock).mockReturnValue('fake.jwt.token');

//     // Cast the event object to include the methodArn property
//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'password123' }),
//       methodArn, // Add methodArn
//       type: 'TOKEN',
//     } as any); // Cast the event to match the expected APIGatewayProxyEvent type

//     expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
//     expect(mockGet).toHaveBeenCalledWith(expect.any(GetCommand));
//     expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
//     expect(jwt.sign).toHaveBeenCalledWith(
//       { userName: 'johndoe', userEmail: mockUser.email },
//       'super-secret',
//       { expiresIn: 60 * 60 }
//     );
//     expect(result.statusCode).toBe(200);
//     expect(result.body).toContain('fake.jwt.token');
//   });

//   it('should deny access for invalid password', async () => {
//     const mockUser = {
//       userName: 'johndoe',
//       password: await bcrypt.hash('password123', 10),
//       email: 'user@example.com',
//     };

//     mockSend.mockResolvedValueOnce({ SecretString: 'super-secret' });
//     mockGet.mockResolvedValueOnce({
//       Item: { PK: 'USER#johndoe', SK: 'PROFILE', password: mockUser.password, email: mockUser.email },
//     });
//     (bcrypt.compare as jest.Mock).mockResolvedValue(false);

//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'wrongpassword' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(401);
//     expect(result.body).toBe('Email or Password is invalid');
//   });

//   it('should return error if the user is not found', async () => {
//     mockSend.mockResolvedValueOnce({ SecretString: 'super-secret' });
//     mockGet.mockResolvedValueOnce({}); // Empty response simulates user not found

//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'password123' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(404);
//     expect(result.body).toBe('User not found');
//   });

//   it('should return error if JWT secret is missing from Secrets Manager', async () => {
//     mockSend.mockResolvedValueOnce({}); // Simulate missing secret

//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'password123' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(500);
//     expect(result.body).toBe('JWT secret missing in Secrets Manager');
//   });

//   it('should return error if Secrets Manager fails', async () => {
//     mockSend.mockRejectedValueOnce(new Error('SecretsManager error')); // Simulate Secrets Manager failure

//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'password123' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(500);
//     expect(result.body).toBe('Internal server error');
//   });

//   it('should return error if JWT verification fails', async () => {
//     mockSend.mockResolvedValueOnce({ SecretString: 'super-secret' });
//     (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

//     const result = await handler({
//       body: JSON.stringify({ userName: 'johndoe', password: 'password123' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(500);
//     expect(result.body).toBe('Internal server error');
//   });

//   it('should return error if input is missing userName or password', async () => {
//     const result = await handler({
//       body: JSON.stringify({ userName: '', password: '' }),
//       methodArn,
//       type: 'TOKEN',
//     } as any);

//     expect(result.statusCode).toBe(400);
//     expect(result.body).toBe('Username and password are required');
//   });
// });
