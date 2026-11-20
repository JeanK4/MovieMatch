import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Search, X } from 'lucide-react';
import requests, { searchUrl } from '../requests';
import Row from '../components/Row';
import './Catalogo.css';

function Catalogo() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const [text, setText] = useState(urlQuery);
  const inputRef = useRef(null);
  const favorites = useSelector((state) => state.favorites);
  const user = useSelector((state) => state.user);
  const query = urlQuery.trim();

  // Busca mientras escribes, con una pequeña espera para no saturar la API.
  useEffect(() => {
    const id = setTimeout(() => {
      const q = text.trim();
      if (q === query) return;
      setParams(q ? { q } : {}, { replace: true });
    }, 350);
    return () => clearTimeout(id);
  }, [text, query, setParams]);

  const clear = () => {
    setText('');
    setParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="shell catalog">
      <header className="catalog-head">
        <div className="catalog-intro">
          <h1>{firstName ? <>Hola, <span className="catalog-name">{firstName}</span></> : 'Catálogo'}</h1>
          <p>Explora lo que se está viendo esta semana, lo mejor valorado y nuestras selecciones. Toca un póster para ver su ficha.</p>
        </div>
        <Link to="/Recomendaciones" className="btn btn-primary catalog-cta">
          ¿No sabes qué ver? Haz el test <ArrowRight size={18} className="i-nudge" aria-hidden="true" />
        </Link>
      </header>

      <form className="catalog-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <Search size={20} aria-hidden="true" className="catalog-search-icon" />
        <label htmlFor="catalog-search" className="visually-hidden">Buscar películas y series</label>
        <input
          ref={inputRef}
          id="catalog-search"
          type="search"
          placeholder="Buscar películas y series…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
        />
        {text && (
          <button type="button" className="catalog-search-clear" onClick={clear} aria-label="Borrar búsqueda">
            <X size={18} />
          </button>
        )}
      </form>

      {query ? (
        <div className="catalog-results" key={query}>
          <Row
            title={`Resultados para “${query}”`}
            fetchUrl={searchUrl(query)}
            emptyText="No encontramos nada con ese nombre. Prueba con otro título o revisa la ortografía."
          />
        </div>
      ) : (
        <>
          {favorites.length > 0 && <Row title="Tus favoritas" items={favorites} />}
          <Row title="Solo para ti" fetchUrl={requests.fetchNetflixOriginals} />
          <Row title="Tendencias" fetchUrl={requests.fetchTrending} />
          <Row title="Mejor valoradas" fetchUrl={requests.fetchTopRated} />
          <Row title="Recomendadas por Kevin" fetchUrl={requests.fetchComedyMovies} />
        </>
      )}
    </div>
  );
}

export default Catalogo;
