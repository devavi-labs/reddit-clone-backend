import nodemailer from "nodemailer";

export const sendEmail = async (to: string, text: string) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "jbckdx4piz2xjfbp@ethereal.email",
      pass: "BbDYJjghdHUmStHXbg",
    },
    tls: { rejectUnauthorized: false },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Change password",
    html: text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
