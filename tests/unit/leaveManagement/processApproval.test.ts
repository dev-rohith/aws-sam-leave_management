import { handler } from '../../../functions/approveLeaveAction';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SFNClient, SendTaskSuccessCommand } from '@aws-sdk/client-sfn';
import { createResponse } from '../../../functions/utils/response';

jest.mock('../../../functions/utils/response', () => ({
  createResponse: jest.fn(),
}));

const ddbMock = mockClient(DynamoDBDocumentClient);
const sfnMock = mockClient(SFNClient);

process.env.TABLE_NAME = 'LeaveManagementByRohith';
process.env.AWS_REGION = 'us-east-1';

describe('approveLeaveAction handler', () => {
  beforeEach(() => {
    ddbMock.reset();
    sfnMock.reset();
    jest.clearAllMocks();
  });

  it('should return 400 for missing parameters', async () => {
    const event = {
      pathParameters: {},
      queryStringParameters: {},
    } as any;

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 400, body: 'Missing or invalid parameters.' });

    const result = await handler(event);

    expect(createResponse).toHaveBeenCalledWith(400, 'Missing or invalid parameters.');
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 for invalid action parameter', async () => {
    const event = {
      pathParameters: { leaveId: '123', userName: 'user1' },
      queryStringParameters: { action: 'maybe', requestToken: 'token123' },
    } as any;

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 400, body: 'Missing or invalid parameters.' });

    const result = await handler(event);

    expect(createResponse).toHaveBeenCalledWith(400, 'Missing or invalid parameters.');
    expect(result.statusCode).toBe(400);
  });

  it('should update DynamoDB and send task success for APPROVED', async () => {
    const event = {
      pathParameters: { leaveId: '123', userName: 'user1' },
      queryStringParameters: { action: 'approved', requestToken: 'token123' },
    } as any;

    ddbMock.on(UpdateCommand).resolves({});
    sfnMock.on(SendTaskSuccessCommand).resolves({});

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 200, body: 'Successfully processed action !!' });

    const result = await handler(event);

    expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
      TableName: 'LeaveManagementByRohith',
      Key: {
        PK: 'PK#user1',
        SK: 'LEAVE#123',
      },
      UpdateExpression: 'SET #status = :action',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':action': 'APPROVED',
      },
    });

    expect(sfnMock).toHaveReceivedCommandWith(SendTaskSuccessCommand, {
      taskToken: 'token123',
      output: JSON.stringify({ approvalStatus: 'APPROVED' }),
    });

    expect(createResponse).toHaveBeenCalledWith(200, 'Successfully processed action !!');
    expect(result.statusCode).toBe(200);
  });

  it('should update DynamoDB and send task success for REJECTED', async () => {
    const event = {
      pathParameters: { leaveId: '456', userName: 'user2' },
      queryStringParameters: { action: 'rejected', requestToken: 'token456' },
    } as any;

    ddbMock.on(UpdateCommand).resolves({});
    sfnMock.on(SendTaskSuccessCommand).resolves({});

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 200, body: 'Successfully processed action !!' });

    const result = await handler(event);

    expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, expect.any(Object));
    expect(sfnMock).toHaveReceivedCommandWith(SendTaskSuccessCommand, {
      taskToken: 'token456',
      output: JSON.stringify({ approvalStatus: 'REJECTED' }),
    });

    expect(result.statusCode).toBe(200);
  });

  it('should return 500 if DynamoDB update fails', async () => {
    const event = {
      pathParameters: { leaveId: '123', userName: 'user1' },
      queryStringParameters: { action: 'approved', requestToken: 'token123' },
    } as any;

    ddbMock.on(UpdateCommand).rejects(new Error('DynamoDB failure'));

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 500, body: 'Internal Server Error' });

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(createResponse).toHaveBeenCalledWith(500, 'Internal Server Error', expect.any(Object));
  });

  it('should return 500 if Step Function command fails', async () => {
    const event = {
      pathParameters: { leaveId: '123', userName: 'user1' },
      queryStringParameters: { action: 'approved', requestToken: 'token123' },
    } as any;

    ddbMock.on(UpdateCommand).resolves({});
    sfnMock.on(SendTaskSuccessCommand).rejects(new Error('StepFunction error'));

    (createResponse as jest.Mock).mockReturnValue({ statusCode: 500, body: 'Internal Server Error' });

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(createResponse).toHaveBeenCalledWith(500, 'Internal Server Error', expect.any(Object));
  });
});
