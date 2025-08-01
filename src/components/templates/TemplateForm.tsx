import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Template } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { MarkdownEditor } from '../ui/MarkdownEditor';
import { Toggle } from '../ui/Toggle';
import { extractVariables, validateTemplate } from '../../lib/templateUtils';

interface TemplateFormData {
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string;
  isMarkdown?: boolean;
}

interface TemplateFormProps {
  template?: Template | null;
  onSubmit: (data: TemplateFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TemplateForm({ template, onSubmit, onCancel, loading }: TemplateFormProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    content: '',
    description: '',
    category: '一般',
    tags: '',
    isMarkdown: false,
  });

  const [errors, setErrors] = useState<Partial<TemplateFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedContent, setDebouncedContent] = useState(formData.content);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        content: template.content,
        description: template.description,
        category: template.category,
        tags: template.tags.join(', '),
        isMarkdown: template.isMarkdown || false,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        description: '',
        category: '一般',
        tags: '',
        isMarkdown: false,
      });
    }
    setErrors({});
    setDebouncedContent(template?.content || '');
  }, [template]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedContent(formData.content);
    }, 300);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.content]);

  const variables = useMemo(() => {
    if (!debouncedContent || debouncedContent.trim().length === 0) {
      return [];
    }
    try {
      return extractVariables(debouncedContent);
    } catch (error) {
      console.error('変数抽出エラー:', error);
      return [];
    }
  }, [debouncedContent]);

  const validation = useMemo(() => {
    if (!debouncedContent || debouncedContent.trim().length === 0) {
      return { isValid: false, errors: ['内容は必須です'] };
    }
    try {
      return validateTemplate(debouncedContent);
    } catch (error) {
      console.error('テンプレート検証エラー:', error);
      return { isValid: false, errors: ['テンプレートの検証中にエラーが発生しました'] };
    }
  }, [debouncedContent]);

  const handleFieldChange = useCallback((field: keyof TemplateFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'isMarkdown' ? value === 'true' : value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TemplateFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    if (!formData.content.trim()) {
      newErrors.content = '内容は必須です';
    } else if (formData.content.trim().length < 3) {
      newErrors.content = '内容は3文字以上で入力してください';
    } else {
      try {
        const immediateValidation = validateTemplate(formData.content);
        if (!immediateValidation.isValid) {
          newErrors.content = immediateValidation.errors.join(', ');
        }
      } catch (error) {
        console.error('即座の検証エラー:', error);
        newErrors.content = 'テンプレートの検証中にエラーが発生しました';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanData: TemplateFormData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || '一般',
        tags: formData.tags.trim(),
        isMarkdown: formData.isMarkdown,
      };

      await onSubmit(cleanData);
    } catch (error) {
      console.error('送信エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(() => {
    const titleValid = formData.title.trim().length > 0;
    const contentValid = formData.content.trim().length >= 3;
    
    if (!titleValid || !contentValid) {
      return false;
    }
    
    try {
      const immediateValidation = validateTemplate(formData.content);
      return immediateValidation.isValid;
    } catch (error) {
      console.error('フォーム検証エラー:', error);
      return false;
    }
  }, [formData.title, formData.content]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="タイトル"
          placeholder="マイテンプレート"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          error={errors.title}
          required
        />
        <Input
          label="カテゴリ"
          placeholder="一般"
          value={formData.category}
          onChange={(e) => handleFieldChange('category', e.target.value)}
        />
      </div>

      <Input
        label="説明"
        placeholder="このテンプレートの簡単な説明..."
        value={formData.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            テンプレート内容 <span className="text-red-500">*</span>
          </label>
          <Toggle
            checked={formData.isMarkdown}
            onChange={(checked) => handleFieldChange('isMarkdown', checked.toString())}
            label="マークダウン形式"
          />
        </div>
        
        {formData.isMarkdown ? (
          <MarkdownEditor
            value={formData.content}
            onChange={(value) => handleFieldChange('content', value)}
            placeholder="マークダウンでテンプレートを記述してください。変数には{{変数名}}の形式を使用してください..."
            autoFocus
          />
        ) : (
          <Textarea
            placeholder="テンプレートをここに書いてください。変数には{{変数名}}の形式を使用してください..."
            rows={10}
            value={formData.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            error={errors.content}
            helper="{{変数名}}の形式で動的な変数を作成できます"
            required
          />
        )}
      </div>

      {debouncedContent.trim().length > 0 && !validation.isValid && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="text-red-800 dark:text-red-300 font-medium mb-2">⚠️ テンプレート検証エラー:</h4>
          <ul className="text-red-700 dark:text-red-400 text-sm space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {variables.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">✅ 検出された変数 ({variables.length}個):</h4>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <span
                key={variable.name}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium"
              >
                {variable.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <Input
        label="タグ"
        placeholder="タグ1, タグ2, タグ3"
        value={formData.tags}
        onChange={(e) => handleFieldChange('tags', e.target.value)}
        helper="タグはカンマで区切ってください"
      />

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting || loading}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || loading}
          disabled={!isFormValid || isSubmitting || loading}
          className="flex-1"
        >
          {template ? 'テンプレートを更新' : 'テンプレートを作成'}
        </Button>
      </div>
    </form>
  );
}