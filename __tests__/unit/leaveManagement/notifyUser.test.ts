import { handler } from '../../../functions/notifyUser';  
import { response } from '../../../utils/response';
import { sendMail } from '../../../utils/sendMail';
import { generateApprovalEmail } from '../../../utils/emailTemplates/approvedEmail'; 
import { generateRejectionEmail } from '../../../utils/emailTemplates/rejectedEmail'; 

jest.mock('../utils/response', () => ({
  response: jest.fn(),
}));

jest.mock('../utils/sendMail', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../utils/emailTemplates/approvedEmail', () => ({
  generateApprovalEmail: jest.fn(),
}));

jest.mock('../utils/emailTemplates/rejectedEmail', () => ({
  generateRejectionEmail: jest.fn(),
}));

describe('Leave Approval Handler', () => {
  const mockEvent: LeaveApprovalEvent = {
    approvalStatus: 'APPROVED', 
    userEmail: 'user@example.com',
    leaveId: '1',
    startDate: '2025-05-15', 
    endDate: '2025-05-20',
    reason: 'Vacation',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an approval email when approvalStatus is "APPROVED"', async () => {
    const mockApprovedEmail = 'approved-email-template';
    generateApprovalEmail.mockReturnValue(mockApprovedEmail);
    sendMail.mockResolvedValue(null); 
    response.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'Approved Mail sent successfully' }),
    });

    const result = await handler(mockEvent);

    expect(generateApprovalEmail).toHaveBeenCalledWith({
      ...mockEvent,
      adminEmail: process.env.SES_SENDER_EMAIL,
    });
    expect(sendMail).toHaveBeenCalledWith(
      [mockEvent.userEmail],
      mockApprovedEmail,
      "Your leave request was got Approved",
      process.env.SES_SENDER_EMAIL
    );
    expect(response).toHaveBeenCalledWith(200, 'Approved Mail sent successfully');
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Approved Mail sent successfully');
  });

  it('should send a rejection email when approvalStatus is "REJECTED"', async () => {
    const mockRejectedEmail = 'rejected-email-template';
    const mockEventRejected = { ...mockEvent, approvalStatus: 'REJECTED' };
    generateRejectionEmail.mockReturnValue(mockRejectedEmail);
    sendMail.mockResolvedValue(null);  // Mock successful mail sending
    response.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'Rejected Mail sent successfully' }),
    });

    const result = await handler(mockEventRejected);

    expect(generateRejectionEmail).toHaveBeenCalledWith({
      ...mockEventRejected,
      adminEmail: process.env.SES_SENDER_EMAIL,
    });
    expect(sendMail).toHaveBeenCalledWith(
      [mockEventRejected.userEmail],
      mockRejectedEmail,
      "Your leave request was got Rejected",
      process.env.SES_SENDER_EMAIL
    );
    expect(response).toHaveBeenCalledWith(200, 'Rejected Mail sent successfully');
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Rejected Mail sent successfully');
  });

  it('should handle errors and return an internal server error response', async () => {
    const mockEventWithError = { ...mockEvent, approvalStatus: 'APPROVED' };
    generateApprovalEmail.mockImplementation(() => {
      throw new Error('Something went wrong');
    });
    response.mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });

    const result = await handler(mockEventWithError);

    expect(response).toHaveBeenCalledWith(500, 'Internal Server Error');
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Internal Server Error');
  });
});

