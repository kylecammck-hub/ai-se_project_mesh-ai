import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AppLayout from '../AppLayout/AppLayout';
import AuthLayout from '../AuthLayout/AuthLayout';
import Intro from '../../pages/Intro/Intro';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import Chat from '../../pages/Chat/Chat';
import KnowledgeBase from '../../pages/KnowledgeBase/KnowledgeBase';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
