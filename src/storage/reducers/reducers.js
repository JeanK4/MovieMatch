import { combineReducers } from 'redux';
import favoritesReducer from './favoriteReducer'; // Define este archivo con tus reducers

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  // Otros reducers si los tienes
});

export default rootReducer;