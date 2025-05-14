import { APIGatewayProxyEvent } from 'aws-lambda';
import { createEvent } from '../event'; 

const mockDynamoSend = jest.fn();
const mockSfnSend = jest.fn();
const mockSendTaskSuccess = jest.fn();
const mockResponse = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockDynamoSend,
      })),
    },
    UpdateCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/client-sfn', () => ({
  SFNClient: jest.fn().mockImplementation(() => ({
    send: mockSfnSend,
  })),
  SendTaskSuccessCommand: mockSendTaskSuccess,
}));

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(),
}));

jest.mock('../../../utils/response', () => ({
  response: mockResponse.mockImplementation((statusCode, message, data) => ({
    statusCode: statusCode,
    body: JSON.stringify({ message: message, ...(data && { test: data }) }),
  })),
}));

import { handler } from '../../../functions/processRequest';

describe('approveLeave Lambda Function', () => {
  let event: APIGatewayProxyEvent;

  beforeEach(() => {
    jest.clearAllMocks();

    event = createEvent({
      pathParameters: {
        leaveId: '123',
        userName: 'john.doe',
      },
      queryStringParameters: {
        action: 'approved',
        requestToken: 'sample-request-token',
      },
    });
    
    process.env.TABLE_NAME = 'test-table';
  });

  it('should return 400 when parameters are missing', async () => {
    event.pathParameters = {} as any;
    let res = await handler(event);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe("Missing or invalid parameters.");

    event = createEvent({
      pathParameters: { leaveId: '123', userName: 'john.doe' },
      queryStringParameters: { action: 'invalid', requestToken: 'token' },
    });
    res = await handler(event);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).message).toBe("Missing or invalid parameters.");
  });

  it('should update the leave status and call Step Functions successfully', async () => {
    event = createEvent({
      pathParameters: { leaveId: '123', userName: 'john.doe' },
      queryStringParameters: { action: 'approved', requestToken: 'sample-token' },
    });

    mockDynamoSend.mockResolvedValueOnce({});
    mockSfnSend.mockResolvedValueOnce({});

    const res = await handler(event);

    expect(mockDynamoSend).toHaveBeenCalled();
    
    expect(mockSendTaskSuccess).toHaveBeenCalledWith({
      taskToken: 'sample-token',
      output: JSON.stringify({ approvalStatus: 'APPROVED' }),
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).message).toBe("Successfully processed action !!");
  });

  it('should return 500 when an error occurs during DynamoDB update', async () => {
    event = createEvent({
      pathParameters: { leaveId: '123', userName: 'john.doe' },
      queryStringParameters: { action: 'approved', requestToken: 'sample-token' },
    });

    mockDynamoSend.mockRejectedValueOnce(new Error('DynamoDB error'));

    const res = await handler(event);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe("Internal Server Error");
    expect(JSON.parse(res.body).test.message).toBe('DynamoDB error');
  });

  it('should return 500 when an error occurs during Step Functions', async () => {
    event = createEvent({
      pathParameters: { leaveId: '123', userName: 'john.doe' },
      queryStringParameters: { action: 'approved', requestToken: 'sample-token' },
    });

    mockDynamoSend.mockResolvedValueOnce({});
    mockSfnSend.mockRejectedValueOnce(new Error('Step Functions error'));

    const res = await handler(event);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body).message).toBe("Internal Server Error");
    expect(JSON.parse(res.body).test.message).toBe('Step Functions error');
  });
});