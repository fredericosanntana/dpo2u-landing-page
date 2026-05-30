import './lib/polyfills' // 1º: Buffer global (necessário p/ @dpo2u/stellar-sdk no /verify)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './app/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
