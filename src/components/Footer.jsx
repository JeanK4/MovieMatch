import React from 'react';
import Logo from './Logo';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="shell footer-inner">
                <Logo size={30} className="footer-logo" />
                <p>
                    Datos e imágenes de{' '}
                    <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a>.
                    Este producto usa la API de TMDB, pero TMDB no lo respalda ni lo certifica.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
