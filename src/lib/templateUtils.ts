import { VariableDefinition } from '../types';

export function extractVariables(content: string): VariableDefinition[] {
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const matches = [...content.matchAll(variableRegex)];
  
  const uniqueVariables = new Set(
    matches
      .map(match => match[1].trim())
      .filter(name => name.length > 0)
  );
  
  return Array.from(uniqueVariables).map(name => ({
    name,
    type: 'text' as const,
    required: true,
  }));
}

export function replaceVariables(
  content: string, 
  variables: Record<string, string>
): string {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  return content.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    return variables[trimmedName] || match;
  });
}

export function validateTemplate(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!content || typeof content !== 'string') {
    errors.push('テンプレート内容を入力してください');
    return { isValid: false, errors };
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    errors.push('テンプレート内容を入力してください');
    return { isValid: false, errors };
  }
  
  if (trimmedContent.length < 3) {
    errors.push('テンプレート内容は3文字以上で入力してください');
  }
  
  // 正しい変数形式 {{変数名}} を先に抽出
  const validVariables = content.match(/\{\{[^}]+\}\}/g) || [];
  
  // 正しい変数を一時的に置換して、残りの不正な形式をチェック
  let tempContent = content;
  const validVariableMap: Record<string, string> = {};
  
  validVariables.forEach((variable, index) => {
    const placeholder = `__VALID_VAR_${index}__`;
    validVariableMap[placeholder] = variable;
    tempContent = tempContent.replace(variable, placeholder);
  });
  
  // 残った波括弧パターンをチェック
  const remainingBraces = tempContent.match(/\{[^_]*\}|\{[^_]*|\}[^_]*/g) || [];
  
  // 空の変数をチェック
  const emptyVariables = validVariables.filter(variable => {
    const content = variable.replace(/^\{\{|\}\}$/g, '').trim();
    return content.length === 0;
  });
  
  if (emptyVariables.length > 0) {
    errors.push('空の変数があります。{{変数名}} の形式で変数名を入力してください');
  }
  
  if (remainingBraces.length > 0) {
    const singleBracePatterns = remainingBraces.filter(pattern => 
      pattern.match(/^\{[^{].*\}$/)
    );
    const incompleteBraces = remainingBraces.filter(pattern => 
      pattern.match(/^\{[^}]*$|^[^{]*\}$/)
    );
    
    if (singleBracePatterns.length > 0) {
      errors.push(`変数は {{変数名}} の形式で入力してください（二重波括弧が必要です）。不正: ${singleBracePatterns.join(', ')}`);
    }
    
    if (incompleteBraces.length > 0) {
      errors.push(`波括弧が不完全です。{{変数名}} の形式で入力してください。不正: ${incompleteBraces.join(', ')}`);
    }
    
    const otherPatterns = remainingBraces.filter(pattern => 
      !singleBracePatterns.includes(pattern) && !incompleteBraces.includes(pattern)
    );
    if (otherPatterns.length > 0) {
      errors.push(`不正な波括弧の使用があります: ${otherPatterns.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}