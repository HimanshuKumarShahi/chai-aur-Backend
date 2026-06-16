import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: "apna host name de ",
    port: "ek port dale",
    auth: {
      user: "apna user name dale",
      pass: "apna password dale",
    },
  });

  const mailOptions = {
    from: '"Cloud Bites Security" <security@cloudbites.com>',
    to: email,
    subject: "🔐 New Login Alert - Cloud Bites",

    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f4f6; border-radius: 12px;">
            
            <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #f97316; margin: 0; font-size: 32px; letter-spacing: 1px;">
                    ☁️🍔 Cloud Bites
                </h1>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Hello, Chef! 👨‍🍳</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                    We noticed a recent login to your Cloud Bites account associated with the email address: 
                    <br>
                    <strong style="color: #ea580c; font-size: 18px;">${email}</strong>
                </p>

                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                    If this was you, everything is good to go. You can safely ignore this email and get back to managing your premium kitchen!
                </p>

                <div style="text-align: center; margin: 35px 0 15px 0;">
                    <a href="http://localhost:5173" style="background-color: #f97316; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Go to Dashboard
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    Didn't log in? Please contact your super admin immediately to secure your account.
                </p>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p style="margin: 5px 0;">This is an automated security alert. Please do not reply.</p>
                <p style="margin: 5px 0;">&copy; 2026 Cloud Bites. All rights reserved.</p>
            </div>

        </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    res.status(200).json({ message: "Login success, check Mailtrap!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email bhejne me problem aayi" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
