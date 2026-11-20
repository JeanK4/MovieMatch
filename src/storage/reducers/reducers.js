import { combineReducers } from 'redux';
import favoritesReducer from './favoriteReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  user: authReducer,
});

export default rootReducer;
