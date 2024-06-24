import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { InnerApp } from './inner-app'
import { queryClient } from './lib/queryClient'
import { createIDBPersister } from './lib/persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Provider as JotaiProvider } from 'jotai'
import store from './store'

// Create Persister
const persister = createIDBPersister()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PersistQueryClientProvider
            persistOptions={{ persister }}
            client={queryClient}
        >
            <JotaiProvider store={store}>
                <InnerApp />
            </JotaiProvider>
        </PersistQueryClientProvider>
    </React.StrictMode>,
)
