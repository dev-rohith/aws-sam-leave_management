import { handler } from '../../../functions/sendRequest';
import { sendMail } from '../../../utils/sendMail';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { response } from '../../../utils/response';
import { sendRequestEmail } from '../../../utils/emailTemplates/applyRequestEmail';

jest.mock('../../../utils/sendMail');
jest.mock('../../../utils/emailTemplates/applyRequestEmail', () => ({
  sendRequestEmail: jest.fn(),
}));
jest.mock('@aws-sdk/client-ses', () => {
  return {
    SESClient: jest.fn(),
    SendEmailCommand: jest.fn().mockImplementation(() => ({ 
      send: jest.fn().mockResolvedValueOnce({}), 
    })),
  };
});

describe('Send Approval Email Lambda', () => {
  let mockSendMail: jest.Mock;
  let mockSendEmailCommand: jest.Mock;

  const mockEvent = {
    userName: 'johnDoe',
    leaveId: '12345',
    taskToken: 'abcde12345',
    apiBaseUrl: 'https://api.example.com',
  };

  beforeEach(() => {
    mockSendMail = sendMail as jest.Mock;
    mockSendEmailCommand = SendEmailCommand as jest.Mock;
    process.env.SES_SENDER_EMAIL = 'test@domain.com';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    mockSendMail.mockResolvedValueOnce({});
    const result = await handler(mockEvent as any);

    expect(mockSendMail).toHaveBeenCalledWith(
      ['test@domain.com'],
      expect.any(String),
      'Leave Request',
      'test@domain.com'
    );

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Email sent successfully');
  });

  it('should handle error when sendMail fails', async () => {
    const error = new Error('SES error');
    mockSendMail.mockRejectedValueOnce(error);

    const result = await handler(mockEvent as any);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
    expect(JSON.parse(result.body).error).toBe(error.message);
  });

  it('should create the correct email body and URLs', async () => {
    mockSendMail.mockResolvedValueOnce({});

    const approveUrl = `${mockEvent.apiBaseUrl}/users/${mockEvent.userName}/leave-request/${mockEvent.leaveId}?action=approved&requestToken=${encodeURIComponent(mockEvent.taskToken)}`;
    const rejectUrl = `${mockEvent.apiBaseUrl}/users/${mockEvent.userName}/leave-request/${mockEvent.leaveId}?action=rejected&requestToken=${encodeURIComponent(mockEvent.taskToken)}`;
    await handler(mockEvent as any);

    expect(sendRequestEmail).toHaveBeenCalledWith({
      ...mockEvent,
      approveUrl,
      rejectUrl,
    });
  });

  it('should mock SES client send method correctly', async () => {
    const mockSendResponse = { MessageId: '12345' };
    const mockSendEmailCommandInstance = new SendEmailCommand({});
    mockSendEmailCommandInstance.send.mockResolvedValueOnce(mockSendResponse);

    const result = await handler(mockEvent as any);

    expect(mockSendEmailCommandInstance.send).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Email sent successfully');
  });
});
