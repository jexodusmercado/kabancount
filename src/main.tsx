import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { InnerApp } from './inner-app'
import { queryClient } from './lib/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import store from './store'
import { QueryClientProvider } from '@tanstack/react-query'

// Create Persister
// const persister = createIDBPersister()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <JotaiProvider store={store}>
                <ReactQueryDevtools initialIsOpen={false} />
                <InnerApp />
            </JotaiProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
