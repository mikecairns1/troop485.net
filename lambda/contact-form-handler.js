const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
const sns = new AWS.SNS({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Prepare email content
        const emailParams = {
            Source: 'noreply@troop485.net', // Replace with your verified SES email
            Destination: {
                ToAddresses: ['info@troop485.net'] // Replace with your target email
            },
            Message: {
                Subject: {
                    Data: `New Contact Form Submission: ${subject}`
                },
                Body: {
                    Text: {
                        Data: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}
                        `
                    }
                }
            }
        };

        // Send email via SES
        await ses.sendEmail(emailParams).promise();

        // If phone number is provided, send SMS via SNS
        if (phone) {
            const snsParams = {
                Message: `New contact form submission from ${name} regarding ${subject}. Check email for details.`,
                PhoneNumber: phone // Make sure to format the phone number correctly
            };
            await sns.publish(snsParams).promise();
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Message sent successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Failed to send message' })
        };
    }
}; 