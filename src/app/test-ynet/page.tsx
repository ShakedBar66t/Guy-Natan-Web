'use client';

import { useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function TestYnetPage() {
  const [title, setTitle] = useState('גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון');
  const [publishDate, setPublishDate] = useState('2025-05-09');
  const [link, setLink] = useState('https://www.ynet.co.il/economy/article/sample-article-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/ynet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          publishedAt: new Date(publishDate).toISOString(),
          link,
          isPublished: true,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error submitting:', error);
      setResult({ error: 'Failed to add article' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MaxWidthWrapper className="py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test YNET Article Form</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Publish Date:</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Link:</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Test Article'}
          </button>
        </form>
        
        {result && (
          <div className="mt-8 p-4 border rounded">
            <h2 className="text-xl font-bold mb-2">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
} 