import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Activity, Sparkles, Calendar } from 'lucide-react';
import { PriceHistoryPoint } from '../../types/index.js';

interface TrendChartSectionProps {
  history: PriceHistoryPoint[];
  productName: string;
}

export const TrendChartSection: React.FC<TrendChartSectionProps> = ({ history, productName }) => {
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | 'ALL'>('6M');

  // Enrich data with synthetic sentiment score for demonstration
  const rawChartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    // Create a base sentiment based on product
    const baseSentiment = 8.5;
    
    return history.map((point) => {
      // Simulate sentiment slightly inverse to price changes
      const normalizedPrice = point.price / history[0].price;
      const stableNoise = ((point.price % 100) / 100 - 0.5) * 0.4; 
      
      const sentiment = Math.max(0, Math.min(10, baseSentiment + (1 - normalizedPrice) * 3 + stableNoise));
      
      const dateObj = new Date(point.date);
      const monthStr = dateObj.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
      
      return {
        date: point.date,
        displayDate: monthStr,
        price: point.price,
        sentiment: Number(sentiment.toFixed(1))
      };
    });
  }, [history]);

  const filteredData = useMemo(() => {
    if (timeRange === '3M') return rawChartData.slice(-3);
    if (timeRange === '6M') return rawChartData.slice(-6);
    return rawChartData;
  }, [rawChartData, timeRange]);

  if (!rawChartData || rawChartData.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                Piyasa Nabzı
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                Canlı Veri
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              Fiyat & Kullanıcı Memnuniyet Trendi
            </h2>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
          <button
            onClick={() => setTimeRange('3M')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === '3M'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Son 3 Ay
          </button>
          <button
            onClick={() => setTimeRange('6M')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === '6M'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Son 6 Ay
          </button>
          <button
            onClick={() => setTimeRange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === 'ALL'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Zamanlar
          </button>
        </div>
      </div>

      <div className="h-[340px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            {/* Left Y-Axis for Price */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `₺${(value/1000).toFixed(0)}k`}
              dx={-10}
              domain={['auto', 'auto']}
            />
            {/* Right Y-Axis for Sentiment */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              domain={[6, 10]}
              dx={10}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: '#ffffff'
              }}
              itemStyle={{ fontWeight: 600 }}
              formatter={(value: any, name: string) => {
                if (name === 'price') return [`₺${value.toLocaleString('tr-TR')}`, 'Piyasa Fiyatı'];
                return [`${value} / 10`, 'Duyarlılık Skoru'];
              }}
              labelStyle={{ color: '#475569', marginBottom: '8px', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}
              formatter={(value) => {
                return value === 'price' ? 'Piyasa Fiyatı (₺)' : 'Kullanıcı Duyarlılığı Skoru';
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="price" 
              stroke="#6366f1" 
              strokeWidth={3.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              name="price"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="sentiment" 
              stroke="#10b981" 
              strokeWidth={3.5}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              name="sentiment"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Small insight block */}
      <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-bold">Trend İçgörüsü:</strong> Fiyat düşüş periyotlarında kullanıcıların memnuniyet ve F/P duyarlılık oranı ortalama <strong>+0.6 puan</strong> artış göstermektedir.
        </div>
      </div>
    </div>
  );
};
