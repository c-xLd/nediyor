import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Loader2,
  Lock
} from 'lucide-react';
import { SocialAuthProvider } from '../../types/index.js';
import { useAuth } from '../../lib/authContext.js';
import { useToast } from '../ui/Toast.js';
import { GoogleIcon, AppleIcon, ChatGPTIcon, FacebookIcon, InstagramIcon } from './SocialIcons.js';

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
  mode?: 'login' | 'register';
  compact?: boolean;
}

interface ProviderMeta {
  id: SocialAuthProvider;
  name: string;
  shortName: string;
  tagline: string;
  icon: React.ReactNode;
  bgClass: string;
  hoverClass: string;
  textClass: string;
  borderClass: string;
  defaultEmail: string;
  defaultName: string;
}

const PROVIDERS: ProviderMeta[] = [
  {
    id: 'google',
    name: 'Google ile Devam Et',
    shortName: 'Google',
    tagline: 'Güvenli ve hızlı Google kimliği',
    icon: <GoogleIcon className="w-4 h-4 shrink-0" />,
    bgClass: 'bg-white',
    hoverClass: 'hover:bg-slate-50 hover:border-slate-300',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200 shadow-2xs',
    defaultEmail: 'ahmet.as060@gmail.com',
    defaultName: 'Ahmet Aslan'
  },
  {
    id: 'apple',
    name: 'Apple ile Giriş Yap',
    shortName: 'Apple',
    tagline: 'Gizlilik korumalı Apple Kimliği',
    icon: <AppleIcon className="w-4 h-4 shrink-0 text-white" />,
    bgClass: 'bg-black',
    hoverClass: 'hover:bg-neutral-900',
    textClass: 'text-white',
    borderClass: 'border-black shadow-2xs',
    defaultEmail: 'ahmet.aslan@privaterelay.appleid.com',
    defaultName: 'Ahmet Aslan (Apple)'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT ile Bağlan',
    shortName: 'ChatGPT',
    tagline: 'OpenAI yapay zeka tüketici hesabı',
    icon: <ChatGPTIcon className="w-4 h-4 shrink-0 text-emerald-400" />,
    bgClass: 'bg-[#10a37f]/10',
    hoverClass: 'hover:bg-[#10a37f]/20 hover:border-[#10a37f]/50',
    textClass: 'text-[#0e7c61]',
    borderClass: 'border-[#10a37f]/30 shadow-2xs',
    defaultEmail: 'ahmet.openai@chatgpt.account',
    defaultName: 'Ahmet Aslan (ChatGPT AI)'
  },
  {
    id: 'facebook',
    name: 'Facebook ile Bağlan',
    shortName: 'Facebook',
    tagline: 'Meta sosyal profili',
    icon: <FacebookIcon className="w-4 h-4 shrink-0 text-[#1877F2]" />,
    bgClass: 'bg-[#1877F2]/10',
    hoverClass: 'hover:bg-[#1877F2]/20 hover:border-[#1877F2]/40',
    textClass: 'text-[#1877F2]',
    borderClass: 'border-[#1877F2]/30 shadow-2xs',
    defaultEmail: 'ahmet.aslan@facebook.user',
    defaultName: 'Ahmet Aslan (Meta)'
  },
  {
    id: 'instagram',
    name: 'Instagram ile Bağlan',
    shortName: 'Instagram',
    tagline: 'Instagram fotoğraf & topluluk profili',
    icon: (
      <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-2xs">
        <InstagramIcon className="w-3.5 h-3.5 text-white" />
      </div>
    ),
    bgClass: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10',
    hoverClass: 'hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-rose-500/20 hover:border-pink-300',
    textClass: 'text-pink-700',
    borderClass: 'border-pink-200 shadow-2xs',
    defaultEmail: 'ahmet.aslan@instagram.user',
    defaultName: 'ahmet_aslan'
  }
];

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ 
  onSuccess, 
  mode = 'login',
  compact = false 
}) => {
  const { socialLogin } = useAuth();
  const { showToast } = useToast();

  const [activeProvider, setActiveProvider] = useState<ProviderMeta | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleProviderClick = (provider: ProviderMeta) => {
    setActiveProvider(provider);
    setCustomName(provider.defaultName);
    setCustomEmail(provider.defaultEmail);
  };

  const handleDirectAuth = async (provider: ProviderMeta, email?: string, name?: string) => {
    try {
      setIsAuthorizing(true);
      const targetEmail = email || provider.defaultEmail;
      const targetName = name || provider.defaultName;

      await socialLogin(provider.id, {
        email: targetEmail,
        name: targetName
      });

      showToast(`✓ ${provider.shortName} ile başarıyla oturum açıldı!`, 'success');
      setActiveProvider(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Sosyal giriş yapılamadı.', 'error');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Top 3 High-Priority Social Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Google Primary Full Button */}
        {PROVIDERS.filter(p => p.id === 'google').map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleProviderClick(p)}
            className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all duration-150 group text-xs font-bold ${p.bgClass} ${p.borderClass} ${p.hoverClass} ${p.textClass}`}
          >
            <div className="flex items-center gap-3">
              {p.icon}
              <span className="tracking-tight">{mode === 'register' ? 'Google ile Hızlı Kaydol' : 'Google ile Devam Et'}</span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-semibold transition-colors">
              Tek Tıkla
            </span>
          </button>
        ))}

        {/* 2x2 Grid for Apple, ChatGPT, Instagram, Facebook */}
        <div className="grid grid-cols-2 gap-2">
          {PROVIDERS.filter(p => p.id !== 'google').map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderClick(p)}
              className={`py-2 px-3 rounded-xl border flex items-center gap-2.5 transition-all duration-150 group text-xs font-semibold ${p.bgClass} ${p.borderClass} ${p.hoverClass} ${p.textClass}`}
              title={p.tagline}
            >
              {p.icon}
              <span className="truncate text-left">{p.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Realistic OAuth Permission Confirmation Modal */}
      <AnimatePresence>
        {activeProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6"
            >
              <button
                type="button"
                onClick={() => setActiveProvider(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Provider Badge Header */}
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center border shadow-xs bg-slate-50 border-slate-100">
                  <div className="scale-125">
                    {activeProvider.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-1">
                  {activeProvider.shortName} ile Yetkilendir
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  NeDiyor platformuna {activeProvider.shortName} kimliğinizle güvenli ve anında erişim sağlayın.
                </p>
              </div>

              {/* Account selection / customization card */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 mb-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName || activeProvider.shortName)}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 object-cover shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {customName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {customEmail}
                    </div>
                  </div>
                  <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                    Doğrulandı
                  </div>
                </div>

                {/* Edit details toggle */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Kullanıcı Adı:
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      E-posta:
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions scope list */}
              <div className="space-y-1.5 mb-5 px-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Temel profil bilgileri (Ad, E-posta)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fiyat takip listesi ve akıllı alarmlar</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Şifre paylaşılmaz, 256-bit SSL korumalı</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isAuthorizing}
                  onClick={() => handleDirectAuth(activeProvider, customEmail, customName)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  {isAuthorizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Bağlanıyor...</span>
                    </>
                  ) : (
                    <>
                      <span>{customName || activeProvider.shortName} Olarak Devam Et</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isAuthorizing}
                  onClick={() => setActiveProvider(null)}
                  className="w-full py-2 px-4 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Vazgeç
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
