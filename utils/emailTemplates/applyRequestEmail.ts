interface sendRequestEmailType extends sendRequestFunctionEventType {
  approveUrl: string;
  rejectUrl: string;
}

export function sendRequestEmail({leaveId, userName, userEmail, approveUrl, rejectUrl, startDate, endDate, reason}: sendRequestEmailType) {
  return (
     `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Leave Approval Request</title>
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
            Action required: Leave request awaiting your approval - ${userName} has requested time off from ${startDate} to ${endDate}.
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
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: #ffffff;">
                              <tr>
                                <td align="center" valign="middle" style="padding: 15px;">
                                  <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" width="40" height="40" alt="Calendar icon" style="display: block; border: 0; outline: none; text-decoration: none;">
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: bold; font-family: Arial, sans-serif; line-height: 36px;">LEAVE REQUEST APPROVAL</h1>
                            <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.85); font-size: 16px; font-family: Arial, sans-serif;">A team member is awaiting your decision</p>
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
                          <td align="center" style="padding-bottom: 30px;">
                            <h2 style="margin: 0; color: #0047ab; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif; line-height: 30px;">Leave Request Details</h2>
                            <div style="height: 3px; width: 60px; background-color: #0047ab; background-image: linear-gradient(to right, #0047ab, #1e90ff); margin-top: 15px;"></div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">One of your team members has submitted a leave request that requires your immediate review and action:</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 25px; background-color: #f0f7ff; border-left: 4px solid #0047ab; border-radius: 8px; margin-bottom: 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 15px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td width="130" style="color: #0047ab; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Request ID:</td>
                                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${leaveId}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 15px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td width="130" style="color: #0047ab; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Employee:</td>
                                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${userName}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 15px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td width="130" style="color: #0047ab; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Email:</td>
                                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${userEmail}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 15px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td width="130" style="color: #0047ab; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Period:</td>
                                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${startDate} to ${endDate}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td width="130" style="color: #0047ab; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">Reason:</td>
                                      <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">${reason}</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 25px 0 20px;">
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">Please review the details above and take appropriate action:</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <!-- Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="48%" style="padding-right: 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td bgcolor="#0047ab" style="background-color: #0047ab; background-image: linear-gradient(to right, #0047ab, #1e90ff); border-radius: 8px; padding: 15px 10px; text-align: center;">
                                        <a href="${approveUrl}" target="_blank" style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; text-decoration: none; display: block;">APPROVE REQUEST</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td width="48%" style="padding-left: 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td bgcolor="#e53e3e" style="background-color: #e53e3e; background-image: linear-gradient(to right, #e53e3e, #f56565); border-radius: 8px; padding: 15px 10px; text-align: center;">
                                        <a href="${rejectUrl}" target="_blank" style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif; text-decoration: none; display: block;">DECLINE REQUEST</a>
                                      </td>
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
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 15px; line-height: 24px; color: #333333;"><strong>Important:</strong> Your prompt action is appreciated. If you need additional information about this request, please contact the employee directly or reach out to the HR department.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td bgcolor="#f0f7ff" style="background-color: #f0f7ff; padding: 25px; text-align: center;">
                      <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #718096;">This is an automated message from the Antstack Leave Management System.<br>Please do not reply to this email.</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #718096;">© 2025 Antstack Team. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`
  )
}