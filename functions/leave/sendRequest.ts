import {  APIGatewayProxyResult } from 'aws-lambda';
import { sendMail } from '../../utils/sendMail';
import { sendRequestEmail } from '../../utils/emailTemplates/applyRequestEmail';
import { response } from '../../utils/response';
import { sendError } from '../../utils/error';

const adminEmail = process.env.SES_SENDER_EMAIL as string

export const handler = async (event: sendRequestFunctionEventType): Promise<APIGatewayProxyResult> => {
  try {
    const {userName, leaveId, taskToken, apiBaseUrl } = event;

    const approveUrl = `${apiBaseUrl}/users/${userName}/leave-request/${leaveId}?action=approved&requestToken=${encodeURIComponent(taskToken)}`;
    const rejectUrl = `${apiBaseUrl}/users/${userName}/leave-request/${leaveId}?action=rejected&requestToken=${encodeURIComponent(taskToken)}`;
    
    await sendMail([adminEmail], sendRequestEmail({...event, approveUrl, rejectUrl}), 'Leave Request', adminEmail)
    
    return response(200, 'Email sent successfully' );

  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
