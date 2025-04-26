import React, { ReactNode } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import CharacterCount from '@tiptap/extension-character-count';

interface EditorProviderProps {
  initialContent: string;
  onUpdate: (html: string) => void;
  height?: string;
  children: (editor: Editor) => ReactNode;
}

export default function EditorProvider({ initialContent, onUpdate, height = '300px', children }: EditorProviderProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      TextStyle,
      Color,
      Link.configure({ 
        HTMLAttributes: { 
          target: '_blank', 
          rel: 'noopener noreferrer',
        } 
      }),
      Image,
      FloatingMenuExtension,
      BubbleMenuExtension,
      CharacterCount,
    ],
    content: initialContent,
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] focus:outline-none',
        style: `height: ${height}; overflow: auto;`,
      },
    },
  });

  if (!editor) return null;
  return <>{children(editor)}</>;
} 