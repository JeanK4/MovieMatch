import axios from '../axios';
import { API_KEY } from '../requests';

const THIS_YEAR = new Date().getFullYear();

/*
 * Cada respuesta aporta parámetros a /discover/movie de TMDB.
 * `relax` indica el orden en que soltamos filtros si no hay resultados.
 */
export const QUESTIONS = [
    {
        id: 'mood',
        step: 'Ánimo',
        title: '¿Qué te pide el cuerpo hoy?',
        options: [
            { value: 'reir', label: 'Reírme un rato', hint: 'Comedia', icon: 'Laugh', params: { with_genres: '35' }, reason: 'Querías reírte' },
            { value: 'adrenalina', label: 'Adrenalina', hint: 'Acción, aventura, suspenso', icon: 'Zap', params: { with_genres: '28|53|12' }, reason: 'Buscabas adrenalina' },
            { value: 'pensar', label: 'Algo que me deje pensando', hint: 'Drama, misterio', icon: 'Brain', params: { with_genres: '18|9648' }, reason: 'Querías algo que te hiciera pensar' },
            { value: 'romance', label: 'Ponerme romántico', hint: 'Romance', icon: 'Heart', params: { with_genres: '10749' }, reason: 'Tenías ganas de romance' },
            { value: 'miedo', label: 'Pasar miedo', hint: 'Terror', icon: 'Ghost', params: { with_genres: '27' }, reason: 'Querías pasar miedo' },
            { value: 'escapar', label: 'Escaparme a otro mundo', hint: 'Fantasía, ciencia ficción', icon: 'Rocket', params: { with_genres: '14|878' }, reason: 'Querías escaparte a otro mundo' },
        ],
    },
    {
        id: 'company',
        step: 'Compañía',
        title: '¿Con quién la vas a ver?',
        options: [
            { value: 'solo', label: 'Yo solo', hint: 'Sin filtros', icon: 'User', params: {}, reason: 'La ves por tu cuenta' },
            { value: 'pareja', label: 'En pareja', hint: 'Nada infantil', icon: 'HeartHandshake', params: { without_genres: '16,10751' }, reason: 'Es para ver en pareja' },
            { value: 'amigos', label: 'Con amigos', hint: 'Algo que todos conozcan', icon: 'Users', params: { 'vote_count.gte': 800 }, reason: 'Es para ver con amigos' },
            { value: 'familia', label: 'En familia', hint: 'Apta para todos', icon: 'House', params: { certification_country: 'US', 'certification.lte': 'PG', without_genres: '27' }, reason: 'Apta para ver en familia' },
        ],
    },
    {
        id: 'era',
        step: 'Época',
        title: '¿De qué época?',
        options: [
            { value: 'clasico', label: 'Clásicos', hint: 'Antes de 1980', icon: 'Clapperboard', params: { 'primary_release_date.lte': '1979-12-31' }, reason: 'Te gustan los clásicos' },
            { value: '8090', label: 'Años 80 y 90', hint: '1980 – 1999', icon: 'Disc3', params: { 'primary_release_date.gte': '1980-01-01', 'primary_release_date.lte': '1999-12-31' }, reason: 'Elegiste los 80 y 90' },
            { value: '2000', label: 'Dos mil', hint: '2000 – 2014', icon: 'Tv', params: { 'primary_release_date.gte': '2000-01-01', 'primary_release_date.lte': '2014-12-31' }, reason: 'Elegiste los dos mil' },
            { value: 'reciente', label: 'Recientes', hint: `2015 – ${THIS_YEAR}`, icon: 'Sparkles', params: { 'primary_release_date.gte': '2015-01-01' }, reason: 'Querías algo reciente' },
            { value: 'igual', label: 'Me da igual', hint: 'Cualquier año', icon: 'Shuffle', params: {}, reason: null },
        ],
    },
    {
        id: 'runtime',
        step: 'Duración',
        title: '¿Cuánto tiempo tienes?',
        options: [
            { value: 'corta', label: 'Poco', hint: 'Hasta 1 h 40 min', icon: 'Timer', params: { 'with_runtime.gte': 60, 'with_runtime.lte': 100 }, reason: 'Dura menos de 1 h 40 min' },
            { value: 'media', label: 'Lo normal', hint: '1 h 30 – 2 h 10', icon: 'Clock3', params: { 'with_runtime.gte': 90, 'with_runtime.lte': 130 }, reason: 'Tiene una duración estándar' },
            { value: 'larga', label: 'Toda la noche', hint: 'Más de 2 h 10', icon: 'Moon', params: { 'with_runtime.gte': 130 }, reason: 'Es para toda la noche' },
            { value: 'igual', label: 'Me da igual', hint: 'Cualquier duración', icon: 'Shuffle', params: { 'with_runtime.gte': 60 }, reason: null },
        ],
    },
    {
        id: 'fame',
        step: 'Fama',
        title: '¿Algo conocido o una sorpresa?',
        options: [
            { value: 'exito', label: 'Un éxito seguro', hint: 'Lo que todos vieron', icon: 'Trophy', params: { sort_by: 'popularity.desc', 'vote_count.gte': 1500 }, reason: 'Es un éxito popular' },
            { value: 'aclamada', label: 'Lo mejor valorado', hint: 'Nota alta, mucha gente', icon: 'Star', params: { sort_by: 'vote_average.desc', 'vote_count.gte': 2000 }, reason: 'Está entre las mejor valoradas' },
            { value: 'joya', label: 'Una joya escondida', hint: 'Buena nota, poco vista', icon: 'Gem', params: { sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'vote_count.lte': 1500, 'vote_average.gte': 7 }, reason: 'Es una joya poco conocida' },
        ],
    },
];

