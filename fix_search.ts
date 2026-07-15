import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');
content = content.replace(
  /<\/motion\.div>\s*<Dialog open=\{showApplyDialog\} onOpenChange=\{setShowApplyDialog\}>/,
  "</div>\n      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>"
);
content = content.replace(
  /<\/Dialog>\s*<\/div>\s*\);\s*\}/,
  "</Dialog>\n    </motion.div>\n  );\n}"
);
fs.writeFileSync('src/pages/dashboard/search.tsx', content);
