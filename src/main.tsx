import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Note : react-helmet-async a été retiré. Sous React 19, la version 2.0.5
// n'injecte plus rien dans le <head> — sans lever la moindre erreur, ce qui
// laissait toutes les pages partager le <title> de index.html.
// Les métadonnées sont désormais gérées par src/components/Seo.tsx.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
