interface generateRejectedMailType extends LeaveApprovalEvent {
  adminEmail: string
}

export function generateRejectionEmail({leaveId, adminEmail, userName, leaveStartDate, leaveEndDate, reason}: generateRejectedMailType) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Leave Request Rejected</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse; border: 0; border-spacing: 0; margin: 0;}
    div, td {padding: 0;}
    div {margin: 0 !important;}
  </style>
  <noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f5f8fb; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Arial, sans-serif; line-height: 24px; color: #333333; font-size: 16px;">
  <div style="display: none; font-size: 1px; color: #f5f8fb; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Important notification: Your leave request from ${leaveStartDate} to ${leaveEndDate} has been declined.
  </div>
  
  <!-- Email wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="min-width: 100%; background-color: #f5f8fb;">
    <tr>
      <td align="center" valign="top" style="padding: 30px 10px;">
        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td bgcolor="#0047ab" align="center" style="background-color: #0047ab; background-image: linear-gradient(to right, #0047ab, #1e90ff); padding: 30px 20px; text-align: center;">
              <!-- Header content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 80px; height: 40px; margin-bottom: 20px; border-radius: 50%; background-color: #e53e3e; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: bold; font-family: Arial, sans-serif; line-height: 36px;">LEAVE REQUEST DECLINED</h1>
                    <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 16px; font-family: Arial, sans-serif;">Your leave request was not approved</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- White Body Content -->
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 30px;">
                    <h2 style="margin: 0; color: #e53e3e; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif; line-height: 30px; text-align: center;">Leave Request Update</h2>
                    <div style="height: 3px; width: 60px; background-color: #e53e3e; margin: 15px auto 0;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; text-align: center;">Hi ${userName}, we regret to inform you that your leave request has been <strong style="color: #e53e3e;">declined</strong> by ${adminEmail}.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 25px; background-color: #fff5f5; border-left: 4px solid #e53e3e; border-radius: 8px; margin-bottom: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="130" style="color: #e53e3e; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Request ID:</td>
                              <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${leaveId}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="130" style="color: #e53e3e; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Period:</td>
                              <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${leaveStartDate} to ${leaveEndDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="130" style="color: #e53e3e; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Reason:</td>
                              <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${reason}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 0;">
                    <div style="height: 1px; background-color: #e2e8f0; margin: 0;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f8f9fa; border-left: 3px solid #718096; border-radius: 8px;">
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333333;"><strong>Next steps:</strong> Please contact your supervisor or HR department if you need to discuss this further or would like to submit a revised request.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td bgcolor="#f0f7ff" style="background-color: #f0f7ff; padding: 25px; text-align: center;">
              <img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfSLjJrK9dyI94flaHgfa17r3VGGGe4Z6R4c4ZWWEkogYJ0ml-9o26zj8o9ikGCYZkI-r0PIK0KiB71TdXSmGkskSSBnQNnckdm25qXoVHag03D0cymD_WE16LsPjPUKWwLfZ6pTQ?key=CTtMt9eN0RMHkXyz1NpkjA" width="140" alt="Antstack Logo" style="display: inline-block; border: 0; outline: none; text-decoration: none; margin-bottom: 20px;">
              <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #718096;">This is an automated message from the Antstack Leave Management System.<br>Please do not reply to this email.</p>
              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #718096;">© 2025 Antstack Team. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}