import React, { useState } from 'react';
import { Link } from "react-router-dom"
import user_icon from '../assets/person.png'
import password_icon from '../assets/password.png'
import email_icon from '../assets/email.png'
import './Login.css'
import './Catalogo.css'

function Login() {
    const [action, setAction] = useState('Sign Up');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSignUpClick = () => {
        // Realiza validación aquí (por ejemplo, si los campos están vacíos o el correo electrónico es inválido)
        if (!nombre || !email || !password || !isValidEmail(email)) {
            setFeedbackMessage('Por favor, complete todos los campos correctamente.');
            return;
        }
        // Aquí puedes realizar la acción de cambio de página si quieres
        setAction('Login');
    }

    const isValidEmail = (email) => {
        // Implementa una lógica de validación de correo electrónico
        // Puedes usar expresiones regulares o bibliotecas de validación de correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return (
        <div className='Container'>
            <div className='content'>
                <div className='container'>
                    <header className='header'>
                        <h1 className="text">{action}</h1>
                        <div className="underline"></div>
                    </header>
                    <section className="inputs">
                        {action === "Login" ? null : (
                            <div className="input">
                                <img src={user_icon} alt="" />
                                <input type="text" placeholder="Nombre" value={nombre} onChange={handleNombreChange} />
                            </div>
                        )}
                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
                        </div>
                        {feedbackMessage && <p className="feedback">{feedbackMessage}</p>}
                    </section>
                    {action === "Sign Up" ? null : (
                        <div className="forgot-password">¿Has olvidado tu contraseña?<span>Haz click aquí!</span></div>
                    )}
                    <div className="submit-container">
                        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction('Sign Up')}>Sign Up</div>
                        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction('Login')}>Login</div><br></br>
                    </div>
                    <div className="submit-container">
                        {action === "Sign Up" ? (
                            <div className='submit' onClick={handleSignUpClick}>Registrar</div>
                        ) : (
                            <Link to="Catalogo" className="navlink"><div className='submit'>Iniciar sesión</div></Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
