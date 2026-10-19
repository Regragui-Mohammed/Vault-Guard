import { useState, useCallback } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewPage from './components/OverviewPage';
import ArchivesPage from './components/ArchivesPage';
import PillarsPage from './components/PillarsPage';
import SimulatorPage from './components/SimulatorPage';
import AutomationPage from './components/AutomationPage';
import LogsPage from './components/LogsPage';
import ToastContainer from './components/ToastContainer';

let toastId = 0;

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [threatLevel, setThreatLevel] = useState('secure');
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, msg) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, msg }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const renderPage = () => {
    const props = { addToast, setThreatLevel };
    switch (activeTab) {
      case 'overview':   return <OverviewPage {...props} />;
      case 'archives':   return <ArchivesPage {...props} />;
      case 'pillars':    return <PillarsPage {...props} />;
      case 'simulator':  return <SimulatorPage {...props} />;
      case 'automation': return <AutomationPage {...props} />;
      case 'logs':       return <LogsPage {...props} />;
      default:           return <OverviewPage {...props} />;
    }
  };

  return (
    <>
      <div className="grid-bg" />
      <div className="app-layout">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="main-content">
          <TopBar activeTab={activeTab} threatLevel={threatLevel} />
          <div className="page-content">
            {renderPage()}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
