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
  Edit3,
  Eye,
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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const scrollTop = textarea.scrollTop;
    const selectedText = value.substring(start, end);
    const replacement = selectedText || placeholder;
    const newText = value.substring(0, start) + before + replacement + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.scrollTop = scrollTop;
    }, 0);
  }, [value, onChange]);

  const toolbarButtons = [
    { icon: Heading1, action: () => insertAtCursor('# ', '', ''), tooltip: 'ヘッダー1' },
    { icon: Heading2, action: () => insertAtCursor('## ', '', ''), tooltip: 'ヘッダー2' },
    { icon: Heading3, action: () => insertAtCursor('### ', '', ''), tooltip: 'ヘッダー3' },
    { icon: Bold, action: () => insertAtCursor('**', '**', ''), tooltip: '太字' },
    { icon: Italic, action: () => insertAtCursor('*', '*', ''), tooltip: '斜体' },
    { icon: Code, action: () => insertAtCursor('`', '`', ''), tooltip: 'インラインコード' },
    { icon: Code2, action: () => insertAtCursor('```\n', '\n```', ''), tooltip: 'コードブロック' },
    { icon: Link, action: () => insertAtCursor('[', '](https://example.com)', ''), tooltip: 'リンク' },
    { icon: List, action: () => insertAtCursor('- ', '', ''), tooltip: 'リスト' },
    { icon: ListOrdered, action: () => insertAtCursor('1. ', '', ''), tooltip: '番号付きリスト' },
    { icon: Quote, action: () => insertAtCursor('> ', '', ''), tooltip: '引用' },
    { icon: Table, action: () => insertAtCursor('|  |  |\n| --- | --- |\n| ', ' |  |', ''), tooltip: 'テーブル' },
    { icon: Minus, action: () => insertAtCursor('---\n', '', ''), tooltip: '水平線' },
  ];


  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={button.tooltip}
            type="button"
            disabled={activeTab === 'preview'}
          >
            <button.icon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'edit'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b-2 border-blue-500'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          type="button"
        >
          <Edit3 className="w-4 h-4" />
          <span>編集</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b-2 border-blue-500'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          type="button"
        >
          <Eye className="w-4 h-4" />
          <span>プレビュー</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="h-80">
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 text-sm font-mono border-0 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
          />
        ) : (
          <div className="h-full overflow-auto bg-white dark:bg-gray-900 p-4">
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
};