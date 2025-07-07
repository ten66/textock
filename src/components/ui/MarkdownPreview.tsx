import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useMemo } from 'react';
import 'prismjs/themes/prism-tomorrow.css';

interface MarkdownComponentProps {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
  href?: string;
}

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className = '' }) => {
  const processedContent = useMemo(() => {
    return content.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      return `<span class="inline-block px-2 py-1 mx-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-700">{{${variable}}}</span>`;
    });
  }, [content]);

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }: MarkdownComponentProps) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }: MarkdownComponentProps) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }: MarkdownComponentProps) => (
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              {children}
            </h3>
          ),
          p: ({ children }: MarkdownComponentProps) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }: MarkdownComponentProps) => (
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }: MarkdownComponentProps) => (
            <ol className="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }: MarkdownComponentProps) => (
            <li className="mb-1">{children}</li>
          ),
          blockquote: ({ children }: MarkdownComponentProps) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children }: MarkdownComponentProps) => {
            return !inline ? (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
                <code className={className}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-mono">
                {children}
              </code>
            );
          },
          table: ({ children }: MarkdownComponentProps) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }: MarkdownComponentProps) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }: MarkdownComponentProps) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
          a: ({ href, children }: MarkdownComponentProps) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="border-0 border-t border-gray-300 dark:border-gray-600 my-8" />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};