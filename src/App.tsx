import './App.css'
import { HashRouter } from 'react-router-dom';
import Toastify from './components/Toastify/Toastify';
import AppRoutes from './routes';
import { LoadingProvider } from './components/Loading/LoadingContext';
function App() {


  return (
    <LoadingProvider>
      <HashRouter>
        <Toastify />
        <AppRoutes />
      </HashRouter>
    </LoadingProvider>
  )
}

export default App