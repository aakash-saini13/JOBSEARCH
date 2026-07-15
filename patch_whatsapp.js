const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/emails.tsx', 'utf-8');

content = content.replace(
  "const cleanPhone = contactInfo.replace(/[^\\d+]/g, '');",
  "const cleanPhone = contactInfo.replace(/\\D/g, '');"
);

fs.writeFileSync('src/pages/dashboard/emails.tsx', content);
