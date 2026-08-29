import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Zap,
  Bot
} from 'lucide-react';
import { useAuth } from '../../lib/authContext.js';
import { Button } from '../ui/Button.js';
import { useToast } from '../ui/Toast.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, quickLogin, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Lütfen e-posta adresinizi giriniz.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(email, password);
      if (success) {
        showToast('Başarıyla giriş yapıldı. Hoş geldiniz!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Giriş yapılamadı.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Lütfen ad ve e-posta alanlarını doldurunuz.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await register(name, email, password || '123456', role);
      if (success) {
        showToast('Hesabınız başarıyla oluşturuldu!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Kayıt işlemi başarısız oldu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuick = async (selectedRole: 'admin' | 'user') => {
    try {
      setIsSubmitting(true);
      await quickLogin(selectedRole);
      showToast(
        selectedRole === 'admin' 
          ? '👑 Yönetici olarak hızlı giriş yapıldı!' 
          : '👤 Demo kullanıcı olarak hızlı giriş yapıldı!', 
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Hızlı giriş yapılamadı.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-indigo-100 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Space_Grotesk'] leading-tight">
                {authModalTab === 'login' ? 'NeDiyor Hesabınıza Giriş Yapın' : 'NeDiyor Ailesine Katılın'}
              </h2>
              <p className="text-xs text-indigo-100">
                Tüketici zekası, fiyat takibi ve kişiselleştirilmiş analizler
              </p>
            </div>
          </div>

          {/* Quick Demo Switcher Chips */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Hızlı Test:</span>
            <button
              type="button"
              onClick={() => handleQuick('admin')}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-white/20 shadow-2xs"
            >
              <ShieldCheck className="w-3 h-3 text-amber-300" />
              <span>Yönetici (Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('user')}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-white/15 shadow-2xs"
            >
              <UserIcon className="w-3 h-3 text-indigo-200" />
              <span>Standart Üye</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-3">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex-1 text-center ${
              authModalTab === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex-1 text-center ${
              authModalTab === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Yeni Hesap Aç
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@nediyor.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Şifre
                  </label>
                  <span className="text-[11px] text-slate-400">Demo şifre: 123456</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-2.5 font-bold text-xs shadow-md shadow-indigo-600/10"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>

              <p className="text-center text-[11px] text-slate-500 pt-2">
                Hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Hemen Kayıt Olun
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Adınız ve Soyadınız
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ahmet Aslan"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Şifre Belirleyin
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hesap Türü
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'user'
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Standart Üye</div>
                    <div className="text-[10px] text-slate-500">Takip & Yorumlar</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'admin'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>Yönetici</span>
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                    </div>
                    <div className="text-[10px] text-slate-500">Admin Paneli & AI</div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-2.5 font-bold text-xs shadow-md shadow-indigo-600/10"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? 'Hesap Oluşturuluyor...' : 'Ücretsiz Kayıt Ol'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>

              <p className="text-center text-[11px] text-slate-500 pt-2">
                Zaten hesabınız var mı?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Giriş Yapın
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
