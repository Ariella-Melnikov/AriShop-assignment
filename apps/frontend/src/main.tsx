
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import App from './App'
import './assets/style/main.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  )