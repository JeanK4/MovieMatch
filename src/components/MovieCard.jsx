import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Film, Info } from 'lucide-react';
import { addToFavorites, removeFromFavorites } from '../storage/reducers/actions';
import { posterUrl } from '../requests';
import { useOpenDetail } from './DetailProvider';
import './MovieCard.css';

export const titleOf = (m) => m?.title || m?.name || m?.original_name || 'Sin título';
export const yearOf = (m) => (m?.release_date || m?.first_air_date || '').slice(0, 4);

function MovieCard({ movie, index = 0 }) {
    const dispatch = useDispatch();
    const openDetail = useOpenDetail();
    const isFavorite = useSelector((state) => state.favorites.some((f) => f.id === movie.id));
    const [pop, setPop] = useState(false);
    const src = posterUrl(movie.poster_path);
    const title = titleOf(movie);
    const year = yearOf(movie);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

    const toggle = () => {
        if (!isFavorite) setPop(true);
        dispatch(isFavorite ? removeFromFavorites(movie) : addToFavorites(movie));
    };

    return (
        <article className="card" style={{ '--i': Math.min(index, 8) }}>
            <button type="button" className="card-open" onClick={() => openDetail(movie)} aria-label={`Ver ficha de ${title}`}>
                <div className="card-poster">
                    {src ? (
                        <img src={src} alt="" loading="lazy" />
                    ) : (
                        <div className="card-fallback"><Film size={28} aria-hidden="true" /></div>
                    )}
                    <span className="card-hover" aria-hidden="true">
                        <Info size={16} /> Ver ficha
                    </span>
                </div>
                <span className="card-title">{title}</span>
                <span className="card-meta">
                    {year && <span>{year}</span>}
                    {rating && rating !== '0.0' && (
                        <span className="card-rating"><Star size={13} fill="currentColor" aria-hidden="true" />{rating}</span>
                    )}
                </span>
            </button>
            <button
                type="button"
                className={`card-fav ${isFavorite ? 'is-on' : ''} ${pop ? 'is-fav-pop' : ''}`}
                onClick={toggle}
                onAnimationEnd={() => setPop(false)}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? `Quitar ${title} de favoritas` : `Guardar ${title} en favoritas`}
            >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
        </article>
    );
}

export default MovieCard;
