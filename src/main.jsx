import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./utils/globalNumberFormat";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ReferenceProvider } from './context/ReferenceContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReferenceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReferenceProvider>
    </AuthProvider>
  </StrictMode>,
)
