import React from 'react';
import { Template } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit, Trash2, Play, Tag, Calendar, FileText } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onUse: (template: Template) => void;
}

export function TemplateCard({ template, onEdit, onDelete, onUse }: TemplateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card hover className="group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {template.title}
              </h3>
            </div>
            {template.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                {template.description}
              </p>
            )}
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-4 flex-1">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">プレビュー</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 font-mono leading-relaxed">
              {template.content}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Tag size={12} />
              <span className="font-medium">{template.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(template.updated_at)}</span>
            </div>
          </div>

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full font-medium">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md inline-block">
            変数: {template.variables.length}個
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Button
            size="sm"
            onClick={() => onUse(template)}
            icon={Play}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            使用
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={Edit}
            onClick={() => onEdit(template)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            onClick={() => onDelete(template.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </div>
      </CardContent>
    </Card>
  );
}