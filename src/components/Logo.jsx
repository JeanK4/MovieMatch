import React, { useId } from 'react';
import './Logo.css';

/**
 * Símbolo de Movie Match: un carrete de película (cine) cuyo centro es un
 * corazón dorado (el "match"). La cinta que sale del carrete le da movimiento.
 */
function Logo({ size = 44, className = '', title = 'Movie Match' }) {
    const id = useId().replace(/:/g, '');
    const holes = [0, 72, 144, 216, 288];

    return (
        <svg
            className={`logo ${className}`}
            width={size}
            height={size}
            viewBox="0 0 48 48"
            role="img"
            aria-label={title}
        >
            <defs>
                <linearGradient id={`reel-${id}`} x1="6" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#d3a6ff" />
                    <stop offset="0.45" stopColor="#9b45f5" />
                    <stop offset="1" stopColor="#5b16b8" />
                </linearGradient>
                <linearGradient id={`tape-${id}`} x1="30" y1="40" x2="48" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#5b16b8" />
                    <stop offset="1" stopColor="#7c2ae8" />
                </linearGradient>
                <radialGradient id={`heart-${id}`} cx="20" cy="20" r="11" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffe08a" />
                    <stop offset="1" stopColor="#ffb02e" />
                </radialGradient>
            </defs>

            {/* Cinta que se desenrolla */}
            <path className="logo-tape" d="M30 41.5 H46 a1.5 1.5 0 0 0 1.5 -1.5 V35.5 H33" fill={`url(#tape-${id})`} />
            <g className="logo-tape-holes" fill="#12061a">
                <rect x="36" y="37.2" width="2.2" height="2.2" rx="0.5" />
                <rect x="40.4" y="37.2" width="2.2" height="2.2" rx="0.5" />
            </g>

            {/* Carrete */}
            <g className="logo-reel">
                <circle cx="22" cy="22" r="20" fill={`url(#reel-${id})`} />
                <circle cx="22" cy="22" r="20" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
                {holes.map((deg) => {
                    const r = (deg - 90) * (Math.PI / 180);
                    return <circle key={deg} cx={22 + 13.4 * Math.cos(r)} cy={22 + 13.4 * Math.sin(r)} r="3.2" fill="#12061a" />;
                })}
            </g>

            {/* Corazón: el match */}
            <path
                className="logo-heart"
                d="M22 29.4 C15 25 16 17 19.8 17 C21 17 21.6 17.7 22 18.6 C22.4 17.7 23 17 24.2 17 C28 17 29 25 22 29.4 Z"
                fill={`url(#heart-${id})`}
            />
        </svg>
    );
}

export default Logo;
