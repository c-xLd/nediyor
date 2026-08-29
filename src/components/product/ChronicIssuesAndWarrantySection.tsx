import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  FileText, 
  Battery, 
  Sparkles, 
  Info,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { ProductDetailData, ChronicIssue } from '../../types/index.js';
import { Badge } from '../ui/Badge.js';

interface ChronicIssuesAndWarrantySectionProps {
  product: ProductDetailData;
}

export const ChronicIssuesAndWarrantySection: React.FC<ChronicIssuesAndWarrantySectionProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'chronic' | 'warranty' | 'reliability'>('chronic');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const chronicData = product.chronicAndWarranty;
  if (!chronicData) return null;

  const { chronicIssues, warranty, reliability } = chronicData;

  const toggleIssue = (id: string) => {
    setExpandedIssue(expandedIssue === id ? null : id);
  };

  const getSeverityBadge = (sev: ChronicIssue['severity']) => {
    switch (sev) {
      case 'high':
        return <Badge variant="rose" size="sm">Kritik Risk</Badge>;
      case 'medium':
        return <Badge variant="amber" size="sm">Orta Risk / Dikkat</Badge>;
      case 'low':
      default:
        return <Badge variant="neutral" size="sm">Hafif / İzole</Badge>;
    }
  };

  const getStatusBadge = (status: ChronicIssue['status'], label: string) => {
    switch (status) {
      case 'resolved_update':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {label}
          </span>
        );
      case 'partially_fixed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            {label}
          </span>
        );
      case 'ongoing':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <Info className="w-3 h-3 text-slate-500" />
            {label}
          </span>
        );
    }
  };

  return (
    <div id="kronik-ve-garanti" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
                Kronik Sorun & Garanti Karnesi
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                Şeffaf Rapor
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Teknik servis verileri, forum şikayetleri ve 1+ yıllık uzun süreli kullanım deneyimleri.
            </p>
          </div>
        </div>

        {/* Risk Score Pill */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Endeksi</span>
            <span className="text-xs font-bold text-emerald-700">{reliability.riskLevel}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            {reliability.riskScore}/10
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-6 max-w-lg overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('chronic')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'chronic'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Bilinen Sorunlar ({chronicIssues.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('warranty')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'warranty'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Garanti & Servis</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reliability')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reliability'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Uzun Ömür</span>
        </button>
      </div>

      {/* Tab 1: Chronic Issues */}
      {activeTab === 'chronic' && (
        <div className="space-y-3 animate-fadeIn">
          {chronicIssues.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-center text-emerald-800 text-sm font-medium">
              Bu model için raporlanmış herhangi bir kronik donanım veya yazılım kusuru bulunmamaktadır.
            </div>
          ) : (
            chronicIssues.map((issue) => {
              const isExpanded = expandedIssue === issue.id;
              return (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all hover:border-slate-300"
                >
                  <div
                    onClick={() => toggleIssue(issue.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5 sm:mt-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>{issue.title}</span>
                          <span className="text-[11px] font-normal text-slate-500">
                            (Raporlanma: %{issue.frequencyRate})
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap sm:flex-nowrap pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/40">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getStatusBadge(issue.status, issue.statusLabel)}
                        {getSeverityBadge(issue.severity)}
                      </div>
                      <div className="p-1 text-slate-400 ml-auto sm:ml-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 bg-white space-y-3 text-xs leading-relaxed">
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">Sorun Detayı: </span>
                        {issue.description}
                      </p>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 flex items-start gap-2">
                        <Wrench className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Çözüm / Kullanıcı Tavsiyesi:</span>
                          <span>{issue.workaroundOrAdvice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Warranty & Service */}
      {activeTab === 'warranty' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Warranty Badge Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-900 block">{warranty.warrantyBadge}</span>
              <span className="text-[11px] text-emerald-700">Türkiye Distribütörü ve Tüketici Hakem Heyeti uyumluluğu tamdır.</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Servis Memnuniyeti</span>
              <span className="text-lg font-black text-slate-900">%{warranty.serviceSatisfactionScore}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Yüksek Başarı</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Ortalama Onarım</span>
              <span className="text-lg font-black text-slate-900">{warranty.avgRepairDays}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">Hızlı Teslimat</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">Yedek Parça</span>
              <span className="text-lg font-black text-slate-900">{warranty.partsAvailability}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">Stok Durumu</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">DOA İade / Değişim</span>
              <span className="text-lg font-black text-slate-900">{warranty.doaReplacementEase}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">İlk 14 Gün</span>
            </div>
          </div>

          {/* Feedback note */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Teknik Servis Değerlendirme Konsensüsü:</span>
            {warranty.commonServiceFeedback}
          </div>
        </div>
      )}

      {/* Tab 3: Long-term Reliability */}
      {activeTab === 'reliability' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Battery className="w-4 h-4 text-emerald-600" />
                <span>1 Yıl Sonrası Batarya Sağlığı</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {reliability.batteryHealthDropAfterYear}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Kasa & Kozmetik Dayanıklılık</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {reliability.cosmeticDurability}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 leading-relaxed flex items-start gap-3">
            <Award className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Uzun Ömürlülük Skoru: {reliability.hardwareLifespanScore}/10</span>
              <span>{reliability.riskSummary}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
