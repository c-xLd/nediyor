import React from 'react';
import { RouterProvider, useRouter } from './lib/router.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { SearchResultsPage } from './pages/SearchResultsPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { ComparePage } from './pages/ComparePage.js';
import { ProductFinderPage } from './pages/ProductFinderPage.js';
import { UpgradeAdvisorPage } from './pages/UpgradeAdvisorPage.js';
import { DealsRadarPage } from './pages/DealsRadarPage.js';
import { RankingsPage } from './pages/RankingsPage.js';
import { BrandsDirectoryPage } from './pages/BrandsDirectoryPage.js';
import { BrandProfilePage } from './pages/BrandProfilePage.js';
import { DataSourcesPage } from './pages/DataSourcesPage.js';
import { WatchlistPage } from './pages/WatchlistPage.js';
import { Button } from './components/ui/Button.js';
import { ToastProvider } from './components/ui/Toast.js';
import { AlertCircle } from 'lucide-react';

const RouteHandler: React.FC = () => {
  const { path, navigate } = useRouter();

  // Route 1: Home
  if (path === '/' || path === '') {
    return <HomePage />;
  }

  // Route 2: Search Results
  if (path === '/ara' || path.startsWith('/ara/')) {
    return <SearchResultsPage />;
  }

  // Route 3: Product Detail (/urun/:slug)
  if (path.startsWith('/urun/')) {
    const slug = path.replace('/urun/', '').split('/')[0];
    if (slug) {
      return <ProductDetailPage slug={slug} />;
    }
  }

  // Route 4: Compare (/karsilastir)
  if (path === '/karsilastir' || path.startsWith('/karsilastir/')) {
    return <ComparePage />;
  }

  // Route 5: Product Finder / Smart Wizard (/urun-bulucu)
  if (path === '/urun-bulucu' || path === '/sihirbaz' || path.startsWith('/urun-bulucu/')) {
    return <ProductFinderPage />;
  }

  // Route 6: Upgrade Advisor (/yukseltme-danismani)
  if (path === '/yukseltme-danismani' || path.startsWith('/yukseltme-danismani/')) {
    return <UpgradeAdvisorPage />;
  }

  // Route 7: Deals & Lowest Price Radar (/firsat-radari /firsatlar)
  if (path === '/firsat-radari' || path === '/firsatlar' || path.startsWith('/firsat-radari/')) {
    return <DealsRadarPage />;
  }
  
  // Route 8: Rankings / Tier Lists (/siralamalar)
  if (path === '/siralamalar' || path.startsWith('/siralamalar/')) {
    return <RankingsPage />;
  }

  // Route 9: Brands Directory (/markalar)
  if (path === '/markalar') {
    return <BrandsDirectoryPage />;
  }

  // Route 10: Brand Profile (/marka/:slug or /markalar/:slug)
  if (path.startsWith('/marka/') || path.startsWith('/markalar/')) {
    const cleanPath = path.startsWith('/markalar/') ? path.replace('/markalar/', '') : path.replace('/marka/', '');
    const slug = cleanPath.split('/')[0].split('?')[0];
    if (slug) {
      return <BrandProfilePage slug={slug} />;
    }
  }

  // Route 11: Data Sources & Methodology Transparency (/veri-kaynaklari or /nasil-calisir)
  if (path === '/veri-kaynaklari' || path === '/nasil-calisir' || path.startsWith('/veri-kaynaklari/')) {
    return <DataSourcesPage />;
  }

  // Route 12: Watchlist & Price Tracking (/takip-listem or /favoriler)
  if (path === '/takip-listem' || path === '/favoriler' || path.startsWith('/takip-listem/')) {
    return <WatchlistPage />;
  }

  // Route 13: 404 Fallback
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
          Sayfa Bulunamadı (404)
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Ulaşmaya çalıştığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex justify-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-indigo-500 selection:text-white bg-grid-pattern relative">
          {/* Subtle top ambient spotlight */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none z-0" />
          
          <Navbar />
          <main className="flex-1 relative z-10">
            <RouteHandler />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </RouterProvider>
  );
}
