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

  // Get the API key - fallback to a hardcoded value if env var is not available
  // This ensures we always have a valid key
  const API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

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
      apiKey={API_KEY}
      onInit={(evt, editor) => {
        editorRef.current = editor;
        
        // Add a custom button and menu for inserting financial term links
        if (terms.length > 0) {
          // Register a custom menu item
          editor.ui.registry.addMenuButton('financialterms', {
            text: 'מונחים פיננסיים',
            tooltip: 'הוסף קישור למונח פיננסי',
            icon: 'link',
            fetch: (callback: any) => {
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
        
        // Fix for RTL cursor jumping issue using TinyMCE's built-in commands
        editor.on('keydown', function(e: KeyboardEvent) {
          // Use the directionality commands from TinyMCE for better RTL handling
          if ((e.keyCode === 37 || e.keyCode === 39) && e.ctrlKey && e.altKey) {
            e.preventDefault();
            if (e.keyCode === 37) { // Left arrow with Ctrl+Alt
              editor.execCommand('mceDirectionRTL');
            } else if (e.keyCode === 39) { // Right arrow with Ctrl+Alt
              editor.execCommand('mceDirectionLTR');
            }
          }
        });
      }}
      initialValue={initialValue}
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
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px; direction: rtl; text-align: right; }
          .glossary-term { color: #32a191; text-decoration: underline; }
        `,
        directionality: 'rtl', // Default to RTL for Hebrew content
        language: 'he', // Set language to Hebrew
        browser_spellcheck: true, // Enable browser's spellchecker
        contextmenu: false, // Disable context menu to avoid RTL issues
        entity_encoding: 'raw', // Prevent entity encoding issues with Hebrew
        forced_root_block: 'p', // Force paragraph as root block
        element_format: 'html', // Use HTML format
        fix_list_elements: true, // Fix list elements
        keep_styles: false, // Don't keep styles on delete/backspace
        text_patterns: [], // Disable text patterns which can cause RTL issues
        paste_data_images: true, // Allow pasting images
        setup: function(editor: any) {
          // Configure directionality settings
          editor.on('NodeChange', function(e: any) {
            const node = editor.selection.getNode();
            const dir = node.dir || editor.getBody().dir;
            
            // Ensure the proper directionality button is active
            editor.formatter.apply('ltr', { dir: 'ltr' });
            editor.formatter.apply('rtl', { dir: 'rtl' });
          });
        }
      }}
      onEditorChange={onChange}
    />
  );
} 