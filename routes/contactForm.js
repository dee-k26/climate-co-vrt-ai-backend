// routes/contactForm.js
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
  "/send-inquiry",
  upload.fields([
    { name: "existingSwitchImage", maxCount: 1 },
    { name: "switchBoardImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        mobile,
        email,
        address,
        description,
        jobType,
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
Description: ${description}
Status: ${jobType}
`;

      const attachments = [];

      if (req.files?.existingSwitchImage?.[0]) {
        attachments.push({
          filename: "ExistingSwitchSystem.jpg",
          content: req.files.existingSwitchImage[0].buffer,
        });
      }

      if (req.files?.switchBoardImage?.[0]) {
        attachments.push({
          filename: "SwitchBoard.jpg",
          content: req.files.switchBoardImage[0].buffer,
        });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: SERVICEM8_INBOX_EMAIL,
        subject: `Online Enquiry - ${firstName} ${lastName}`,
        text: mailBody,
        attachments,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Contact form sent to ServiceM8 inbox");
      res.json({ message: "Enquiry successfully sent!" });
    } catch (error) {
      console.error("❌ Contact form error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
