import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// ✅ CHANGEMENT ICI : On utilise BrowserRouter
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ CHANGEMENT ICI */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)