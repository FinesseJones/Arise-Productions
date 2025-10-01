import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from '@/components/layout/Navigation';
import Homepage from './pages/Homepage';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import ClientDashboard from './pages/ClientDashboard';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import AIStudio from './pages/AIStudio';
import Onboarding from './pages/Onboarding';
import StudioTour from './pages/StudioTour';
import AssetLibrary from './pages/AssetLibrary';
import Collaboration from './pages/Collaboration';
import WritingRoom from './pages/WritingRoom';
import EditingSuite from './pages/EditingSuite';
import ScriptEditor from './pages/ScriptEditor';
import PlatformOptimizer from './pages/PlatformOptimizer';
import AdminPanel from './pages/AdminPanel';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/assets" element={<AssetLibrary />} />
          
          {/* Legacy routes for existing functionality */}
          <Route path="/old-dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/studio-tour" element={<StudioTour />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/writing-room/:id" element={<WritingRoom />} />
          <Route path="/editing-suite/:id" element={<EditingSuite />} />
          <Route path="/script-editor/:id" element={<ScriptEditor />} />
          <Route path="/platform-optimizer/:id" element={<PlatformOptimizer />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Toaster />
        
        {/* Copyright Footer */}
        <footer className="bg-navy-900/50 border-t border-gold-500/20 backdrop-blur-sm mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-gold-400 font-medium">
                © Finesse Jones | Vision-Driven | Creator-Led | Built To Empower Bold
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
