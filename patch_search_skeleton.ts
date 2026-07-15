import fs from 'fs';
let content = fs.readFileSync('src/pages/dashboard/search.tsx', 'utf-8');

const skeletonCode = `
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto pb-4 pr-2">
            {isSearching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
                  <CardContent className="p-5">
                    <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mt-4"></div>
                  </CardContent>
                </Card>
              ))
            ) : searchResults.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No jobs found. Try adjusting your search criteria.
              </div>
            ) : (
              searchResults.map((job, idx) => (
`;

content = content.replace(
  '          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0 overflow-y-auto pb-4 pr-2">\n            {searchResults.map((job, idx) => (',
  skeletonCode
);

// Add an extra closing parenthesis/brace for the ternary
content = content.replace(
  '                </CardContent>\n              </Card>\n            ))}\n          </div>',
  '                </CardContent>\n              </Card>\n            ))}\n            )}\n          </div>'
);

fs.writeFileSync('src/pages/dashboard/search.tsx', content);
