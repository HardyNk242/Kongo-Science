import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'

// Note : react-helmet-async a été retiré. Sous React 19, la version 2.0.5
// n'injecte plus rien dans le <head> — sans lever la moindre erreur, ce qui
// laissait toutes les pages partager le <title> de index.html.
// Les métadonnées sont désormais gérées par src/components/Seo.tsx.

// La barrière d'erreur enveloppe toute l'application : sans elle, une
// exception dans un seul composant vide entièrement la page.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
