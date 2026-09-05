import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { PropertyListPage } from './pages/PropertyListPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertyListPage />
            </ProtectedRoute>
          }
        />
        {/* それ以外のパスは物件一覧へ（未ログインならログイン画面にリダイレクトされる） */}
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
