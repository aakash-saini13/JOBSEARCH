import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

// Replace await fetch('/api/gmail/send', ...) with if (hasGmailAccess) { await fetch(...) } else { console.log('Simulating email') }
content = content.replace(
/          await fetch\('\/api\/gmail\/send', {\s+method: 'POST',\s+headers: { 'Content-Type': 'application\/json', 'Authorization': `Bearer \$\{cachedAccessToken\}` },\s+body: JSON.stringify\(\{([\s\S]*?)\}\)\s+}\);/g,
`          if (hasGmailAccess) {
            await fetch('/api/gmail/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${cachedAccessToken}\` },
              body: JSON.stringify({$1})
            });
          } else {
            console.log('Simulating sending email', {$1});
          }`
);

fs.writeFileSync('src/pages/dashboard/search.tsx', content);
