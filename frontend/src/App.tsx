import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App
