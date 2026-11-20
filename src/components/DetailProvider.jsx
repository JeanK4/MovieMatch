import React, { createContext, useCallback, useContext, useState } from 'react';
import MovieDetail from './MovieDetail';

const DetailContext = createContext(() => {});

export const useOpenDetail = () => useContext(DetailContext);

// Permite abrir la ficha de cualquier película o serie desde cualquier tarjeta.
function DetailProvider({ children }) {
    const [item, setItem] = useState(null);
    const open = useCallback((next) => setItem(next), []);

    return (
        <DetailContext.Provider value={open}>
            {children}
            {item && <MovieDetail key={item.id} item={item} onClose={() => setItem(null)} />}
        </DetailContext.Provider>
    );
}

export default DetailProvider;
