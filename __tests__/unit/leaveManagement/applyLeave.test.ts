import { handler } from '../../../functions/applyLeave';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { createEvent } from '../event';

const ddbMock = mockClient(DynamoDBDocumentClient);
const sfnMock = mockClient(SFNClient);

process.env.TABLE_NAME = 'LeaveManagementByRohith';
process.env.STATE_MACHINE_ARN = 'arn:aws:states:us-east-1:123456789012:stateMachine:test-state-machine';

describe('Apply Leave Lambda Function', () => {
  beforeEach(() => {
    ddbMock.reset();
    sfnMock.reset();

    ddbMock.on(PutCommand).resolves({});
    sfnMock.on(StartExecutionCommand).resolves({
      executionArn: 'test-execution-arn',
      startDate: new Date(),
    });
  });

  it('should successfully process a valid leave request', async () => {
    const event = createEvent({
      name: 'John Doe',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      reason: 'Family vacation',
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual({ message: 'Leave applied successfully' });

    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: 'LeaveManagementByRohith',
      Item: expect.objectContaining({
        PK: 'PK#user123',
        SK: expect.stringMatching(/^LEAVE#/),
        email: 'john.doe@example.com',
        startDate: '2025-05-15',
        endDate: '2025-05-20',
        status: 'PENDING',
      }),
    });

    expect(sfnMock).toHaveReceivedCommandWith(StartExecutionCommand, {
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: expect.any(String), 
    });
  });

  it('should return 400 when required fields are missing', async () => {
    const event = createEvent({
      name: 'John Doe',
      startDate: '2025-05-15',
      reason: 'Family vacation',
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toStrictEqual({
      message: 'name,leave startDate and endDate, leave reason is required for leaveRequest',
    });

    expect(ddbMock).not.toHaveReceivedCommand(PutCommand);
    expect(sfnMock).not.toHaveReceivedCommand(StartExecutionCommand);
  });

  it('should return 400 when body is missing', async () => {
    const event = createEvent();

    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toStrictEqual({
      message: 'name,leave startDate and endDate, leave reason is required for leaveRequest',
    });
  });

  it('should return 500 when DynamoDB operation fails', async () => {
    ddbMock.on(PutCommand).rejects(new Error('Database error'));

    const event = createEvent({
      name: 'John Doe',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      reason: 'Family vacation',
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Internal server Error',
    });
  });

  it('should return 500 when Step Functions operation fails', async () => {
    sfnMock.on(StartExecutionCommand).rejects(new Error('Step Functions error'));

    const event = createEvent({
      name: 'John Doe',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      reason: 'Family vacation',
    });

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Internal server Error',
    });
  });
});
