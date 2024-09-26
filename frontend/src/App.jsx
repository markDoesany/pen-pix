import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil'; 
import { UserAtom } from './atoms/UserAtom.js';
import Header from './components/Header.jsx';
import Authentication from './pages/Authentication/index.jsx';
import ResetPasswordPage from './pages/ResetPassword/index.jsx';
import EmailVerificationPage from './pages/EmailVerification/index.jsx';
import Dashboard from './pages/DashboardPage/index.jsx';
import CreateTaskPage from './pages/CreateTaskPage/index.jsx';
import CreateClassPage from './pages/CreateClassPage/index.jsx';
import TaskPage from './pages/TaskPage/index.jsx';
import LandingPage from './pages/LandingPage/index.jsx';
import CircuitInspectorPage from './pages/CircuitInspector/index.jsx';
import SubmissionPage from './pages/SubmissionPage/index.jsx'
import ClassPage from './pages/ClassPage/index.jsx';
import NotificationPage from './pages/NotificationsPage/index.jsx';
import SettingsPage from './pages/SettingsPage/index.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { ToastProvider } from './contexts/ToastContext'; 

import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

const App = () => {
  const location = useLocation();
  const state = location.state || {};
  const user = useRecoilValue(UserAtom);

  // Paths where the navbar should be hidden
  const pathsWithoutNavbar = ['/auth', '/reset-password', '/verify-email',`/student-upload/${location.pathname.split('/')[2]}`, `/circuit-evaluator/${location.pathname.split('/')[2]}`];
  const showNavbar = !pathsWithoutNavbar.some(path => location.pathname.startsWith(path)) && location.pathname !== '/';

  return (
    <ToastProvider> 
      <main className={`${showNavbar ? 'flex flex-col  w-full h- min-h-screen bg-[#EFEFEF]' : ''}`}>
        {showNavbar && <Header />}
        <div className={`${showNavbar ? 'flex flex-col w-full min-h-screen' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={user ? <Navigate to={`/dashboard/${user.id}`} /> : <Authentication />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route path="/classes/:userId" element={<ClassPage />} />
            <Route path="/create-class" element={<CreateClassPage />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
            <Route path="/task/:taskId" element={<TaskPage />} />
            <Route path="/circuit-evaluator/:taskId" element={<CircuitInspectorPage />} />
            <Route path="/student-upload/:taskId" element={<SubmissionPage />} />
            <Route path="/notifications" element={<NotificationPage/>} />
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/error" element={<ErrorPage errorType={state.errorType} errorMessage={state.errorMessage} />} />
            <Route path="*" element={<ErrorPage errorType="404" errorMessage="Page not found!" />} />
          </Routes>
        </div>
      </main>
    </ToastProvider>
  );
};

export default App;
