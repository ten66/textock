import { User, LogOut, Search, Moon, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CompactTemplateStatus } from "../ui/CompactTemplateStatus";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  templateCount: number;
  templateLimit: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleDarkMode,
  templateCount,
  templateLimit,
}: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (window.confirm("ログアウトしてもよろしいですか？")) {
      await signOut();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Textock
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Text ✖️ Stock = テンプレート管理
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={16}
              />
              <Input
                placeholder="テンプレートを検索..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              icon={isDark ? Sun : Moon}
              onClick={onToggleDarkMode}
              className="p-2"
            />

            <CompactTemplateStatus 
              current={templateCount}
              limit={templateLimit}
            />

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <User size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <Button
                size="sm"
                variant="ghost"
                icon={LogOut}
                onClick={handleSignOut}
                className="p-1 ml-1"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
