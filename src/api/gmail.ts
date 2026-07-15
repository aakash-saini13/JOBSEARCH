import express from 'express';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
        const { to, subject, message, attachmentBase64, attachmentName } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing to, subject, or message' });
    }

    let emailString = '';
    
    if (attachmentBase64 && attachmentName) {
      const boundary = 'foo_bar_baz';
      const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        message,
        '',
        `--${boundary}`,
        `Content-Type: application/pdf; name="${attachmentName}"`,
        `Content-Disposition: attachment; filename="${attachmentName}"`,
        'Content-Transfer-Encoding: base64',
        '',
        attachmentBase64,
        `--${boundary}--`,
        ''
      ];
      emailString = emailLines.join('\r\n');
    } else {
      const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        message
      ];
      emailString = emailLines.join('\r\n');
    }

    const base64EncodedEmail = Buffer.from(emailString)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64EncodedEmail,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gmail API Error:', errText);
      return res.status(response.status).json({ error: 'Failed to send email', details: errText });
    }

    const data = await response.json();
    res.json({ success: true, messageId: data.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
