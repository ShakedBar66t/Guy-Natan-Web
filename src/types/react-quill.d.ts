declare module 'react-quill' {
  import React from 'react';
  
  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (content: string) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    onFocus?: (range: any, source: string, editor: any) => void;
    onBlur?: (previousRange: any, source: string, editor: any) => void;
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
    className?: string;
    theme?: string;
    modules?: any;
    formats?: string[];
    placeholder?: string;
    readOnly?: boolean;
    preserveWhitespace?: boolean;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    style?: React.CSSProperties;
  }
  
  const ReactQuill: React.FC<ReactQuillProps>;
  export default ReactQuill;
} 