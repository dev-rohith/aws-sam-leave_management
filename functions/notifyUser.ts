import { APIGatewayProxyResult } from 'aws-lambda';
import { generateRejectionEmail } from '../utils/emailTemplates/rejectedEmail';
import { generateApprovalEmail } from '../utils/emailTemplates/approvedEmail';
import { sendMail } from '../utils/sendMail';
import { createResponse } from '../utils/response';

 const adminEmail = process.env.SES_SENDER_EMAIL || "";


export const handler = async (event: LeaveApprovalEvent): Promise<APIGatewayProxyResult> => {
  const {approvalStatus, userEmail} = event as LeaveApprovalEvent
  try {
    
      if(approvalStatus === 'APPROVED'){
        const approvedMailTemplate = generateApprovalEmail({...event, adminEmail})
        await sendMail([userEmail], approvedMailTemplate, "Your leave request was got Approved", adminEmail)
        return createResponse(200,'Approved Mail sent successfully' )
       }
        
        const rejectedMailTemplate: string = generateRejectionEmail({...event, adminEmail})
        await sendMail([userEmail], rejectedMailTemplate, "Your leave request was got Rejected", adminEmail)
        return createResponse(200, 'Rejected Mail sent successfully')     
      
     
  } catch (err) {
    console.error(err);
    return  createResponse(500, 'Internal Server Error' )
  }
};
