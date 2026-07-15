import fs from 'fs';
let content = fs.readFileSync('src/api/ai.ts', 'utf-8');

const cacheCode = `
const jobSearchCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

router.post('/match-jobs', async (req, res) => {
  try {
    const { userProfile, query, location, filters } = req.body;
    
    // Cache key based on search parameters
    const cacheKey = JSON.stringify({ query, location, filters });
    if (jobSearchCache.has(cacheKey)) {
      const cached = jobSearchCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Serving /match-jobs from cache');
        return res.json(cached.data);
      } else {
        jobSearchCache.delete(cacheKey);
      }
    }
`;

content = content.replace("router.post('/match-jobs', async (req, res) => {\n  try {\n    const { userProfile, query, location, filters } = req.body;", cacheCode);

const cacheSaveCode = `
    const parsedData = JSON.parse(response.text || '{}');
    
    // Save to cache
    jobSearchCache.set(cacheKey, { data: parsedData, timestamp: Date.now() });
    
    res.json(parsedData);
`;

content = content.replace(`    const parsedData = JSON.parse(response.text || '{}');\n    res.json(parsedData);`, cacheSaveCode);

fs.writeFileSync('src/api/ai.ts', content);
