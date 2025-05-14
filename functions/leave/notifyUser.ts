import { APIGatewayProxyResult } from 'aws-lambda';
import { generateRejectionEmail } from '../../utils/emailTemplates/rejectedEmail';
import { generateApprovalEmail } from '../../utils/emailTemplates/approvedEmail';
import { sendMail } from '../../utils/sendMail';
import { response } from '../../utils/response';
import { sendError } from '../../utils/error';

 const adminEmail = process.env.SES_SENDER_EMAIL as string

export const handler = async (event: LeaveApprovalEvent): Promise<APIGatewayProxyResult> => {
  try {
    const {approvalStatus, userEmail}: LeaveApprovalEvent = event
    
      if(approvalStatus === 'APPROVED'){
        const approvedMailTemplate = generateApprovalEmail({...event, adminEmail})
        await sendMail([userEmail], approvedMailTemplate, "Your leave request was got Approved", adminEmail)
        return response(200,'Approved Mail sent successfully' )
       }
        
        const rejectedMailTemplate: string = generateRejectionEmail({...event, adminEmail})
        await sendMail([userEmail], rejectedMailTemplate, "Your leave request was got Rejected", adminEmail)
        return response(200, 'Rejected Mail sent successfully')     
     
  } catch (err) {
    console.error(err);
    return sendError(500, err);
  }
};
