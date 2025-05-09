// routes/sendToTech.js
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const SERVICEM8_INBOX_EMAIL = process.env.SERVICEM8_INBOX_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post(
  "/sendToTech",
  upload.fields([{ name: "photos", maxCount: 5 }]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        mobile,
        address,
        jobType,
        systemType,
        brand,
        model,
        notes,
        description, // includes user input + diagnosis block from frontend
      } = req.body;

      const mailBody = `
Online Enquiry
Online enquiry from ${firstName} ${lastName}.

Company: ${firstName} ${lastName}
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email || "Not Provided"}
Mobile: ${mobile}
Address: ${address}
Description: 
System Type: ${systemType}
Brand: ${brand}
Model: ${model}
Notes: ${notes}
${description}  
Status: ${jobType}
`;

      const attachments =
        req.files?.photos?.map((file) => ({
          filename: file.originalname,
          content: file.buffer,
        })) || [];

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: SERVICEM8_INBOX_EMAIL,
        subject: `HVAC Diagnostic Submission - ${firstName} ${lastName}`,
        text: mailBody,
        attachments,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Diagnostic email sent to ServiceM8 inbox");
      res.json({ message: "Sent to ServiceM8 inbox successfully." });
    } catch (error) {
      console.error("❌ Email send error:", error);
      res.status(500).json({ error: "Failed to send to ServiceM8 inbox" });
    }
  }
);

module.exports = router;
