import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

// Patch autoApplyAll
content = content.replace(
`    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      if (!cachedAccessToken) {
        toast('Please login with Google to use auto-apply', 'error');
        setIsAutoApplying(false);
        return;
      }`,
`    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      const hasGmailAccess = !!cachedAccessToken;
      if (!hasGmailAccess) {
        toast('Not logged in with Google. Simulating emails instead of sending.', 'default');
      }`
);

// Patch executeSingleApply
content = content.replace(
`    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      if (!cachedAccessToken) {
        toast('Please login with Google to use auto-apply', 'error');
        setIsApplying(false);
        return;
      }`,
`    try {
      const { cachedAccessToken } = await import('../../lib/firebase');
      const hasGmailAccess = !!cachedAccessToken;
      if (!hasGmailAccess) {
        toast('Not logged in with Google. Simulating emails instead of sending.', 'default');
      }`
);

fs.writeFileSync('src/pages/dashboard/search.tsx', content);
