import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, message) => {
  const mailOptions = mailOptionObject(to, subject, message);

  const response = new Promise((resolve, reject) => {
    transporter
      .sendMail(mailOptions)
      .then((msg) => {
        resolve({
          statusCode: 200,
          data: {
            message:
              "A verification email has been sent to " +
              to +
              ". It will be expire after 15 minutes. If you not get verification Email click on resend token.",
          },
        });
      })
      .catch((err) => {
        reject({
          statusCode: 500,
          msg: "Technical Issue!, Please click on resend for verify your Email.",
        });
      });
  });

  return response;
};

const emailVerificationTemplate = (name, verificationUrl) => {
  return (
    "Hello " +
    name +
    "<br/>" +
    `Click <a href = '${verificationUrl}'>here</a> to confirm your Account.` +
    "<br/> Thank You!\n"
  );
};

const mailOptionObject = (receiverEmail, subject, message) => {
  return {
    from: "no-reply@gmail.com",
    to: receiverEmail,
    subject: subject,
    html: message,
  };
};

export { emailVerificationTemplate, sendEmail };
