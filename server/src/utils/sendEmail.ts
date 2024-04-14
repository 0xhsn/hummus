import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});


// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <admin@reddit.com>', // sender address
    to, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
