import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'notes', element: <NotesUpload /> },
      { path: 'deck/:deckId', element: <StudyDeck /> },
      { path: 'flashcards/:deckId', element: <FlashcardMode /> },
      { path: 'quiz/:deckId', element: <QuizMode /> },
      { path: 'progress', element: <Progress /> },
      { path: 'profile', element: <Profile /> },
  { path: 'collab', element: <Collaboration /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}