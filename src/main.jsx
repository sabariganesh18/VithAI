import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// Clean any stale error search query parameters from URL on boot
if (typeof window !== 'undefined' && window.location.search.includes('error=')) {
  try {
    window.history.replaceState(null, document.title, window.location.pathname);
  } catch (e) {}
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
