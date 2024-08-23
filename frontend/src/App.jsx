import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authentication from './pages/Authentication/index.jsx';
import ResetPasswordPage from './pages/ResetPassword/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import LandingPage from './pages/LandingPage/index.jsx';
import { ToastProvider } from './contexts/ToastContext'; // Import ToastProvider
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <ToastProvider> 
        <Routes>
          <Route path={"/"} element={<LandingPage />} />
          <Route path={"/auth"} element={<Authentication />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
        </Routes>
      </ToastProvider>
    </Router>
  );
};

export default App;
