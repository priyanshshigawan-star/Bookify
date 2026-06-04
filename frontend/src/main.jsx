import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#161929',
              color: '#fff',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#c9a84c', secondary: '#161929' } },
            error: { iconTheme: { primary: '#c94c4c', secondary: '#161929' } },
          }}
        />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
)
