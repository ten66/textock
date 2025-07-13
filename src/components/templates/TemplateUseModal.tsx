import React, { useState } from 'react';
import { Template } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { MarkdownPreview } from '../ui/MarkdownPreview';
import { replaceVariables } from '../../lib/templateUtils';
import { Copy, Download, Eye, Code } from 'lucide-react';

interface TemplateUseModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateUseModal({ template, isOpen, onClose }: TemplateUseModalProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  if (!template) return null;

  const result = replaceVariables(template.content, variables);
  const isMarkdown = template.isMarkdown || false;

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
    }
  };

  const handleDownload = () => {
    const fileExtension = isMarkdown ? 'md' : 'txt';
    const mimeType = isMarkdown ? 'text/markdown' : 'text/plain';
    const blob = new Blob([result], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setVariables({});
    setCopied(false);
    setShowMarkdownPreview(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`テンプレートを使用: ${template.title}`}
      size="lg"
    >
      <div className="space-y-6">
        {template.variables.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">変数を入力してください</h3>
            <div className="space-y-4">
              {template.variables.map((variable) => (
                <Input
                  key={variable.name}
                  label={variable.name}
                  placeholder={`${variable.name}を入力...`}
                  value={variables[variable.name] || ''}
                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">結果</h3>
            <div className="flex gap-2">
              {isMarkdown && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={showMarkdownPreview ? Code : Eye}
                  onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                >
                  {showMarkdownPreview ? 'ソース' : 'プレビュー'}
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                icon={Copy}
                onClick={handleCopy}
              >
                {copied ? 'コピー済み!' : 'コピー'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={handleDownload}
              >
                ダウンロード
              </Button>
            </div>
          </div>
          
          {isMarkdown && showMarkdownPreview ? (
            <div className="max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
              <MarkdownPreview content={result} />
            </div>
          ) : (
            <Textarea
              value={result}
              readOnly
              rows={12}
              className="bg-gray-50 dark:bg-gray-700 font-mono text-sm"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}