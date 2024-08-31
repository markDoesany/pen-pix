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

const App = () => {
  const location = useLocation();
  const state = location.state || {};
  const user = useRecoilValue(UserAtom);
  const pathsWithoutNavbar = ['/auth', '/', '/reset-password'];
  const showNavbar = !pathsWithoutNavbar.includes(location.pathname);
  const isAuthOrLandingPage = pathsWithoutNavbar.includes(location.pathname);

  return (
    <ToastProvider> 
      <main className={`${isAuthOrLandingPage ? '' : 'flex justify-center items-center min-h-screen bg-gray-100'}`}>
        <div className={`${isAuthOrLandingPage ? '' : 'flex flex-col max-w-6xl w-full min-h-screen p-5'}`}>
          {showNavbar && <Header />}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={user ? <Navigate to={`/dashboard/${user.id}`} /> : <Authentication />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard/:userId" element = {<Dashboard/>}/>
            <Route path="/task/:taskId" element = {<TaskPage/>}/>
            <Route path="/circuit-evaluator" element = {<CircuitInspectorPage/>}/>
            <Route path="/error" element={<ErrorPage errorType={state.errorType} errorMessage={state.errorMessage} />} />
            <Route path="*" element={<ErrorPage errorType="404" errorMessage="Page not found!" />} />
          </Routes>
        </div>
      </main>
    </ToastProvider>
  );
};

export default App;
