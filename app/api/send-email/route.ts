import { SES } from 'aws-sdk';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// POST request handler
export async function POST(request: Request) {
  try {
    // Parse incoming JSON body
    const { name, email, subject, message }: FormData = await request.json();

    const ses = new SES();

    // Define the SES email parameters
    const params = {
      Destination: {
        ToAddresses: ['ckmyprints@outlook.com'],  
      },
      Message: {
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
          },
        },
        Subject: {
          Data: `Contact Us Message: ${subject}`,
        },
      },
      Source: 'ckmyprints@outlook.com',   
    };

    // Send the email using SES
    await ses.sendEmail(params).promise();

    // Return a success response
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email', error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500 }
    );
  }
}