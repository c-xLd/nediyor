import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Check, 
  Save, 
  ArrowLeft, 
  LayoutDashboard, 
  Sliders, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  LogOut,
  Share2,
  Globe,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../lib/authContext.js';
import { useRouter } from '../lib/router.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { useToast } from '../components/ui/Toast.js';
import { SocialAuthProvider } from '../types/index.js';
import { GoogleIcon, AppleIcon, ChatGPTIcon, FacebookIcon, InstagramIcon } from '../components/auth/SocialIcons.js';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout, isAdmin, openAuthModal, toggleSocialProvider, socialLogin } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'social'>('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      setEmailNotifications(user.preferences?.emailNotifications ?? true);
      setPriceDropAlerts(user.preferences?.priceDropAlerts ?? true);
      setWeeklyDigest(user.preferences?.weeklyDigest ?? true);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-xs">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
          Ayarları Görmek İçin Giriş Yapmalısınız
        </h1>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Hesap tercihlerinizi, fiyat alarmlarınızı ve profil bilgilerinizi yönetmek için lütfen giriş yapın veya kayıt olun.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={() => openAuthModal('login')}>
            Giriş Yap
          </Button>
          <Button variant="outline" onClick={() => openAuthModal('register')}>
            Kayıt Ol
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Lütfen ad ve e-posta alanlarını boş bırakmayınız.', 'error');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast('Yeni şifreler birbiriyle eşleşmiyor.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const success = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        preferences: {
          emailNotifications,
          priceDropAlerts,
          weeklyDigest
        },
        password: newPassword || undefined
      });

      if (success) {
        showToast('Profil ve tercihleriniz başarıyla güncellendi.', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast('Güncelleme yapılamadı.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Profil güncellenirken hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <button onClick={() => navigate('/')} className="hover:text-indigo-600 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ana Sayfa</span>
                </button>
                <span>/</span>
                <span className="text-slate-900">Hesap Ayarları</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                Profil & Tercih Yönetimi
              </h1>
            </div>

            {/* Admin Banner Button if user is Admin */}
            {isAdmin && (
              <Button
                variant="primary"
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md shadow-amber-600/10 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Paneline Git</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={avatarUrl || user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                  }}
                />
                {isAdmin && (
                  <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-lg shadow-xs" title="Platform Yöneticisi">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500 mb-3">{user.email}</p>

              <div className="flex justify-center mb-4">
                <Badge variant={isAdmin ? 'amber' : 'indigo'} size="sm" className="font-bold">
                  {isAdmin ? '👑 Platform Yöneticisi (Admin)' : '👤 Doğrulanmış Üye'}
                </Badge>
              </div>

              {user.bio && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-left">
                  "{user.bio}"
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Üyelik Tarihi:</span>
                <span className="font-semibold text-slate-700">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'profile'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profil Bilgileri</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'notifications'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Fiyat & Bildirim Alarmları</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'security'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Güvenlik & Şifre</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${
                  activeTab === 'social'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4" />
                  <span>Sosyal Giriş & Hesaplar</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {user.connectedProviders?.length || 1} Bağlı
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  showToast('Oturum kapatıldı.', 'info');
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>

          {/* Right Main Settings Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-1">
                      Kişisel Profil Bilgileri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Yorumlarınızda ve takip listelerinizde görüntülenecek bilgilerinizi güncelleyin.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        E-posta Adresi
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Profil Fotoğrafı URL (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Boş bırakırsanız isminize özel otomatik avatar oluşturulur.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hakkımda / Biyografi
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Teknoloji merakı veya ilgi duyduğunuz ürün kategorileri..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-1">
                      Fiyat & Bildirim Tercihleri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hangi durumlarda e-posta veya anlık bildirim almak istediğinizi seçin.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={priceDropAlerts}
                        onChange={(e) => setPriceDropAlerts(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Dip Fiyat ve İndirim Alarmları
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Takip listenizdeki ürünler son 90 günün dip fiyatına indiğinde anında haber ver.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Haftalık AI Tüketici Özeti
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Haftanın en çok puanlanan F/P ürünleri ve kronik sorun uyarıları bülteni.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Yorum & Yanıt Bildirimleri
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Eklediğiniz yorumlara 'Yararlı' oyu verildiğinde veya soru sorulduğunda bildir.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-1">
                      Şifre & Güvenlik
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hesap güvenliğinizi sağlamak için düzenli olarak güçlü bir şifre kullanın.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Yeni Şifre Tekrar
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] mb-1">
                      Sosyal Giriş & Bağlı Hesaplar
                    </h3>
                    <p className="text-xs text-slate-500">
                      Google, Apple, ChatGPT, Facebook ve Instagram hesaplarınızı bağlayarak şifresiz, tek tıkla giriş yapabilirsiniz.
                    </p>
                  </div>

                  {/* Connected Accounts List */}
                  <div className="space-y-3">
                    {[
                      {
                        id: 'google' as SocialAuthProvider,
                        name: 'Google Hesabı',
                        desc: 'Google Workspace ve Gmail ile senkronize oturum açma',
                        icon: <GoogleIcon className="w-5 h-5" />,
                        email: user.authProvider === 'google' ? user.email : 'ahmet.as060@gmail.com',
                        bg: 'bg-blue-50/40 border-blue-100'
                      },
                      {
                        id: 'apple' as SocialAuthProvider,
                        name: 'Apple Kimliği',
                        desc: 'Gizlilik korumalı Apple Private Relay oturumu',
                        icon: <AppleIcon className="w-5 h-5 text-slate-900" />,
                        email: user.authProvider === 'apple' ? user.email : 'ahmet.aslan@privaterelay.appleid.com',
                        bg: 'bg-neutral-50 border-neutral-200'
                      },
                      {
                        id: 'chatgpt' as SocialAuthProvider,
                        name: 'ChatGPT / OpenAI',
                        desc: 'OpenAI tüketici profili ve kişiselleştirilmiş AI analitiği',
                        icon: <ChatGPTIcon className="w-5 h-5 text-emerald-600" />,
                        email: user.authProvider === 'chatgpt' ? user.email : 'ahmet.openai@chatgpt.account',
                        bg: 'bg-emerald-50/40 border-emerald-100'
                      },
                      {
                        id: 'facebook' as SocialAuthProvider,
                        name: 'Facebook (Meta)',
                        desc: 'Meta sosyal grafiği ve doğrulanmış kimlik',
                        icon: <FacebookIcon className="w-5 h-5 text-[#1877F2]" />,
                        email: user.authProvider === 'facebook' ? user.email : 'ahmet.aslan@facebook.user',
                        bg: 'bg-blue-50/30 border-blue-100'
                      },
                      {
                        id: 'instagram' as SocialAuthProvider,
                        name: 'Instagram',
                        desc: 'Instagram içerik ve ürün topluluk entegrasyonu',
                        icon: (
                          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-2xs">
                            <InstagramIcon className="w-4 h-4 text-white" />
                          </div>
                        ),
                        email: user.authProvider === 'instagram' ? user.email : 'ahmet.aslan@instagram.user',
                        bg: 'bg-pink-50/30 border-pink-100'
                      }
                    ].map((provider) => {
                      const isConnected = user.connectedProviders?.includes(provider.id) || user.authProvider === provider.id;
                      const isPrimary = user.authProvider === provider.id;
                      const isLoadingThis = socialLoading === provider.id;

                      const handleToggle = async () => {
                        try {
                          setSocialLoading(provider.id);
                          if (isConnected) {
                            if (isPrimary && (!user.connectedProviders || user.connectedProviders.length <= 1)) {
                              showToast('Ana giriş sağlayıcınızın bağlantısını kesemezsiniz. Önce başka bir hesap bağlayınız.', 'error');
                              return;
                            }
                            await toggleSocialProvider(provider.id, 'disconnect');
                            showToast(`${provider.name} bağlantısı kaldırıldı.`, 'info');
                          } else {
                            await toggleSocialProvider(provider.id, 'connect');
                            showToast(`${provider.name} başarıyla bağlandı!`, 'success');
                          }
                        } catch (err: any) {
                          showToast(err.message || 'İşlem gerçekleştirilemedi.', 'error');
                        } finally {
                          setSocialLoading(null);
                        }
                      };

                      return (
                        <div
                          key={provider.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                              {provider.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {provider.name}
                                </span>
                                {isConnected ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {isPrimary ? 'Ana Giriş' : 'Bağlı'}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    Bağlı Değil
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {isConnected ? (
                                  <span className="text-slate-700 font-medium">{provider.email}</span>
                                ) : (
                                  provider.desc
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              disabled={isLoadingThis}
                              onClick={handleToggle}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isConnected
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs'
                              }`}
                            >
                              {isLoadingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isConnected ? (
                                <>
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Bağlantıyı Kes</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Şimdi Bağla</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Son güncelleme anında aktif olur.
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  className="font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                </Button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
