import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import * as Sentry from "@sentry/react";


Sentry.init({
  dsn: "https://802e5c5846e9b67a21165353d8669dac@o4510417435951104.ingest.us.sentry.io/4510417642586112",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <App />
    {/*Toast container */}
    <Toaster/>
  </StrictMode>,
)
