import { useState, useEffect, useCallback } from 'react';
import { Template, TemplateCreateData } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { extractVariables } from '../lib/templateUtils';
import { getCurrentTemplateLimit } from '../lib/constants';

interface UseTemplatesProps {
  user: User | null;
  authLoading: boolean;
}

export function useTemplates({ user, authLoading }: UseTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('テンプレートの取得エラー:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    fetchTemplates();
  }, [user, authLoading, fetchTemplates]);

  const createTemplate = async (templateInput: TemplateCreateData) => {
    try {
      if (!templateInput.title?.trim()) {
        throw new Error('タイトルが必須です');
      }
      
      if (!templateInput.content?.trim()) {
        throw new Error('内容が必須です');
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('ユーザーが認証されていません');
      }

      // テンプレート数制限チェック
      const templateLimit = getCurrentTemplateLimit();
      if (templates.length >= templateLimit) {
        throw new Error(`テンプレート数が上限（${templateLimit}個）に達しています。新しいテンプレートを作成するには、既存のテンプレートを削除してください。`);
      }

      const variables = extractVariables(templateInput.content);

      // First, try with is_markdown field
      const templateData: Record<string, unknown> = {
        title: templateInput.title.trim(),
        content: templateInput.content.trim(),
        description: templateInput.description?.trim() || '',
        category: templateInput.category?.trim() || '一般',
        tags: Array.isArray(templateInput.tags) ? templateInput.tags : [],
        variables,
        user_id: user.id,
        is_public: false,
        is_markdown: templateInput.isMarkdown || false
      };

      console.log('Attempting to insert template with data:', templateData);
      
      let { data, error } = await supabase
        .from('templates')
        .insert([templateData])
        .select()
        .single();

      // If error occurs and might be related to is_markdown column, retry without it
      if (error && (error.message?.includes('is_markdown') || error.code === '42703')) {
        console.warn('Retrying without is_markdown field due to error:', error);
        
        // Remove is_markdown field and retry
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { is_markdown: _, ...templateDataWithoutMarkdown } = templateData;
        
        const retryResult = await supabase
          .from('templates')
          .insert([templateDataWithoutMarkdown])
          .select()
          .single();
          
        data = retryResult.data;
        error = retryResult.error;
      }

      if (error) {
        console.error('Supabase insert error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      setTemplates(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('テンプレート作成エラー:', error);
      return { data: null, error };
    }
  };

  const updateTemplate = async (id: string, updates: Partial<TemplateCreateData>) => {
    try {
      if (updates.content) {
        updates.variables = extractVariables(updates.content);
      }

      // データの前処理：不要なプロパティを削除
      const cleanUpdates = { ...updates };
      if (cleanUpdates.isMarkdown !== undefined) {
        delete cleanUpdates.isMarkdown;
      }

      const { data, error } = await supabase
        .from('templates')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase更新エラー:', error);
        console.error('更新データ:', cleanUpdates);
        console.error('テンプレートID:', id);
        throw error;
      }
      
      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      return { data, error: null };
    } catch (error) {
      console.error('テンプレート更新エラー:', error);
      return { data: null, error };
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      return { error: null };
    } catch (error) {
      console.error('テンプレート削除エラー:', error);
      return { error };
    }
  };

  const templateLimit = getCurrentTemplateLimit();
  const isTemplateCountLimitReached = templates.length >= templateLimit;

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
    templateLimit,
    isTemplateCountLimitReached,
    templateCount: templates.length,
  };
}