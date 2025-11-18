const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email
exports.sendEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.EMAIL_FROM_NAME || 'Workforce Social Network'} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error('Error sending email');
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Welcome to Workforce Social Network!</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for joining our platform. We're excited to have you on board!</p>
    <p>You can now:</p>
    <ul>
      <li>Connect with colleagues</li>
      <li>Share updates and ideas</li>
      <li>Collaborate on tasks</li>
      <li>Track your performance</li>
    </ul>
    <p>Get started by completing your profile and connecting with your team.</p>
    <p>Best regards,<br>The Workforce Team</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: 'Welcome to Workforce Social Network',
    html
  });
};

// Send task assignment email
exports.sendTaskAssignmentEmail = async (user, task) => {
  const html = `
    <h1>New Task Assigned</h1>
    <p>Hi ${user.name},</p>
    <p>You have been assigned a new task:</p>
    <h2>${task.title}</h2>
    <p>${task.description || 'No description provided'}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
    <p>Log in to the platform to view more details.</p>
    <p>Best regards,<br>The Workforce Team</p>
  `;

  await this.sendEmail({
    email: user.email,
    subject: `New Task Assigned: ${task.title}`,
    html
  });
};
