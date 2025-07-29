// Example Node.js/Express server
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors()); // Allow all origins (for development)
app.use(express.json());

app.post("/send-chart-email", async (req, res) => {
  const { email, imageData } = req.body;
  console.log("Send Email Works", { email, imageData });
  // Basic email validation
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  // Remove data URL prefix
  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

  // Configure nodemailer for Resend SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
      user: "resend", // Resend SMTP username is always 'resend'
      pass: "re_YZfbs1gD_7Tuzbp71xW1JeW9njbFEhZEt", // Your Resend API key
    },
  });

  try {
    await transporter.sendMail({
      from: '"Buck2Bar" <onboarding@resend.dev>', // Updated to Resend test/dev email
      to: email,
      subject: "Your Buck2Bar Chart",
      text: "Attached is your chart image.",
      attachments: [
        {
          filename: "chart.png",
          content: Buffer.from(base64Data, "base64"),
          contentType: "image/png",
        },
      ],
    });
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

app.listen(3000, () =>
  console.log("Server running on port on http://localhost:3000")
);
