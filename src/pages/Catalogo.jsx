import React from 'react';
import requests from '../requests';
import Row from '../components/Row';
import './Catalogo.css';

function Catalogo() {
  return (
    <>
      <main>
        <section className="Container">
          <div className="content">
            <Row title="Solo para ti" fetchUrl={requests.fetchNetflixOriginals} horizontal />
            <Row title="Tendencias" fetchUrl={requests.fetchTrending} horizontal />
            <Row title="Top Rated" fetchUrl={requests.fetchTopRated} horizontal />
            <Row title="Recomendadas por Kevin" fetchUrl={requests.fetchComedyMovies} horizontal />
          </div>
        </section>
      </main>
    </>
  );
}

export default Catalogo;
