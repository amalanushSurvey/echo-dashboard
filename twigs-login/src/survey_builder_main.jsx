import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SurveyBuilder from './SurveyBuilder.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SurveyBuilder />
  </StrictMode>,
)
