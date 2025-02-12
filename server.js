require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(express.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send-email", async (req, res) => {
    const { name, email, title, message } = req.body;

    const msg = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        replyTo: email,
        subject: `New Contact Form Submission: ${title}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
    };

    try {
        const response = await sgMail.send(msg);
        console.log("SendGrid Response:", response);
        res.status(200).json({ success: true, message: "Email sent!" });
    } catch (error) {
        console.error("SendGrid Error:", error.response ? error.response.body : error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));