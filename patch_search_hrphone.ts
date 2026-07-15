import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

content = content.replace(
  "      const isLinkedIn = !!(job.source && job.source.toLowerCase().includes('linkedin'));",
  "      const isLinkedIn = !!(job.source && job.source.toLowerCase().includes('linkedin'));\n      let hrPhone: string | null = null;"
);

content = content.replace(
  "        const hrPhone = aiData?.hrPhone;",
  "        hrPhone = aiData?.hrPhone;"
);

fs.writeFileSync('src/pages/dashboard/search.tsx', content);
