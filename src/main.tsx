import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { HubProvider } from './data/HubProvider.tsx'
import { I18nProvider } from './lib/i18n.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <HubProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HubProvider>
    </I18nProvider>
  </StrictMode>,
)
