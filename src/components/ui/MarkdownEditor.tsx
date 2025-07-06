import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Eye,
  EyeOff,
  Image,
  Table,
  Minus,
  Code2
} from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'マークダウンでテンプレートを記述してください...',
  className = '',
  autoFocus = false
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const insertAtCursor = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;
    const newText = value.substring(0, start) + before + replacement + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: Heading1, action: () => insertAtCursor('# ', '', 'ヘッダー1'), tooltip: 'ヘッダー1' },
    { icon: Heading2, action: () => insertAtCursor('## ', '', 'ヘッダー2'), tooltip: 'ヘッダー2' },
    { icon: Heading3, action: () => insertAtCursor('### ', '', 'ヘッダー3'), tooltip: 'ヘッダー3' },
    { icon: Bold, action: () => insertAtCursor('**', '**', '太字'), tooltip: '太字' },
    { icon: Italic, action: () => insertAtCursor('*', '*', '斜体'), tooltip: '斜体' },
    { icon: Code, action: () => insertAtCursor('`', '`', 'コード'), tooltip: 'インラインコード' },
    { icon: Code2, action: () => insertAtCursor('```\n', '\n```', 'コードブロック'), tooltip: 'コードブロック' },
    { icon: Link, action: () => insertAtCursor('[', '](https://example.com)', 'リンクテキスト'), tooltip: 'リンク' },
    { icon: Image, action: () => insertAtCursor('![', '](https://example.com/image.jpg)', 'alt text'), tooltip: '画像' },
    { icon: List, action: () => insertAtCursor('- ', '', 'リスト項目'), tooltip: 'リスト' },
    { icon: ListOrdered, action: () => insertAtCursor('1. ', '', 'リスト項目'), tooltip: '番号付きリスト' },
    { icon: Quote, action: () => insertAtCursor('> ', '', '引用'), tooltip: '引用' },
    { icon: Table, action: () => insertAtCursor('| ヘッダー1 | ヘッダー2 |\n| --- | --- |\n| ', ' | セル2 |', 'セル1'), tooltip: 'テーブル' },
    { icon: Minus, action: () => insertAtCursor('---\n', '', ''), tooltip: '水平線' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!showPreview) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(20, Math.min(80, newPosition)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={button.tooltip}
              type="button"
            >
              <button.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          type="button"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreview ? 'エディタ' : 'プレビュー'}</span>
        </button>
      </div>

      <div 
        ref={editorRef}
        className="relative flex h-96"
        style={{ cursor: isDragging ? 'col-resize' : 'default' }}
      >
        {!showPreview ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 text-sm font-mono border-0 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
          />
        ) : (
          <>
            <div 
              className="border-r border-gray-300 dark:border-gray-600 overflow-hidden"
              style={{ width: `${splitPosition}%` }}
            >
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-full p-4 text-sm font-mono border-0 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
              />
            </div>
            
            <div 
              className="w-1 bg-gray-300 dark:bg-gray-600 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              onMouseDown={handleMouseDown}
            />
            
            <div 
              className="overflow-auto bg-white dark:bg-gray-900"
              style={{ width: `${100 - splitPosition}%` }}
            >
              <div className="p-4">
                <MarkdownPreview content={value} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};