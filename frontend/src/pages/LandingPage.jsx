import { NavLink } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function LandingPage() {
  return (
    <div className="text-center">
      <section className="rounded-3xl bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 text-white p-10 shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold">Study Smarter, Rise Higher.</h1>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">AriseScholar is your AI-powered, gamified study buddy. Turn notes into decks, quiz yourself, and track your progress.</p>
        <div className="mt-6 flex justify-center gap-3">
          <NavLink to="/auth"><Button variant="primary">Get Started</Button></NavLink>
          <NavLink to="/dashboard"><Button variant="secondary">Explore Dashboard</Button></NavLink>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'Flashcards', desc: 'AI builds smart cards with flip animations.' },
          { title: 'Quizzes', desc: 'Timed MCQs with instant feedback.' },
          { title: 'Progress', desc: 'See XP, streaks, and accuracy improve.' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-white border border-black/10 p-6 text-left shadow-sm hover:shadow-md transition dark:bg-[#1E293B] dark:border-white/5 dark:hover:shadow-[0_0_0_1px_rgba(6,182,212,0.25)]">
            <h3 className="text-xl font-bold dark:text-white">{f.title}</h3>
            <p className="mt-2 text-grey-600 dark:text-grey-300">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
