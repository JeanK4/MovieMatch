export const API_KEY = "3ccfce9a00e722a51c150688478594f4"
const LANG = "language=es-MX"

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&${LANG}`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&${LANG}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&${LANG}`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&${LANG}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&${LANG}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&${LANG}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&${LANG}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&${LANG}&with_genres=99`,
}

export const searchUrl = (query) =>
    `/search/multi?api_key=${API_KEY}&${LANG}&include_adult=false&query=${encodeURIComponent(query)}`

export const posterUrl = (path, size = "w342") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null

export default requests;
