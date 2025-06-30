import React, { useState } from 'react';
import { Template } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { replaceVariables } from '../../lib/templateUtils';
import { Copy, Download } from 'lucide-react';

interface TemplateUseModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateUseModal({ template, isOpen, onClose }: TemplateUseModalProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const result = replaceVariables(template.content, variables);

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
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setVariables({});
    setCopied(false);
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
          <Textarea
            value={result}
            readOnly
            rows={12}
            className="bg-gray-50 dark:bg-gray-700 font-mono text-sm"
          />
        </div>
      </div>
    </Modal>
  );
}