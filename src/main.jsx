import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from '../src/ReduxSlice/store.js'; // adjust path if needed
import { GlobalProvider } from "./context.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>

      <BrowserRouter>
        <Provider store={store}>

          <App />
        </Provider>
      </BrowserRouter>
    </GlobalProvider>

  </StrictMode>,
)
