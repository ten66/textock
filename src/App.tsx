import { useState, useMemo } from "react";
import { AuthForm } from "./components/auth/AuthForm";
import { Header } from "./components/layout/Header";
import { TemplateCard } from "./components/templates/TemplateCard";
import { TemplateForm } from "./components/templates/TemplateForm";
import { TemplateUseModal } from "./components/templates/TemplateUseModal";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import { useAuth } from "./hooks/useAuth";
import { useTemplates } from "./hooks/useTemplates";
import { useDarkMode } from "./hooks/useDarkMode";
import { Template, TemplateFormData } from "./types";
import { FileText, Sparkles, Folder, Filter, Plus } from "lucide-react";

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    templates,
    loading: templatesLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    templateLimit,
    isTemplateCountLimitReached,
    templateCount,
  } = useTemplates({ user, authLoading });
  const { isDark, toggleDarkMode } = useDarkMode();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [usingTemplate, setUsingTemplate] = useState<Template | null>(null);
  const [showUseModal, setShowUseModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(templates.map((t) => t.category))].filter(Boolean);
    return cats.sort();
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const templatesByCategory = useMemo(() => {
    if (selectedCategory !== "all") {
      return [{ category: selectedCategory, templates: filteredTemplates }];
    }

    const grouped = categories
      .map((category) => ({
        category,
        templates: filteredTemplates.filter((t) => t.category === category),
      }))
      .filter((group) => group.templates.length > 0);

    return grouped;
  }, [filteredTemplates, categories, selectedCategory]);

  const handleCreateTemplate = () => {
    if (isTemplateCountLimitReached) {
      alert(`テンプレート数が上限（${templateLimit}個）に達しています。\n新しいテンプレートを作成するには、既存のテンプレートを削除してください。`);
      return;
    }
    setEditingTemplate(null);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleUseTemplate = (template: Template) => {
    setUsingTemplate(template);
    setShowUseModal(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("このテンプレートを削除してもよろしいですか？")) {
      await deleteTemplate(id);
    }
  };

  const handleTemplateSubmit = async (data: TemplateFormData) => {
    setFormLoading(true);

    try {
      const templateData = {
        title: data.title,
        content: data.content,
        description: data.description,
        category: data.category,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        is_public: false,
        isMarkdown: data.isMarkdown,
      };

      let result;
      if (editingTemplate) {
        result = await updateTemplate(editingTemplate.id, templateData);
      } else {
        result = await createTemplate(templateData);
      }

      if (result.error) {
        alert("エラーが発生しました: " + (result.error instanceof Error ? result.error.message : String(result.error)));
        return;
      }

      setShowTemplateForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("予期しないエラー:", error);
      alert("予期しないエラーが発生しました");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            読み込み中...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggle={() =>
          setAuthMode(authMode === "signin" ? "signup" : "signin")
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        templateCount={templateCount}
        templateLimit={templateLimit}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {templatesLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                テンプレートを読み込み中...
              </p>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText
                size={32}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {templates.length === 0
                ? "テンプレートがありません"
                : "テンプレートが見つかりません"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
              {templates.length === 0
                ? `最初のテンプレートを作成して、プロンプトやテキストスニペットの整理を始めましょう。最大${templateLimit}個まで作成できます。`
                : "検索条件やカテゴリフィルターを調整して、お探しのテンプレートを見つけてください。"}
            </p>
            {templates.length === 0 && (
              <Button
                onClick={handleCreateTemplate}
                disabled={isTemplateCountLimitReached}
                icon={Sparkles}
                size="lg"
                variant="gradient"
              >
                最初のテンプレートを作成
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Header with filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    テンプレート一覧
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredTemplates.length}個のテンプレートが見つかりました
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    icon={Plus}
                    onClick={handleCreateTemplate}
                    disabled={isTemplateCountLimitReached}
                    variant="gradient"
                    size="md"
                  >
                    新しいテンプレート
                  </Button>

                  {categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Filter
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">すべてのカテゴリ</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Templates by category */}
            <div className="space-y-8">
              {templatesByCategory.map(
                ({ category, templates: categoryTemplates }) => (
                  <div key={category}>
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          <Folder
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {category}
                          </h3>
                        </div>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          {categoryTemplates.length}個
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryTemplates.map((template) => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onEdit={handleEditTemplate}
                          onDelete={handleDeleteTemplate}
                          onUse={handleUseTemplate}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={showTemplateForm}
        onClose={() => {
          setShowTemplateForm(false);
          setEditingTemplate(null);
        }}
        title={
          editingTemplate ? "テンプレートを編集" : "新しいテンプレートを作成"
        }
        size="lg"
      >
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleTemplateSubmit}
          onCancel={() => {
            setShowTemplateForm(false);
            setEditingTemplate(null);
          }}
          loading={formLoading}
        />
      </Modal>

      <TemplateUseModal
        template={usingTemplate}
        isOpen={showUseModal}
        onClose={() => {
          setShowUseModal(false);
          setUsingTemplate(null);
        }}
      />
    </div>
  );
}

export default App;
