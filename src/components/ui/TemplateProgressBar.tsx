import { Database, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface TemplateProgressBarProps {
  current: number;
  limit: number;
  className?: string;
}

export function TemplateProgressBar({
  current,
  limit,
  className = "",
}: TemplateProgressBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const remaining = Math.max(limit - current, 0);

  // プログレスバーの色を段階的に変更
  const getProgressColor = () => {
    if (percentage >= 100) return "from-red-500 to-red-600";
    if (percentage >= 80) return "from-orange-500 to-red-500";
    if (percentage >= 60) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-blue-500";
  };

  const getStatusIcon = () => {
    if (percentage >= 100)
      return <AlertTriangle size={16} className="text-red-500" />;
    if (percentage >= 80)
      return <TrendingUp size={16} className="text-orange-500" />;
    return <Database size={16} className="text-blue-500" />;
  };

  const getStatusMessage = () => {
    if (percentage >= 100) return "上限に達しました";
    if (percentage >= 80) return `残り${remaining}個`;
    return `${remaining}個利用可能`;
  };

  const getTextColor = () => {
    if (percentage >= 100) return "text-red-600 dark:text-red-400";
    if (percentage >= 80) return "text-orange-600 dark:text-orange-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            テンプレート使用状況
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {current}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            /{limit}
          </span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="relative mb-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full transition-all duration-700 ease-out relative`}
            style={{ width: `${percentage}%` }}
          >
            {/* グローエフェクト */}
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse rounded-full"></div>
          </div>
        </div>

        {/* パーセンテージ表示 */}
        <div className="absolute -top-7 right-0">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* ステータスメッセージ */}
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium ${getTextColor()}`}>
          {getStatusMessage()}
        </span>

        {percentage < 100 && (
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              利用可能
            </span>
          </div>
        )}
      </div>

      {/* 詳細情報 */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              使用中
            </div>
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {current}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">残り</div>
            <div
              className={`text-sm font-semibold ${
                remaining > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {remaining}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">上限</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {limit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
