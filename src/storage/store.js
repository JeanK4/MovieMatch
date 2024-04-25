// store.js
import { createStore } from 'redux';
import rootReducer from './reducers/reducers'; // Define este archivo con tus reducers

const store = createStore(rootReducer);

export default store;