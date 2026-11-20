import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft, ArrowRight, Heart, Play, RefreshCw, RotateCcw, Star, X,
    Laugh, Zap, Brain, Ghost, Rocket, User, HeartHandshake, Users, House,
    Clapperboard, Disc3, Tv, Sparkles, Shuffle, Timer, Clock3, Moon, Trophy, Gem, Circle,
} from 'lucide-react';
import { addToFavorites, removeFromFavorites } from '../storage/reducers/actions';
import { posterUrl } from '../requests';
import MovieCard from '../components/MovieCard';
import RatingRing from '../components/RatingRing';
import { QUESTIONS, findCandidates, getMovieDetails, reasonsFor, formatRuntime } from '../lib/recommend';
import './Recomendaciones.css'

const TOTAL = QUESTIONS.length;

const OPTION_ICONS = {
    Laugh, Zap, Brain, Heart, Ghost, Rocket, User, HeartHandshake, Users, House,
    Clapperboard, Disc3, Tv, Sparkles, Shuffle, Timer, Clock3, Moon, Trophy, Star, Gem,
};

function Recomendaciones() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [phase, setPhase] = useState('quiz'); // quiz | loading | result | error
    const [pool, setPool] = useState([]);
    const [index, setIndex] = useState(0);
    const [movie, setMovie] = useState(null);
    const [relaxed, setRelaxed] = useState([]);
    const [direction, setDirection] = useState(1);
    const advanceTimer = useRef(null);

    useEffect(() => () => clearTimeout(advanceTimer.current), []);

    const question = QUESTIONS[step];
    const selected = question ? answers[question.id] : null;

    const reveal = useCallback(async (list, at) => {
        setPhase('loading');
        try {
            const details = await getMovieDetails(list[at].id);
            setMovie(details);
            setIndex(at);
            setPhase('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
            setPhase('error');
        }
    }, []);

    const generate = useCallback(async (finalAnswers) => {
        setPhase('loading');
        try {
            const { pool: found, relaxed: dropped } = await findCandidates(finalAnswers);
            if (!found.length) {
                setPool([]);
                setPhase('error');
                return;
            }
            setPool(found);
            setRelaxed(dropped);
            await reveal(found, 0);
        } catch {
            setPhase('error');
        }
    }, [reveal]);

    const goNext = (nextAnswers = answers) => {
        clearTimeout(advanceTimer.current);
        if (!nextAnswers[question.id]) return;
        setDirection(1);
        if (step === TOTAL - 1) {
            generate(nextAnswers);
        } else {
            setStep(step + 1);
        }
    };

    const goBack = () => {
        clearTimeout(advanceTimer.current);
        setDirection(-1);
        setStep((s) => Math.max(0, s - 1));
    };

    const choose = (value) => {
        setAnswers((prev) => ({ ...prev, [question.id]: value }));
    };

    // Con ratón o dedo, elegir una opción avanza solo; con teclado se usa "Siguiente".
    const chooseAndAdvance = (value) => {
        const next = { ...answers, [question.id]: value };
        setAnswers(next);
        clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => goNext(next), 260);
    };

    const restart = () => {
        setAnswers({});
        setStep(0);
        setMovie(null);
        setPool([]);
        setDirection(-1);
        setPhase('quiz');
    };

    const another = () => {
        if (pool.length < 2) return;
        reveal(pool, (index + 1) % pool.length);
    };

    const frame = phase === 'quiz' ? step : TOTAL;

    return (
        <div className="shell quiz-page">
            <header className="quiz-head">
                <h1>Encuentra tu película</h1>
                <p>Cinco preguntas rápidas. Al final buscamos en TMDB la película que mejor encaja contigo.</p>
            </header>

            <FilmStrip frame={frame} answers={answers} running={phase === 'loading'} />

            {phase === 'quiz' && (
                <section className="quiz-card" aria-labelledby="quiz-q">
                    <div key={step} className={`quiz-frame ${direction > 0 ? 'from-right' : 'from-left'}`}>
                        <p className="label quiz-guide">Fotograma {step + 1} de {TOTAL} · {question.step}</p>
                        <h2 id="quiz-q" className="quiz-question">{question.title}</h2>

                        <div className={`quiz-options count-${question.options.length}`} role="radiogroup" aria-labelledby="quiz-q">
                            {question.options.map((opt) => {
                                const Icon = OPTION_ICONS[opt.icon] ?? Circle;
                                const isOn = selected === opt.value;
                                return (
                                    <label key={opt.value} className={`quiz-option ${isOn ? 'is-on' : ''}`} onPointerUp={() => chooseAndAdvance(opt.value)}>
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={opt.value}
                                            checked={isOn}
                                            onChange={() => choose(opt.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && goNext({ ...answers, [question.id]: opt.value })}
                                            className="visually-hidden"
                                        />
                                        <Icon size={24} aria-hidden="true" className="quiz-option-icon" />
                                        <span className="quiz-option-label">{opt.label}</span>
                                        <span className="quiz-option-hint">{opt.hint}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="quiz-nav">
                        <button type="button" className="btn btn-ghost" onClick={goBack} disabled={step === 0}>
                            <ArrowLeft size={18} className="i-back" aria-hidden="true" /> Atrás
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => goNext()} disabled={!selected}>
                            {step === TOTAL - 1 ? 'Revelar mi película' : 'Siguiente'} <ArrowRight size={18} className="i-nudge" aria-hidden="true" />
                        </button>
                    </div>
                </section>
            )}

            {phase === 'loading' && (
                <section className="quiz-card quiz-status" aria-live="polite">
                    <p className="quiz-status-title">Revelando tu película…</p>
                    <p className="quiz-status-text">Buscando entre miles de títulos de TMDB.</p>
                </section>
            )}

            {phase === 'error' && (
                <section className="quiz-card quiz-status" role="alert">
                    <p className="quiz-status-title">{pool.length ? 'No pudimos cargar la película' : 'No encontramos ninguna película'}</p>
                    <p className="quiz-status-text">
                        {pool.length
                            ? 'Revisa tu conexión e inténtalo otra vez.'
                            : 'Ninguna película cumple esa combinación. Prueba con otras respuestas.'}
                    </p>
                    <div className="quiz-nav is-center">
                        {pool.length > 0 && (
                            <button type="button" className="btn btn-primary" onClick={() => reveal(pool, index)}>
                                <RefreshCw size={18} className="i-spin" aria-hidden="true" /> Reintentar
                            </button>
                        )}
                        <button type="button" className="btn btn-ghost" onClick={restart}>
                            <RotateCcw size={18} className="i-rewind" aria-hidden="true" /> Empezar de nuevo
                        </button>
                    </div>
                </section>
            )}

            {phase === 'result' && movie && (
                <Result
                    movie={movie}
                    answers={answers}
                    relaxed={relaxed}
                    alternatives={pool.filter((_, i) => i !== index).slice(0, 4)}
                    canReroll={pool.length > 1}
                    onAnother={another}
                    onRestart={restart}
                />
            )}
        </div>
    );
}

function FilmStrip({ frame, answers, running }) {
    const frames = [...QUESTIONS.map((q) => q.step), 'Tu película'];
    return (
        <ol className={`strip ${running ? 'is-running' : ''}`} style={{ '--frame': frame }} aria-label="Progreso del cuestionario">
            {frames.map((name, i) => {
                const q = QUESTIONS[i];
                const answer = q && q.options.find((o) => o.value === answers[q.id]);
                const state = i < frame ? 'done' : i === frame ? 'current' : 'next';
                return (
                    <li key={name} className={`strip-frame is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                        <span className="strip-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="strip-name">{name}</span>
                        <span className="strip-answer">{state === 'done' && answer ? answer.label : ''}</span>
                    </li>
                );
            })}
        </ol>
    );
}

function Result({ movie, answers, relaxed, alternatives, canReroll, onAnother, onRestart }) {
    const dispatch = useDispatch();
    const isFavorite = useSelector((state) => state.favorites.some((f) => f.id === movie.id));
    const [playing, setPlaying] = useState(false);
    const [pop, setPop] = useState(false);
    const posterRef = useRef(null);
    const year = movie.release_date?.slice(0, 4);
    const runtime = formatRuntime(movie.runtime);
    const reasons = reasonsFor(answers);
    const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null;

    useEffect(() => setPlaying(false), [movie.id]);

    const toggleFavorite = () => {
        if (!isFavorite) setPop(true);
        dispatch(isFavorite ? removeFromFavorites(movie) : addToFavorites(movie));
    };

    // Inclinación 3D del póster siguiendo el cursor.
    const tilt = (e) => {
        const el = posterRef.current;
        if (!el || e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`);
        el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(0)}%`);
    };
    const resetTilt = () => {
        const el = posterRef.current;
        if (!el) return;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
    };

    return (
        <section className="result" aria-labelledby="result-title">
            <div className="result-stage" key={movie.id}>
                {backdrop && <img className="result-backdrop" src={backdrop} alt="" aria-hidden="true" />}
                <div className="result-leak" aria-hidden="true" />

                <div className="result-main">
                    <div className="result-poster-wrap" onPointerMove={tilt} onPointerLeave={resetTilt}>
                        <div className="result-poster" ref={posterRef}>
                            <img src={posterUrl(movie.poster_path, 'w500')} alt={`Póster de ${movie.title}`} />
                            <span className="result-glare" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="result-body">
                        <p className="result-kicker">Tu película para hoy</p>
                        <h2 id="result-title" className="result-title">{movie.title}</h2>
                        {movie.tagline && <p className="result-tagline">“{movie.tagline}”</p>}

                        <div className="result-facts">
                            <RatingRing value={movie.vote_average} votes={movie.vote_count} size={72} />
                            <ul className="result-meta">
                                {year && <li>{year}</li>}
                                {runtime && <li>{runtime}</li>}
                            </ul>
                        </div>

                        {movie.genres?.length > 0 && (
                            <ul className="result-genres">
                                {movie.genres.map((g, i) => <li key={g.id} style={{ '--i': i }}>{g.name}</li>)}
                            </ul>
                        )}

                        <p className="result-overview">{movie.overview}</p>

                        {(movie.director || movie.cast?.length > 0) && (
                            <dl className="result-credits">
                                {movie.director && (<><dt>Dirección</dt><dd>{movie.director}</dd></>)}
                                {movie.cast?.length > 0 && (<><dt>Reparto</dt><dd>{movie.cast.join(', ')}</dd></>)}
                            </dl>
                        )}

                        <div className="result-actions">
                            {movie.trailer && (
                                <button type="button" className="btn btn-gold" onClick={() => setPlaying(true)}>
                                    <Play size={18} fill="currentColor" className="i-pop" aria-hidden="true" /> Ver tráiler
                                </button>
                            )}
                            <button
                                type="button"
                                className={`btn btn-ghost ${isFavorite ? 'is-fav' : ''} ${pop ? 'is-fav-pop' : ''}`}
                                onClick={toggleFavorite}
                                onAnimationEnd={() => setPop(false)}
                                aria-pressed={isFavorite}
                            >
                                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className="i-pop" aria-hidden="true" />
                                {isFavorite ? 'En favoritas' : 'Guardar'}
                            </button>
                            {canReroll && (
                                <button type="button" className="btn btn-ghost" onClick={onAnother}>
                                    <RefreshCw size={18} className="i-spin" aria-hidden="true" /> Otra opción
                                </button>
                            )}
                            <button type="button" className="btn btn-ghost" onClick={onRestart}>
                                <RotateCcw size={18} className="i-rewind" aria-hidden="true" /> Repetir test
                            </button>
                        </div>
                    </div>
                </div>

                {playing && movie.trailer && (
                    <div className="result-trailer">
                        <button type="button" className="result-trailer-close" onClick={() => setPlaying(false)} aria-label="Cerrar tráiler">
                            <X size={22} />
                        </button>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${movie.trailer.key}?autoplay=1&rel=0`}
                            title={`Tráiler de ${movie.title}`}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>

            <div className="result-why">
                <p className="label">Por qué esta película</p>
                <ul>
                    {reasons.map((r, i) => <li key={r} style={{ '--i': i }}>{r}</li>)}
                </ul>
                {relaxed.length > 0 && (
                    <p className="result-relaxed">
                        No había suficientes coincidencias exactas, así que flexibilizamos {relaxed.join(' y ')}.
                    </p>
                )}
            </div>

            {alternatives.length > 0 && (
                <div className="result-alts">
                    <h3>Si no te convence, prueba con</h3>
                    <div className="result-alts-grid">
                        {alternatives.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
                    </div>
                </div>
            )}
        </section>
    );
}

export default Recomendaciones;
