
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/providers/AppProviders';
import AppShellManager from '@/components/shells/AppShellManager';

function App() {
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* All routes now go through AppShellManager for proper shell/layout handling */}
            <Route path="/*" element={<AppShellManager />} />
          </Routes>
        </div>
      </Router>
    </AppProviders>
  );
}

export default App;
