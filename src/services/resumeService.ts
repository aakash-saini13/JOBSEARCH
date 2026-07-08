import { UserProfile } from '../context/UserContext';

export async function parseResumeFile(file: File): Promise<Partial<UserProfile>> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('/api/resume/parse', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to parse resume');
  }

  const data = await response.json();
  return data;
}
