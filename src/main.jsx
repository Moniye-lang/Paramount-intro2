import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MenuPage from './components/MenuPage.jsx'

// Check whether the user is visiting the menu via path, hash, or query parameter
const isMenu = typeof window !== 'undefined' && (
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
