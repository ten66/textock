export const TEMPLATE_LIMITS = {
  FREE_TIER: 30,
  // 将来的な拡張用
  PREMIUM_TIER: 100,
  ENTERPRISE_TIER: 1000,
} as const;

export const getCurrentTemplateLimit = (): number => {
  // 現在はフリープランのみ
  return TEMPLATE_LIMITS.FREE_TIER;
};

export const getTemplateCountMessage = (currentCount: number, limit: number): string => {
  const remaining = limit - currentCount;
  if (remaining <= 0) {
    return `テンプレート数が上限（${limit}個）に達しています`;
  }
  if (remaining <= 5) {
    return `あと${remaining}個までテンプレートを作成できます`;
  }
  return `${currentCount}/${limit}個のテンプレートを使用中`;
};