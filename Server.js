    const express = require('express');
    const bodyParser = require('body-parser');
    const router = express.Router();
    const nodemailer = require('nodemailer');

    require('dotenv').config();

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    const app = express();
    const PORT = 3001;

    app.use(bodyParser.json());

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });

    router.post('/send', (req, res) => {
        try {
            // Get JSON data from the request
            const { email, form } = req.body;

            // Create email content
            const mailOptions = {
                from: 'FormMailerAPI@gmail.com',
                to: email,
                subject: 'Form Submission',
                text: `Form Data: ${JSON.stringify(form)}`
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ status: 'error', message: 'Failed to send email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ status: 'success', message: 'Email sent successfully' });
                }
            });

            // Return a response (optional)
            const response = { status: 'success', message: 'message sent successfully' };
            res.json(response);
        } catch (error) {
            // Handle exceptions if necessary
            const response = { status: 'error', message: error.message || 'Internal Server Error' };
            res.status(500).json(response);
        }
    });

    app.use(express.json());
    app.use(router);

    app.listen(PORT, () => console.log(`Server now listening on port ${PORT}`));