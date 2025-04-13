'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface FinancialTerm {
  _id: string;
  term: string;
  definition: string;
  slug: string;
}

interface EditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  height?: number;
}

export default function Editor({ initialValue = '', onChange, height = 500 }: EditorProps) {
  const editorRef = useRef<any>(null);
  const [terms, setTerms] = useState<FinancialTerm[]>([]);

  // Fetch financial terms when the component mounts
  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch('/api/glossary');
        if (!response.ok) {
          throw new Error('Failed to fetch financial terms');
        }
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching financial terms:', err);
      }
    }

    fetchTerms();
  }, []);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => {
        editorRef.current = editor;

        // Add a custom button and menu for inserting financial term links
        if (terms.length > 0) {
          // Register a custom menu item
          editor.ui.registry.addMenuButton('financialterms', {
            text: 'מונחים פיננסיים',
            tooltip: 'הוסף קישור למונח פיננסי',
            icon: 'link',
            fetch: (callback) => {
              const items = terms.map(term => ({
                type: 'menuitem' as const,
                text: term.term,
                onAction: () => {
                  const selectedText = editor.selection.getContent({format: 'text'});
                  const textToInsert = selectedText || term.term;
                  
                  editor.selection.setContent(
                    `<a href="/glossary/${term.slug}" title="${term.term}" class="glossary-term">${textToInsert}</a>`
                  );
                }
              }));
              
              // Sort terms alphabetically
              items.sort((a, b) => a.text.localeCompare(b.text));
              
              callback(items);
            }
          });
        }
      }}
      initialValue={initialValue}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | financialterms | link | help | ltr rtl',
        content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
          .glossary-term { color: #32a191; text-decoration: underline; }
        `,
        directionality: 'rtl', // Default to RTL for Hebrew content
        language: 'he', // Set language to Hebrew
      }}
    />
  );
} 