// Si no hay resultados, quitamos filtros en este orden.
const RELAX_ORDER = ['runtime', 'era', 'company', 'fame'];

const RELAX_NOTES = {
    runtime: 'la duración',
    era: 'la época',
    company: 'el filtro de compañía',
    fame: 'el nivel de fama',
};

function buildParams(answers, dropped) {
    const params = {
        api_key: API_KEY,
        language: 'es-MX',
        include_adult: false,
        include_video: false,
        sort_by: 'popularity.desc',
        'vote_count.gte': 100,
    };
    for (const q of QUESTIONS) {
        if (dropped.includes(q.id)) continue;
        const option = q.options.find((o) => o.value === answers[q.id]);
        if (!option) continue;
        for (const [key, value] of Object.entries(option.params)) {
            if (key === 'vote_count.gte') {
                params[key] = Math.max(params[key] ?? 0, value);
            } else if (key === 'without_genres' && params[key]) {
                params[key] = `${params[key]},${value}`;
            } else {
                params[key] = value;
            }
        }
    }
    return params;
}

const discover = (params) => axios.get('/discover/movie', { params }).then((r) => r.data);

const shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/**
 * Devuelve { pool, relaxed } donde pool son candidatas barajadas
 * y relaxed lista los filtros que tuvimos que soltar.
 */
export async function findCandidates(answers) {
    const dropped = [];
    let params = buildParams(answers, dropped);
    let first = await discover(params);

    for (const id of RELAX_ORDER) {
        if (first.total_results >= 4) break;
        dropped.push(id);
        params = buildParams(answers, dropped);
        first = await discover(params);
    }

    let results = first.results ?? [];
    const pages = Math.min(first.total_pages ?? 1, 5);
    if (pages > 1) {
        const page = 1 + Math.floor(Math.random() * pages);
        if (page !== 1) {
            const extra = await discover({ ...params, page });
            results = [...results, ...(extra.results ?? [])];
        }
    }

    const pool = shuffle(results.filter((m) => m.poster_path && m.overview));
    return { pool, relaxed: dropped.map((id) => RELAX_NOTES[id]) };
}

export async function getMovieDetails(id) {
    const { data } = await axios.get(`/movie/${id}`, {
        params: {
            api_key: API_KEY,
            language: 'es-MX',
            append_to_response: 'videos,credits',
            include_video_language: 'es,en',
        },
    });
    const videos = data.videos?.results ?? [];
    const trailer =
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'es') ||
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find((v) => v.site === 'YouTube');
    const director = data.credits?.crew?.find((c) => c.job === 'Director')?.name;
    const cast = (data.credits?.cast ?? []).slice(0, 3).map((c) => c.name);
    return { ...data, trailer, director, cast };
}

export function reasonsFor(answers) {
    return QUESTIONS.map((q) => q.options.find((o) => o.value === answers[q.id])?.reason).filter(Boolean);
}

export const formatRuntime = (min) => {
    if (!min) return null;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h} h ${m.toString().padStart(2, '0')} min` : `${m} min`;
};
