import sendgrid from '@sendgrid/mail'

class SendMailService {

    constructor() {
    }

    async sendMail(to: string, subject: string, html: string) {

        const SENDGRID_API_KEY: string = (process.env.SENDGRID_API_KEY as string);
        sendgrid.setApiKey(SENDGRID_API_KEY);

        const msg = {
        to: to,
        from: "acano@accionpoint.com",
        subject: subject,
        text: html,
        html: html,
        };

        sendgrid.send(msg);
    }

}

export default new SendMailService();

