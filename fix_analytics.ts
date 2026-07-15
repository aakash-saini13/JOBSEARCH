import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/analytics.tsx', 'utf-8');
content = content.replace(
  "label={({ name, percent }) => \\`\\${name} (\\${(percent * 100).toFixed(0)}%)\\`}",
  "label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}"
);
content = content.replace(
  "<Cell key={\\`cell-\\${index}\\`} fill={COLORS[index % COLORS.length]} />",
  "<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />"
);
fs.writeFileSync('src/pages/dashboard/analytics.tsx', content);
