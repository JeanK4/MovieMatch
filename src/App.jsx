import React from 'react';
import { Routes, Route } from "react-router-dom"
import Login from './pages/Login.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Page404 from './pages/Page404.jsx'
import Recomendaciones from './pages/Recomendaciones.jsx'
import NavegationBar from './components/NavegationBar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <div>
          <NavegationBar/>
          <Routes>  
              <Route path="/" element={ <Login/> } />
              <Route path="Catalogo" element={ <Catalogo/> } />
              <Route path="Recomendaciones" element={ <Recomendaciones/> } />
              <Route path="*" element={ <Page404/> } />
          </Routes>
      </div>
    </>
  )
}

export default App;