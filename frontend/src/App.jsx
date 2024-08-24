import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil'; // Import RecoilRoot
import { UserAtom } from './atoms/UserAtom.js';
import Authentication from './pages/Authentication/index.jsx';
import ResetPasswordPage from './pages/ResetPassword/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import LandingPage from './pages/LandingPage/index.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { ToastProvider } from './contexts/ToastContext'; // Import ToastProvider
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const state = location.state || {}
  const user  = useRecoilValue(UserAtom)

  return (
    <ToastProvider> 
      <Routes>
        <Route path="/" element= {<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to={`/dashboard/${user.id}`}/> : <Authentication/>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
         <Route path="/error" element={<ErrorPage errorType={state.errorType} errorMessage={state.errorMessage} />} />
         <Route path="*" element={<ErrorPage errorType="404" errorMessage="Page not found!" />} />

      </Routes>
    </ToastProvider>
  );
};

export default App;
