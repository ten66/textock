import { Template } from "../../types";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Edit, Trash2, Tag, Calendar, FileText } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onUse: (template: Template) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onUse,
}: TemplateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      hover
      className="group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 h-full"
    >
      <CardContent className="p-3 sm:p-4 h-full flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText
              size={16}
              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {template.title}
            </h3>
          </div>
          {template.description && (
            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-1 sm:line-clamp-2">
              {template.description}
            </p>
          )}
        </div>

        {/* Content Preview */}
        <div className="mb-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2 border border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 sm:line-clamp-3 font-mono leading-tight">
              {template.content}
            </p>
          </div>
        </div>

        {/* Metadata - flex-1 to take remaining space */}
        <div className="flex-1 flex flex-col justify-end">
          {/* Tags row - takes flexible space */}
          <div className="flex-1 flex items-start mb-2">
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded font-medium">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom metadata row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <Tag size={10} />
                <span className="font-medium truncate max-w-20 sm:max-w-none">{template.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={10} />
                <span>{formatDate(template.updated_at)}</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs font-medium self-start sm:self-auto">
              {template.variables.length}変数
            </div>
          </div>
        </div>

        {/* Action buttons at bottom */}
        <div className="flex items-center gap-2 pt-2 mt-3 border-t border-gray-100 dark:border-gray-700">
          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
          >
            使用
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={Edit}
            onClick={() => onEdit(template)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 sm:p-2"
          />
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            onClick={() => onDelete(template.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 sm:p-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
