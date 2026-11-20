import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../storage/reducers/actions';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from '../axios';
import requests, { posterUrl } from '../requests';
import Logo from '../components/Logo';
import './Login.css'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Sin backend: recordamos el nombre de cada correo registrado solo en este navegador.
const USERS_KEY = 'moviematch-users';
const readUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) ?? {}; } catch { return {}; }
};
const saveUser = (email, name) => {
    try { localStorage.setItem(USERS_KEY, JSON.stringify({ ...readUsers(), [email.toLowerCase()]: name })); } catch { /* sin almacenamiento */ }
};

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [action, setAction] = useState('Sign Up');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        axios.get(requests.fetchTrending)
            .then((res) => setPosters((res.data.results ?? []).filter((m) => m.poster_path).slice(0, 9)))
            .catch(() => setPosters([]));
    }, []);

    const isSignUp = action === 'Sign Up';

    const switchTo = (next) => {
        setAction(next);
        setFeedback(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isSignUp) {
            if (!nombre || !email || !password || !isValidEmail(email)) {
                setFeedback({ type: 'error', text: 'Completa tu nombre, un correo válido y una contraseña.' });
                return;
            }
            saveUser(email, nombre.trim());
            setAction('Login');
            setFeedback({ type: 'ok', text: `¡Listo, ${nombre}! Ya puedes iniciar sesión.` });
            return;
        }
        if (!isValidEmail(email) || !password) {
            setFeedback({ type: 'error', text: 'Escribe tu correo y tu contraseña para entrar.' });
            return;
        }
        const name = readUsers()[email.toLowerCase()] || email.split('@')[0];
        dispatch(login({ name, email }));
        navigate(location.state?.from ?? '/Catalogo', { replace: true });
    };

    return (
        <div className="shell auth">
            <section className="auth-intro">
                <div className="auth-posters" aria-hidden="true">
                    {posters.map((m) => (
                        <img key={m.id} src={posterUrl(m.poster_path, 'w185')} alt="" />
                    ))}
                </div>
                <div className="auth-intro-text">
                    <div className="auth-brand">
                        <Logo size={64} className="auth-logo" />
                        <p className="auth-wordmark">Movie Match</p>
                    </div>
                    <h1>Deja de buscar qué ver. Responde cinco preguntas y te damos una película.</h1>
                </div>
            </section>

            <section className="auth-panel">
                <div className={`auth-tabs ${isSignUp ? '' : 'is-right'}`} role="tablist" aria-label="Tipo de acceso">
                    <button type="button" role="tab" aria-selected={isSignUp} className={isSignUp ? 'is-active' : ''} onClick={() => switchTo('Sign Up')}>
                        Crear cuenta
                    </button>
                    <button type="button" role="tab" aria-selected={!isSignUp} className={!isSignUp ? 'is-active' : ''} onClick={() => switchTo('Login')}>
                        Iniciar sesión
                    </button>
                </div>

                <h2 className="auth-title" key={action}>{isSignUp ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h2>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {isSignUp && (
                        <Field icon={User} id="nombre" label="Nombre" type="text" value={nombre} onChange={setNombre} autoComplete="name" />
                    )}
                    <Field icon={Mail} id="email" label="Correo electrónico" type="email" value={email} onChange={setEmail} autoComplete="email" />
                    <Field icon={Lock} id="password" label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete={isSignUp ? 'new-password' : 'current-password'} />

                    {!isSignUp && (
                        <p className="auth-forgot">¿Olvidaste tu contraseña? <button type="button">Recupérala aquí</button></p>
                    )}

                    {feedback && (
                        <p className={`auth-feedback is-${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.text}</p>
                    )}

                    <button type="submit" className="btn btn-primary auth-submit">
                        {isSignUp ? 'Registrarme' : 'Entrar'}
                        <ArrowRight size={18} className="i-nudge" aria-hidden="true" />
                    </button>
                </form>
            </section>
        </div>
    );
}

function Field({ icon: Icon, id, label, type, value, onChange, autoComplete }) {
    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            <div className="field-control">
                <Icon size={18} aria-hidden="true" />
                <input id={id} type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
            </div>
        </div>
    );
}

export default Login;
