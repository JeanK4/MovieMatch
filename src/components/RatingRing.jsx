import React from 'react';
import './RatingRing.css';

// Anillo de puntuación: se llena hasta la nota (sobre 10) con una animación.
function RatingRing({ value, votes, size = 64 }) {
    if (!value) return null;
    const pct = Math.round(value * 10);
    return (
        <div className="ring-wrap">
            <div
                className="ring"
                style={{ '--pct': pct, '--size': `${size}px` }}
                role="img"
                aria-label={`Puntuación ${value.toFixed(1)} de 10`}
            >
                <span className="ring-value">{value.toFixed(1)}</span>
            </div>
            {votes != null && (
                <span className="ring-votes">
                    <strong>Nota TMDB</strong>
                    {votes.toLocaleString('es-MX')} votos
                </span>
            )}
        </div>
    );
}

export default RatingRing;
