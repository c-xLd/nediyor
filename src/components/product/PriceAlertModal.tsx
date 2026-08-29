import React, { useState } from 'react';
import { Bell, Check, X, ShieldCheck, Mail, ArrowDownRight } from 'lucide-react';
import { Button } from '../ui/Button.js';
import { useToast } from '../ui/Toast.js';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentPrice: number;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  productName,
  currentPrice,
}) => {
  const { showToast } = useToast();
  const [targetPrice, setTargetPrice] = useState<string>(
    Math.round(currentPrice * 0.9).toString()
  );
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice) return;
    setIsSubmitted(true);
    setTimeout(() => {
      showToast(`Fiyat alarmı kuruldu! Fiyat ${Number(targetPrice).toLocaleString('tr-TR')} ₺ altına düştüğünde bildirim alacaksınız.`);
      setIsSubmitted(false);
      onClose();
    }, 800);
  };

  const discountRate = Math.round(
    ((currentPrice - Number(targetPrice || currentPrice)) / currentPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
              Akıllı Fiyat Radarı
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
              Fiyat Alarmı Kur
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          <strong className="text-slate-900 font-semibold">{productName}</strong> fiyatı belirlediğiniz seviyeye veya daha altına indiğinde anında haberdar olun.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Güncel En Uygun Fiyat:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {currentPrice.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hedef Fiyatınız (₺)
            </label>
            <div className="relative">
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Örn: 48000"
                min="100"
                max={currentPrice}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₺
              </span>
            </div>
            {discountRate > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1.5">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Güncel fiyata göre %{discountRate} indirim hedeflendi</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bildirim E-posta Adresi
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm font-bold shadow-md shadow-indigo-600/20"
              disabled={isSubmitted}
              leftIcon={isSubmitted ? <Check className="w-4 h-4 animate-bounce" /> : <Bell className="w-4 h-4" />}
            >
              {isSubmitted ? 'Alarm Kaydediliyor...' : 'Alarmı Başlat'}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Spam yok, yalnızca dip fiyat ve indirim bildirimleri</span>
          </div>
        </form>
      </div>
    </div>
  );
};
