import React from 'react';
import { Link } from 'react-router-dom';
import './Page404.css';

function Page404() {
    return (
        <div className="shell notfound">
            <p className="notfound-code">404</p>
            <h1>Esta escena no existe</h1>
            <p className="notfound-text">La página que buscas se quedó en la sala de edición.</p>
            <div className="notfound-actions">
                <Link to="/Catalogo" className="btn btn-primary">Ir al catálogo</Link>
                <Link to="/Recomendaciones" className="btn btn-ghost">Generar una recomendación</Link>
            </div>
        </div>
    );
}

export default Page404;
