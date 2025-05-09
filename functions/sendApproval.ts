import {  APIGatewayProxyResult } from 'aws-lambda';
import { sendMail } from '../utils/sendMail';
import { sendApprovalEmail } from '../utils/emailTemplates/applyRequestEmail';
import { createResponse } from '../utils/response';

const adminEmail: string = process.env.SES_SENDER_EMAIL ?? ''

export const handler = async (event: SendApprovalFunctionEventType): Promise<APIGatewayProxyResult> => {
  try {
    const {userName, leaveId, taskToken, apiBaseUrl } = event;

    const approveUrl = `${apiBaseUrl}/users/${userName}/leave-request/${leaveId}?action=approved&requestToken=${encodeURIComponent(taskToken)}`;
    const rejectUrl = `${apiBaseUrl}/users/${userName}/leave-request/${leaveId}?action=rejected&requestToken=${encodeURIComponent(taskToken)}`;
    
    await sendMail([adminEmail], sendApprovalEmail({...event, approveUrl, rejectUrl}), 'Leave Request', adminEmail)
    
    return createResponse(200, 'Email sent successfully' );

  } catch (err) {
    console.error(err);
    return createResponse(500, 'Internal Server Error', {error: err});
  }
};
