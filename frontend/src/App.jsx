import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil'; 
import { UserAtom } from './atoms/UserAtom.js';
import Header from './components/Header.jsx';
import Authentication from './pages/Authentication/index.jsx';
import ResetPasswordPage from './pages/ResetPassword/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import TaskPage from './pages/TaskPage/index.jsx';
import LandingPage from './pages/LandingPage/index.jsx';
import CircuitInspectorPage from './pages/CircuitInspector/index.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { ToastProvider } from './contexts/ToastContext'; 
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

const App = () => {
  const location = useLocation();
  const state = location.state || {};
  const user = useRecoilValue(UserAtom);

  // Paths where the navbar should be hidden
  const pathsWithoutNavbar = ['/auth', '/reset-password', `/circuit-evaluator/${location.pathname.split('/')[2]}`];
  const showNavbar = !pathsWithoutNavbar.some(path => location.pathname.startsWith(path)) && location.pathname !== '/';

  return (
    <ToastProvider> 
      <main className={`${showNavbar ? 'flex justify-center items-center w-full min-h-screen bg-gray-100' : ''}`}>
        <div className={`${showNavbar ? 'flex flex-col max-w-6xl min-h-screen p-5 w-full' : ''}`}>
          {showNavbar && <Header />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={user ? <Navigate to={`/dashboard/${user.id}`} /> : <Authentication />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route path="/task/:taskId" element={<TaskPage />} />
            <Route path="/circuit-evaluator/:taskId" element={<CircuitInspectorPage />} />
            <Route path="/error" element={<ErrorPage errorType={state.errorType} errorMessage={state.errorMessage} />} />
            <Route path="*" element={<ErrorPage errorType="404" errorMessage="Page not found!" />} />
          </Routes>
        </div>
      </main>
    </ToastProvider>
  );
};

export default App;
