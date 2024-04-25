import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axios';
import { addToFavorites, removeFromFavorites } from '../storage/reducers/actions'; // Importa las acciones necesarias
import './Row.css';

const baseURL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, horizontal }) {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites);

    const handleToggleFavorite = (movie) => {
        if (favorites.some(favorite => favorite.id === movie.id)) {
            dispatch(removeFromFavorites(movie));
        } else {
            dispatch(addToFavorites(movie));
        }
    };

    return (
        <div className='row'>
            <h2>{title}</h2>
            <div className='posters'>
                {movies.map(movie => (
                    <div className='aspect-ratio' key={movie.id}>
                        <div className="poster-container">
                            <img
                                className={`poster ${horizontal && 'posterH'}`}
                                src={horizontal ? `${baseURL}${movie.poster_path}` : `${baseURL}${movie.backdrop_path}`}
                                alt={movie.name}
                            />
                            <div className="favorite-icon" onClick={() => handleToggleFavorite(movie)}>
                                {favorites.some(favorite => favorite.id === movie.id) ? (
                                    <span role="img" aria-label="Heart">❤️</span>
                                ) : (
                                    <span role="img" aria-label="Heart">🖤</span>
                                )}
                            </div>
                        </div>
                        <h1 className='Nombres'>{movie?.title || movie?.name || movie?.original_name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Row;
