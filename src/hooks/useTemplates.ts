import { useState, useEffect, useCallback } from 'react';
import { Template, TemplateCreateData } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { extractVariables } from '../lib/templateUtils';

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

      const variables = extractVariables(templateInput.content);

      const templateData = {
        title: templateInput.title.trim(),
        content: templateInput.content.trim(),
        description: templateInput.description?.trim() || '',
        category: templateInput.category?.trim() || '一般',
        tags: Array.isArray(templateInput.tags) ? templateInput.tags : [],
        variables,
        user_id: user.id,
        is_public: false
      };

      const { data, error } = await supabase
        .from('templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;
      
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

      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
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

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
}