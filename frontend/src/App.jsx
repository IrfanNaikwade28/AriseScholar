import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import AuthProvider from './components/auth/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ToastProvider from './components/ui/Toast'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import NotesUpload from './pages/NotesUpload'
import StudyDeck from './pages/StudyDeck'
import FlashcardMode from './pages/FlashcardMode'
import QuizMode from './pages/QuizMode'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Collaboration from './pages/Collaboration'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'notes', element: <ProtectedRoute><NotesUpload /></ProtectedRoute> },
      { path: 'deck/:deckId', element: <ProtectedRoute><StudyDeck /></ProtectedRoute> },
      { path: 'flashcards/:deckId', element: <ProtectedRoute><FlashcardMode /></ProtectedRoute> },
      { path: 'quiz/:deckId', element: <ProtectedRoute><QuizMode /></ProtectedRoute> },
      { path: 'progress', element: <ProtectedRoute><Progress /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'collab', element: <ProtectedRoute><Collaboration /></ProtectedRoute> },
    ],
  },
])

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  )
}