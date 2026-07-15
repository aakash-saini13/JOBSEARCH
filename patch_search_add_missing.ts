import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

const toAdd = `
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);

  const handleSearch = async () => {
    if (!query) {
      toast('Please enter a search query', 'error');
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location, filterSalary, filterWorkMode, filterExperience, profile })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.jobs || []);
      } else {
        toast('Failed to search jobs', 'error');
      }
    } catch (e) {
      console.error(e);
      toast('Failed to search jobs', 'error');
    } finally {
      setIsSearching(false);
    }
  };

`;

content = content.replace(
  '  const [isAutoApplying, setIsAutoApplying] = useState(false);',
  toAdd + '  const [isAutoApplying, setIsAutoApplying] = useState(false);'
);

fs.writeFileSync('src/pages/dashboard/search.tsx', content);
