import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { App } from './app'

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </StrictMode>,
    )
}
