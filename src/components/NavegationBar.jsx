import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, LogOut, Clapperboard, Sparkles } from 'lucide-react';
import { logout } from '../storage/reducers/actions';
import Logo from './Logo';
import './Navbar.css'

const LINKS = [
    { to: '/Catalogo', label: 'Catálogo', icon: Clapperboard },
    { to: '/Recomendaciones', label: 'Generar recomendaciones', icon: Sparkles },
];

function NavegationBar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [indicator, setIndicator] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Mide el enlace activo para deslizar la píldora indicadora hasta él.
    useLayoutEffect(() => {
        const measure = () => {
            const active = listRef.current?.querySelector('.nav-link.active');
            const li = active?.parentElement;
            setIndicator(li ? { x: li.offsetLeft, w: li.offsetWidth } : null);
        };
        measure();
        window.addEventListener('resize', measure);
        document.fonts?.ready.then(measure);
        return () => window.removeEventListener('resize', measure);
    }, [location.pathname, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // En la pantalla de acceso la presentación ya lleva el logo: sin barra.
    if (!user && location.pathname === '/') return null;

    const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? '?';

    return (
        <header className={`nav ${open ? 'is-open' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
            <div className="shell nav-inner">
                <Link to={user ? '/Catalogo' : '/'} className="nav-brand" aria-label="Movie Match, inicio"><Logo size={42} title="Movie Match" /></Link>

                {user && (
                    <>
                        <button
                            type="button"
                            className="nav-toggle"
                            aria-expanded={open}
                            aria-controls="nav-panel"
                            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                            onClick={() => setOpen((v) => !v)}
                        >
                            <span className="nav-toggle-icon" key={open ? 'x' : 'm'}>
                                {open ? <X size={22} /> : <Menu size={22} />}
                            </span>
                        </button>

                        <div className="nav-panel" id="nav-panel">
                            <nav aria-label="Principal">
                                <ul className="nav-links" ref={listRef}>
                                    {indicator && (
                                        <li
                                            className="nav-indicator"
                                            aria-hidden="true"
                                            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
                                        />
                                    )}
                                    {LINKS.map(({ to, label, icon: Icon }, i) => (
                                        <li key={to} style={{ '--i': i }}>
                                            <NavLink to={to} className="nav-link">
                                                <Icon size={17} aria-hidden="true" />
                                                {label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="nav-user">
                                <span className="nav-avatar" aria-hidden="true">{initial}</span>
                                <span className="nav-user-name">{user.name}</span>
                                <button type="button" className="nav-logout" onClick={handleLogout}>
                                    <LogOut size={17} aria-hidden="true" />
                                    <span>Salir</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default NavegationBar;
