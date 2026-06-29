import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { currentScreen, navigateToAdmin } from './lib/navigation';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { TermsScreen } from './pages/TermsScreen';
import { GradeSelection } from './pages/GradeSelection';
import { ReviewTypeSelection } from './pages/ReviewTypeSelection';
import { SubjectSelection } from './pages/SubjectSelection';
import { AdminUpload } from './pages/AdminUpload';
import { MaterialsManagement } from './pages/MaterialsManagement';
import './index.css';

function App() {
  const screen = useStore(currentScreen);

  // Check for admin access via URL hash
  useEffect(() => {
    const checkAdminAccess = () => {
      const hash = window.location.hash;
      // Access admin via #admin or #admin-panel
      if (hash === '#admin' || hash === '#admin-panel') {
        navigateToAdmin();
      }
    };

    checkAdminAccess();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkAdminAccess);
    return () => window.removeEventListener('hashchange', checkAdminAccess);
  }, []);

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'terms' && <TermsScreen />}
      {screen === 'grade' && <GradeSelection />}
      {screen === 'reviewType' && <ReviewTypeSelection />}
      {screen === 'subject' && <SubjectSelection />}
      {screen === 'admin' && <AdminUpload />}
      {screen === 'materials' && <MaterialsManagement />}
    </>
  );
}

export default App;
