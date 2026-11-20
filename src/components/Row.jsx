import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from '../axios';
import MovieCard from './MovieCard';
import './Row.css';

function Row({ title, fetchUrl, items, emptyText }) {
    const [movies, setMovies] = useState(items ?? []);
    const [status, setStatus] = useState(items ? 'ready' : 'loading');
    const trackRef = useRef(null);

    useEffect(() => {
        if (items) {
            setMovies(items);
            setStatus('ready');
            return;
        }
        let cancelled = false;
        setStatus('loading');
        axios.get(fetchUrl)
            .then((res) => {
                if (cancelled) return;
                setMovies((res.data.results ?? []).filter((r) => r.media_type !== 'person'));
                setStatus('ready');
            })
            .catch(() => !cancelled && setStatus('error'));
        return () => { cancelled = true; };
    }, [fetchUrl, items]);

    const scroll = (dir) => {
        const el = trackRef.current;
        if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
    };

    if (status === 'ready' && movies.length === 0 && !emptyText) return null;

    return (
        <section className="row" aria-label={title}>
            <div className="row-head">
                <h2>{title}</h2>
                <div className="row-arrows">
                    <button type="button" onClick={() => scroll(-1)} aria-label={`Desplazar ${title} a la izquierda`}><ChevronLeft size={20} /></button>
                    <button type="button" onClick={() => scroll(1)} aria-label={`Desplazar ${title} a la derecha`}><ChevronRight size={20} /></button>
                </div>
            </div>

            {status === 'error' ? (
                <p className="row-error">No pudimos cargar esta fila. Revisa tu conexión y recarga la página.</p>
            ) : status === 'ready' && movies.length === 0 ? (
                <p className="row-error">{emptyText}</p>
            ) : (
                <div className="row-track" ref={trackRef}>
                    {status === 'loading'
                        ? Array.from({ length: 8 }, (_, i) => <div className="row-skeleton" key={i} />)
                        : movies.map((movie, i) => <MovieCard movie={movie} index={i} key={`${movie.media_type ?? ""}${movie.id}`} />)}
                </div>
            )}
        </section>
    );
}

export default Row;
