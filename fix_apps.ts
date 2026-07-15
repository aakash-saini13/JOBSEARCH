import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/applications.tsx', 'utf-8');
content = content.replace(
  /<\/motion\.div>\s*<Dialog open=\{isAddOpen\}/,
  "</div>\n      <Dialog open={isAddOpen}"
);
content = content.replace(
  /<\/Dialog>\s*<\/div>\s*\);\s*\}/,
  "</Dialog>\n    </motion.div>\n  );\n}"
);
fs.writeFileSync('src/pages/dashboard/applications.tsx', content);
