import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux';
import Login from './pages/Login.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Page404 from './pages/Page404.jsx'
import Recomendaciones from './pages/Recomendaciones.jsx'
import NavegationBar from './components/NavegationBar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const user = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const isAuth = !user && pathname === '/';

  return (
    <div className={`app ${isAuth ? 'is-auth' : ''}`}>
      <NavegationBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/Catalogo" replace /> : <Login />} />
          <Route path="Catalogo" element={<ProtectedRoute><Catalogo /></ProtectedRoute>} />
          <Route path="Recomendaciones" element={<ProtectedRoute><Recomendaciones /></ProtectedRoute>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
