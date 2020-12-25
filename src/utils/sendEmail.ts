import nodemailer from "nodemailer";

export const sendEmail = async (to: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    auth: {
      user: "me@devavi.xyz",
      pass: "Avis.@2002",
    },
  });

  const info = await transporter.sendMail({
    from: '"LiReddit - Dev. Avi" <me@devavi.xyz>',
    to,
    subject: "Change password - LiReddit",
    html: text,
  });

  console.log("Message sent: %s", info.messageId);
};
