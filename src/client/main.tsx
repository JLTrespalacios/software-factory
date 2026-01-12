import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { FactoryAssemblyLine } from './components/FactoryAssemblyLine'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <FactoryAssemblyLine />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
