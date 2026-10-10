import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import SectionSelection from './pages/SectionSelection';
import AssessmentSetup from './pages/AssessmentSetup';
import AudioQualityCheck from './pages/AudioQualityCheck';
import ReadyToStart from './pages/ReadyToStart';
import SectionAIntro from './pages/SectionAIntro';
import SectionATest from './pages/SectionATest';
import SectionBIntro from './pages/SectionBIntro';
import SectionBTest from './pages/SectionBTest';
import SectionCIntro from './pages/SectionCIntro';
import SectionCTest from './pages/SectionCTest';
import SectionDIntro from './pages/SectionDIntro';
import SectionDTest from './pages/SectionDTest';
import SectionEIntro from './pages/SectionEIntro';
import SectionETest from './pages/SectionETest';
import SectionPlaceholder from './pages/SectionPlaceholder';
import ResultsDashboard from './pages/ResultsDashboard';
import Settings from './pages/Settings';
import { 
  isSectionUnlocked, 
  getPrecedingSection, 
  getLatestUnlockedSection, 
  SECTION_NAMES 
} from './utils/storage';

/**
 * Route protection guard for strict sequential section locking:
 * Section A -> Section B -> Section C -> Section D -> Section E
 * Unlocks sequentially upon submission or time expiration.
 * Unauthorized/premature access redirects to the latest unlocked section with a helpful notice.
 */
function SectionLockRoute({ sectionId, children }) {
  const isUnlocked = isSectionUnlocked(sectionId);
  const preceding = getPrecedingSection(sectionId);

  if (!isUnlocked) {
    const latestUnlocked = getLatestUnlockedSection();
    const target = latestUnlocked === 'section-a' ? '/section-a/intro' : `/${latestUnlocked}/intro`;
    return (
      <Navigate
        to={target}
        replace
        state={{
          lockedMessage: `${SECTION_NAMES[sectionId] || sectionId} is currently locked. You must complete ${preceding?.name || 'the previous section'} first.`
        }}
      />
    );
  }

  return children;
}

function AppContent() {
  const location = useLocation();

  // Full-bleed standalone assessment screens matching reference screenshots
  const isAssessmentScreen = 
    location.pathname.startsWith('/section-a/') ||
    location.pathname.startsWith('/section-b/') ||
    location.pathname.startsWith('/section-c/') ||
    location.pathname.startsWith('/section-d/') ||
    location.pathname.startsWith('/section-e/');

  if (isAssessmentScreen) {
    return (
      <Routes>
        {/* Section A */}
        <Route path="/section-a/intro" element={<SectionAIntro />} />
        <Route path="/section-a/test" element={<SectionATest />} />

        {/* Section B (Strict Lock: Requires Section A completion) */}
        <Route 
          path="/section-b/intro" 
          element={
            <SectionLockRoute sectionId="section-b">
              <SectionBIntro />
            </SectionLockRoute>
          } 
        />
        <Route 
          path="/section-b/test" 
          element={
            <SectionLockRoute sectionId="section-b">
              <SectionBTest />
            </SectionLockRoute>
          } 
        />

        {/* Section C (Strict Lock: Requires Section B completion) */}
        <Route 
          path="/section-c/intro" 
          element={
            <SectionLockRoute sectionId="section-c">
              <SectionCIntro />
            </SectionLockRoute>
          } 
        />
        <Route 
          path="/section-c/test" 
          element={
            <SectionLockRoute sectionId="section-c">
              <SectionCTest />
            </SectionLockRoute>
          } 
        />

        {/* Section D (Strict Lock: Requires Section C completion) */}
        <Route 
          path="/section-d/intro" 
          element={
            <SectionLockRoute sectionId="section-d">
              <SectionDIntro />
            </SectionLockRoute>
          } 
        />
        <Route 
          path="/section-d/test" 
          element={
            <SectionLockRoute sectionId="section-d">
              <SectionDTest />
            </SectionLockRoute>
          } 
        />

        {/* Section E (Strict Lock: Requires Section D completion) */}
        <Route 
          path="/section-e/intro" 
          element={
            <SectionLockRoute sectionId="section-e">
              <SectionEIntro />
            </SectionLockRoute>
          } 
        />
        <Route 
          path="/section-e/test" 
          element={
            <SectionLockRoute sectionId="section-e">
              <SectionETest />
            </SectionLockRoute>
          } 
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/setup" element={<AssessmentSetup />} />
          <Route path="/instructions" element={<Navigate to="/setup" replace />} />
          <Route path="/audio-check" element={<AudioQualityCheck />} />
          <Route path="/assessment-instructions" element={<Navigate to="/audio-check" replace />} />
          <Route path="/ready-to-start" element={<ReadyToStart />} />

          {/* Sections Directory & Results */}
          <Route path="/sections" element={<SectionSelection />} />
          <Route path="/practice/:sectionId" element={<SectionPlaceholder />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
