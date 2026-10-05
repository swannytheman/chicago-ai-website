import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import '@fontsource-variable/inter/opsz.css'
import './index.css'
import App from './App.jsx'
import { captureAttribution } from './attribution.js'
import { keepOnlyCampaignTags } from './analytics.js'

// Snapshot UTM tags before the router rewrites the URL.
captureAttribution()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics beforeSend={keepOnlyCampaignTags} />
  </StrictMode>,
)
