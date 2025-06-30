import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface AuthFormData {
  email: string;
  password: string;
}

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggle: () => void;
}

export function AuthForm({ mode, onToggle }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError('');

    try {
      const { error } = mode === 'signin' 
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 relative overflow-hidden">
          {/* Card decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
              <div className="text-3xl font-bold text-white">T</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {mode === 'signin' ? 'おかえりなさい' : 'アカウント作成'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {mode === 'signin' 
                ? 'Textockにサインインして、あなたのテンプレートにアクセスしましょう' 
                : 'Textockに参加して、プロンプトテンプレートを管理しましょう'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="メールアドレス"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'メールアドレスは必須です',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '有効なメールアドレスを入力してください',
                },
              })}
            />

            <Input
              label="パスワード"
              type="password"
              placeholder="••••••••"
              showPasswordToggle={true}
              error={errors.password?.message}
              {...register('password', {
                required: 'パスワードは必須です',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください',
                },
              })}
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
              icon={mode === 'signin' ? Shield : Sparkles}
              size="lg"
            >
              {mode === 'signin' ? 'サインイン' : 'アカウント作成'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">または</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onToggle}
              className="mt-4 group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all duration-200 hover:gap-3"
            >
              {mode === 'signin' 
                ? 'アカウントをお持ちでない方はこちら' 
                : '既にアカウントをお持ちの方はこちら'
              }
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">テンプレート管理</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Shield size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">安全なデータ</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <User size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">個人アカウント</p>
          </div>
        </div>
      </div>
    </div>
  );
}