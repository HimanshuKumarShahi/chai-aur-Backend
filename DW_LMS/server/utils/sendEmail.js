import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password
      },
    });

    const firstName = userName ? userName.split(" ")[0] : "Scholar";

    const htmlContent = `
      <div style="background-color: #050505; color: #ffffff; padding: 50px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; border-radius: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #27272a; padding: 40px; border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <h1 style="color: #f97316; font-size: 12px; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 20px;">System Initialized</h1>
          
          <h2 style="font-size: 32px; font-weight: 900; font-style: italic; margin-bottom: 10px; tracking: -1px;">
            WELCOME TO THE <span style="color: #f97316;">CODEVERSE.</span>
          </h2>
          
          <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 30px;">
            Hello ${firstName}, your terminal clearance has been granted. You now have access to elite curriculum and restricted modules.
          </p>
          
          <a href="${process.env.FRONTEND_URL}" 
             style="display: inline-block; background-color: #ffffff; color: #000000; padding: 15px 35px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
             Access Mainframe
          </a>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #18181b;">
            <p style="color: #52525b; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
              Secure Connection Established // ID: ${Math.random().toString(36).toUpperCase().substring(2, 10)}
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"CodeVerse Command" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Action Required: Clearance Granted",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
  }
};