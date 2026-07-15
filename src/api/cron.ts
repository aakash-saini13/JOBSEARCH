import cron from 'node-cron';
import { Job } from '../models/Job.js';
import { User } from '../models/User.js';

export function initCronJobs() {
  console.log('🕒 Initializing background task schedulers...');

  // Run every day at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🚀 Running scheduled task: Check for Follow-ups...');
    
    try {
      // Find jobs that were applied 7 days ago
      const sevenDaysAgoStart = new Date();
      sevenDaysAgoStart.setDate(sevenDaysAgoStart.getDate() - 7);
      sevenDaysAgoStart.setHours(0, 0, 0, 0);

      const sevenDaysAgoEnd = new Date(sevenDaysAgoStart);
      sevenDaysAgoEnd.setHours(23, 59, 59, 999);

      // Query jobs with status "applied" and appliedDate within the 7-day-ago window
      const pendingJobs = await (Job as any).find({
        status: 'applied',
        appliedDate: {
          $gte: sevenDaysAgoStart,
          $lte: sevenDaysAgoEnd,
        }
      }).populate('userId');

      console.log(`Found ${pendingJobs.length} applications submitted 7 days ago.`);

      for (const job of pendingJobs) {
        if (!job.hrContact || !job.hrContact.email) {
          console.log(`⚠️ Skipping follow-up for ${job.company}: No HR email found.`);
          continue;
        }

        const user = job.userId;
        console.log(`✉️ Automated Follow-up triggered for ${job.company} (User: ${user.email})`);
        
        // 3. Generate a polite follow-up email
        const followUpMessage = `Hi ${job.hrContact.name || 'Hiring Team'},\n\nI hope you're having a great week. I'm following up on my application for the ${job.title} position submitted last week. I remain very interested in the opportunity and would love to discuss how my background aligns with your team's goals.\n\nBest regards,\n${user.name}`;
        
        // 4. Send via Gmail API
        try {
          // In a real scenario, retrieve the user's stored OAuth refresh token and get a fresh access token.
          // For this demonstration, we'll try to fetch with a stored token if we added it to User model, or log a mock.
          const oauthToken = user.googleAccessToken || 'mock-token-for-dev'; 
          
          const emailLines = [
            `To: ${job.hrContact.email}`,
            `Subject: Following up: ${job.title} Application`,
            'Content-Type: text/plain; charset=utf-8',
            '',
            followUpMessage
          ];
              
          const emailString = emailLines.join('\r\n');
          const base64EncodedEmail = Buffer.from(emailString)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
      
          const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${oauthToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw: base64EncodedEmail,
            }),
          });
          
          if (!response.ok) {
            console.warn(`⚠️ Gmail API error (Expected without valid stored token): ${response.statusText}`);
          } else {
            console.log(`✅ Follow-up email sent to ${job.hrContact.email}`);
          }
          
          // 5. Update application status
          job.status = 'interviewing'; // or some other status like "follow-up sent"
          await job.save();
        } catch (emailErr) {
          console.error(`❌ Failed to send email to ${job.hrContact.email}`, emailErr);
        }
      }
    } catch (error) {
      console.error('❌ Error in background follow-up job:', error);
    }
  });
}
