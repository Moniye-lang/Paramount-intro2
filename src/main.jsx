import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MenuPage from './components/MenuPage.jsx'

// If navigated to /menu or #menu or query, display the Menu Page; otherwise render the main landing page (App)
const isMenu = typeof window !== 'undefined' && (
  window.location.pathname.startsWith('/menu') ||
  window.location.pathname.toLowerCase().includes('/menu') ||
  window.location.pathname.toLowerCase().endsWith('menu') ||
  window.location.hash.toLowerCase().includes('menu') ||
  window.location.search.toLowerCase().includes('menu')
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isMenu ? <MenuPage /> : <App />}
  </StrictMode>,
)
