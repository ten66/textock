export interface Template {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  variables: VariableDefinition[];
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface VariableDefinition {
  name: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface TemplateUsage {
  templateId: string;
  variables: Record<string, string>;
  result: string;
}