const nodemailer = require('nodemailer');
const config = require('../config');

const sendConfirmationMail = ({ toUser, hash }, callback) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.GOOGLE_USER,
      pass: config.GOOGLE_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.GOOGLE_USER,
    // to: config.GOOGLE_USER, // #note testing opt rm
    to: toUser.email,
    subject: 'Confirm Email - Vue Meetuper Team',
    html: `<h3>Hello ${toUser.name}</h3>
    <p>Thank you for registering into Vue Meetuper. Much Appreciated! Just one last step is lying ahead of you...</p>
    <p><b>To Activate your account please follow this link:<b></p>
    <a href="${config.DOMAIN_NAME}/${hash}/activate" target="_"><b>${config.DOMAIN_NAME}/activate</b></a>
    <p>Regards,</p>
    <p>Your Vue Meetuper Team © SSI(SiteSourceInc)</p>`,
  };

  // #note callback can also get only 'errors' 'argument'. opt
  transporter.sendMail(mailOptions, (errors, _) => {
    if (errors) {
      callback(errors, null);
    } else {
      console.log('Confirmation Email Sent'); // opt rm
      callback(null, _);
    }
  });
};

module.exports = sendConfirmationMail;
