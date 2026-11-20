# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Personas que quieren decidir rápido qué película ver. Llegan sin una idea clara y quieren una sugerencia concreta en vez de navegar catálogos infinitos. Producto pensado para lanzarse a usuarios reales.

## Product Purpose
Movie Match ("m&m") recomienda películas. Un cuestionario corto traduce el ánimo y las preferencias del usuario en una película concreta, buscada en vivo en TMDB. Un catálogo permite explorar tendencias y guardar favoritas. El éxito es que el usuario salga con una película elegida.

## Capabilities and Constraints
- React 18 + Vite, React Router, Redux (favoritos en memoria).
- Datos de películas: API de TMDB (`src/requests.jsx`, `src/axios.jsx`). Solo películas y series, no música.
- Rutas: `/` (registro/inicio de sesión, solo validación en cliente, sin backend), `/Catalogo`, `/Recomendaciones`, 404.
- No hay autenticación real ni persistencia; no afirmar lo contrario.

## Brand Commitments
- Nombre: Movie Match, marca corta "m&m".
- Paleta morada que el usuario pidió conservar: degradado #4E165D → #010002, acentos #54038a y #a11ef8, blanco y gris #EAEAEA.
- Fuente de marca: Grand Hotel.
- Idioma de la interfaz: español.

## Evidence on Hand
Sin testimonios, métricas ni prensa. No inventarlos. Los pósteres e imágenes vienen de TMDB (requiere atribución a TMDB).

## Product Principles
- Llevar a una decisión, no a más opciones.
- Pocas preguntas y fáciles de responder; el resultado tiene que sentirse personal.
- Los pósteres de las películas son el contenido protagonista; la interfaz los enmarca.
