import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Play, Heart, Calendar, Clock, Tv, Film } from 'lucide-react';
import axios from '../axios';
import { API_KEY, posterUrl } from '../requests';
import { addToFavorites, removeFromFavorites } from '../storage/reducers/actions';
import { formatRuntime } from '../lib/recommend';
import RatingRing from './RatingRing';
import './MovieDetail.css';

async function fetchDetail(id, type) {
    const { data } = await axios.get(`/${type}/${id}`, {
        params: {
            api_key: API_KEY,
            language: 'es-MX',
            append_to_response: 'videos,credits,watch/providers',
            include_video_language: 'es,en',
        },
    });
    const videos = data.videos?.results ?? [];
    const trailer =
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'es') ||
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find((v) => v.site === 'YouTube');
    const crew = data.credits?.crew ?? [];
    const directors = type === 'tv'
        ? (data.created_by ?? []).map((c) => c.name)
        : crew.filter((c) => c.job === 'Director').map((c) => c.name);
    const providers = data['watch/providers']?.results?.MX;
    return {
        ...data,
        type,
        trailer,
        directors,
        cast: (data.credits?.cast ?? []).slice(0, 8),
        stream: providers?.flatrate ?? [],
        providersLink: providers?.link,
    };
}

/**
 * Ficha de una película o serie. `item` es el resultado de la lista (con id);
 * se abre como diálogo modal y carga el detalle completo de TMDB.
 */
