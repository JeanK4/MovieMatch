# Movie Match (m&m)

Recomendador de películas: responde un cuestionario corto sobre tu ánimo y preferencias y Movie Match te sugiere una película concreta, buscada en vivo en [TMDB](https://www.themoviedb.org/).

**Demo en vivo:** https://moviematch-dusky.vercel.app

## Funcionalidades

- **Recomendaciones personalizadas**: un cuestionario de pocas preguntas (ánimo, compañía, etc.) se traduce en filtros de TMDB y devuelve una película con el motivo de la sugerencia. Si no hay resultados, los filtros se relajan automáticamente.
- **Catálogo**: tendencias, mejor valoradas y filas por género, con búsqueda.
- **Detalle de película**: sinopsis, puntuación y más información en una vista ampliada.
- **Favoritos**: guarda las películas que te gustan.
- **Registro e inicio de sesión**: solo del lado del cliente (sin backend). La sesión y los favoritos se guardan en el `localStorage` del navegador.

## Tecnologías

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) para la navegación
- [Redux](https://redux.js.org/) para el estado (usuario y favoritos)
- [Axios](https://axios-http.com/) para consumir la API de TMDB
- [Lucide](https://lucide.dev/) para los iconos
- Desplegado en [Vercel](https://vercel.com/)

## Ejecutar en local

Requisitos: Node.js 18 o superior.

```bash
git clone https://github.com/JeanK4/MovieMatch.git
cd MovieMatch
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Otros scripts:

| Comando           | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run build`   | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint`    | Ejecuta ESLint                        |

## Estructura

```
src/
├── components/   # Navbar, Row, MovieCard, MovieDetail, RatingRing, Footer...
├── pages/        # Login, Catalogo, Recomendaciones, Page404
├── lib/          # recommend.js: preguntas del cuestionario y lógica de recomendación
├── storage/      # Store de Redux, reducers y acciones
├── requests.jsx  # Endpoints de TMDB
└── axios.jsx     # Cliente Axios con la URL base de TMDB
```

## Créditos

Este producto usa la API de TMDB, pero no está respaldado ni certificado por TMDB. Los datos e imágenes de las películas pertenecen a [The Movie Database](https://www.themoviedb.org/).
