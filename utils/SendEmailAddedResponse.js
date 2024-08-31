const sgMail = require("@sendgrid/mail");


const SendEmailAddedResponse = async (options) => {
    const sendGridAPIKey = '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';
    console.log("inside email")
    // const sendGridAPIKey = sendGridAPIKey;
    const EMAIL_FROM = options.EMAIL_FROM;
    sgMail.setApiKey(sendGridAPIKey);
    try {
        await sgMail.send({
            to: options.to,
            from: EMAIL_FROM,
            subject: options.subject,
            html: options.text,
        });
    } catch (error) {
        console.error("error- ", error);
    }
};

module.exports = SendEmailAddedResponse 
