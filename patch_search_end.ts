import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

const lines = content.split('\n');
lines[489] = '            ))';
lines[490] = '            )}';

fs.writeFileSync('src/pages/dashboard/search.tsx', lines.join('\n'));
