import { Database, AlertTriangle, TrendingUp } from "lucide-react";

interface CompactTemplateStatusProps {
  current: number;
  limit: number;
  className?: string;
}

export function CompactTemplateStatus({
  current,
  limit,
  className = "",
}: CompactTemplateStatusProps) {
  const percentage = Math.min((current / limit) * 100, 100);

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = () => {
    if (percentage >= 100)
      return <AlertTriangle size={14} className="text-red-500" />;
    if (percentage >= 80)
      return <TrendingUp size={14} className="text-orange-500" />;
    return <Database size={14} className="text-blue-500" />;
  };

  const getTextColor = () => {
    if (percentage >= 100) return "text-red-600 dark:text-red-400";
    if (percentage >= 80) return "text-orange-600 dark:text-orange-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg ${className}`}
    >
      {/* アイコン */}
      {getStatusIcon()}

      {/* 使用状況テキスト */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          テンプレート
        </span>
        <span className={`text-xs font-semibold ${getTextColor()}`}>
          {current}/{limit}個
        </span>
      </div>

      {/* ミニプログレスバー */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