function MovieDetail({ item, onClose }) {
    const dialogRef = useRef(null);
    const [detail, setDetail] = useState(null);
    const [status, setStatus] = useState('loading');
    const [playing, setPlaying] = useState(false);
    const [closing, setClosing] = useState(false);
    const [pop, setPop] = useState(false);
    const dispatch = useDispatch();
    const isFavorite = useSelector((state) => state.favorites.some((f) => f.id === item.id));

    const type = item.media_type === 'tv' || (!item.title && item.name) ? 'tv' : 'movie';

    useEffect(() => {
        dialogRef.current?.showModal();
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        setPlaying(false);
        fetchDetail(item.id, type)
            .then((d) => { if (!cancelled) { setDetail(d); setStatus('ready'); } })
            .catch(() => !cancelled && setStatus('error'));
        return () => { cancelled = true; };
    }, [item.id, type]);

    const close = () => {
        setClosing(true);
        setTimeout(() => {
            dialogRef.current?.close();
            onClose();
        }, 220);
    };

    const toggleFavorite = () => {
        if (!isFavorite) setPop(true);
        dispatch(isFavorite ? removeFromFavorites(item) : addToFavorites(item));
    };

    const d = detail ?? item;
    const title = d.title || d.name;
    const year = (d.release_date || d.first_air_date || '').slice(0, 4);
    const runtime = type === 'movie' ? formatRuntime(d.runtime) : null;
    const seasons = type === 'tv' && d.number_of_seasons
        ? `${d.number_of_seasons} ${d.number_of_seasons === 1 ? 'temporada' : 'temporadas'}`
        : null;
    const backdrop = d.backdrop_path ? `https://image.tmdb.org/t/p/w1280${d.backdrop_path}` : null;

    return (
        <dialog
            ref={dialogRef}
            className={`detail ${closing ? 'is-closing' : ''}`}
            aria-labelledby="detail-title"
            onCancel={(e) => { e.preventDefault(); close(); }}
            onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        >
            <div className="detail-panel">
                <button type="button" className="detail-close" onClick={close} aria-label="Cerrar ficha">
                    <X size={22} />
                </button>

                <div className="detail-hero">
                    {playing && detail?.trailer ? (
                        <iframe
                            className="detail-video"
                            src={`https://www.youtube-nocookie.com/embed/${detail.trailer.key}?autoplay=1&rel=0`}
                            title={`Tráiler de ${title}`}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    ) : (
                        backdrop && <img className="detail-backdrop" src={backdrop} alt="" />
                    )}
                </div>

                <div className="detail-content">
                    <div className="detail-poster">
                        {d.poster_path
                            ? <img src={posterUrl(d.poster_path, 'w342')} alt={`Póster de ${title}`} />
                            : <div className="detail-poster-fallback"><Film size={32} aria-hidden="true" /></div>}
                    </div>

                    <div className="detail-main">
                        <p className="label detail-kind">{type === 'tv' ? 'Serie' : 'Película'}</p>
                        <h2 id="detail-title" className="detail-title">{title}</h2>
                        {detail?.tagline && <p className="detail-tagline">“{detail.tagline}”</p>}

                        <ul className="detail-meta">
                            {year && <li><Calendar size={15} aria-hidden="true" />{year}</li>}
                            {runtime && <li><Clock size={15} aria-hidden="true" />{runtime}</li>}
                            {seasons && <li><Tv size={15} aria-hidden="true" />{seasons}</li>}
                        </ul>

                        <div className="detail-rating-row">
                            <RatingRing value={d.vote_average} votes={d.vote_count} />
                            <div className="detail-actions">
                                {detail?.trailer && !playing && (
                                    <button type="button" className="btn btn-primary" onClick={() => setPlaying(true)}>
                                        <Play size={18} fill="currentColor" className="i-pop" aria-hidden="true" /> Ver tráiler
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className={`btn btn-ghost detail-fav ${isFavorite ? 'is-fav' : ''} ${pop ? 'is-fav-pop' : ''}`}
                                    onClick={toggleFavorite}
                                    onAnimationEnd={() => setPop(false)}
                                    aria-pressed={isFavorite}
                                >
                                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className="i-pop" aria-hidden="true" />
                                    {isFavorite ? 'En favoritas' : 'Guardar'}
                                </button>
                            </div>
                        </div>

                        {detail?.genres?.length > 0 && (
                            <ul className="detail-genres">
                                {detail.genres.map((g) => <li key={g.id}>{g.name}</li>)}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="detail-body">
                    {status === 'error' && (
                        <p className="detail-error">No pudimos cargar toda la información. Revisa tu conexión e inténtalo de nuevo.</p>
                    )}

                    <section>
                        <h3 className="label">Sinopsis</h3>
                        <p className="detail-overview">
                            {d.overview || 'Todavía no hay sinopsis en español para este título.'}
                        </p>
                    </section>

                    {detail?.directors?.length > 0 && (
                        <section>
                            <h3 className="label">{type === 'tv' ? 'Creada por' : 'Dirección'}</h3>
                            <p>{detail.directors.join(', ')}</p>
                        </section>
                    )}

                    {detail?.stream?.length > 0 && (
                        <section>
                            <h3 className="label">Dónde verla en México</h3>
                            <ul className="detail-providers">
                                {detail.stream.map((p) => (
                                    <li key={p.provider_id} title={p.provider_name}>
                                        <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} />
                                    </li>
                                ))}
                            </ul>
                            <p className="detail-credit">Disponibilidad según JustWatch.</p>
                        </section>
                    )}

                    {detail?.cast?.length > 0 && (
                        <section>
                            <h3 className="label">Reparto</h3>
                            <ul className="detail-cast">
                                {detail.cast.map((c) => (
                                    <li key={c.credit_id ?? c.id}>
                                        {c.profile_path
                                            ? <img src={`https://image.tmdb.org/t/p/w185${c.profile_path}`} alt="" loading="lazy" />
                                            : <span className="detail-cast-fallback" aria-hidden="true">{c.name[0]}</span>}
                                        <span className="detail-cast-name">{c.name}</span>
                                        {c.character && <span className="detail-cast-role">{c.character}</span>}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {status === 'loading' && <div className="detail-loading" aria-label="Cargando información" />}
                </div>
            </div>
        </dialog>
    );
}

export default MovieDetail;
