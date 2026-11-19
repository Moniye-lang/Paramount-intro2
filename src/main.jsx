import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MenuPage from './components/MenuPage.jsx'

// If navigated to /menu or #menu, display the Menu Page; otherwise render the main landing page (App)
const isMenu = typeof window !== 'undefined' && (
  window.location.pathname.startsWith('/menu') ||
  window.location.hash === '#menu'
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isMenu ? <MenuPage /> : <App />}
  </StrictMode>,
)
