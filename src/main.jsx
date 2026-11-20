import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import App from './App.jsx'
import store from './storage/store.js'
import DetailProvider from './components/DetailProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <DetailProvider>
          <App/>
        </DetailProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
