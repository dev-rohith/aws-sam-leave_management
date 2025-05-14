import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
const ses = new SESClient({ region: process.env.AWS_REGION });

export const sendMail = async ([...receivers]: string[], htmlTemplate: string, subject: string, sender: string) => {
    return ses.send(new SendEmailCommand({
        Destination: { ToAddresses: [...receivers] },
        Message: {
          Body: {
            Html: {
              Data: htmlTemplate
            }
          },
          Subject: { Data: subject }
        },
        Source: sender
      }));
}