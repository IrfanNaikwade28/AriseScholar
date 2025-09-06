import { NavLink } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function LandingPage() {
  return (
    <div className="text-center">
  <section className="rounded-3xl bg-gradient-to-br from-secondary-500 via-info-500 to-success-500 text-white p-10 shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold">Study Smarter, Rise Higher.</h1>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">AriseScholar is your AI-powered, gamified study buddy. Turn notes into decks, quiz yourself, and track your progress.</p>
        <div className="mt-6 flex justify-center gap-3">
          <NavLink to="/auth"><Button variant="primary" className="bg-white text-grey-900 hover:bg-white/90">Get Started</Button></NavLink>
          <NavLink to="/dashboard"><Button variant="secondary">Explore Dashboard</Button></NavLink>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'Flashcards', desc: 'AI builds smart cards with flip animations.' },
          { title: 'Quizzes', desc: 'Timed MCQs with instant feedback.' },
          { title: 'Progress', desc: 'See XP, streaks, and accuracy improve.' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-white dark:bg-grey-900 border border-grey-200 dark:border-grey-800 p-6 text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold">{f.title}</h3>
            <p className="mt-2 text-grey-600 dark:text-grey-300">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
