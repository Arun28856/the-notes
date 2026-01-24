import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";
import { BrowserRouter } from 'react-router'
import { Toaster } from 'react-hot-toast';

Sentry.init({
  dsn: "https://7c5275c8231f179abc4272fec840595a@o4510764003033088.ingest.us.sentry.io/4510764053037056",
  environment: process.env.NODE_ENV,
  release: "notes-app@1.0.0",
  tracesSampleRate: 1.0,

  beforeSend (event, hint) {
    if(event.user) {
      event.user.ip_address = null;
    }
    return event;
  },

  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection',
  ],
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
)
