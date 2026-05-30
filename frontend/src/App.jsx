import { useState } from 'react'

const TOPICS = [
  { id: 'limits', title: 'Limits', icon: '∞', description: 'Explore the concept of limits and continuity.' },
  { id: 'derivatives', title: 'Derivatives', icon: "f'(x)", description: 'Learn differentiation rules and applications.' },
  { id: 'integrals', title: 'Integrals', icon: '∫', description: 'Master integration techniques and area under curves.' },
  { id: 'series', title: 'Series', icon: 'Σ', description: 'Study sequences, series, and convergence.' },
]

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="app">
      <header>
        <h1>Calc Guide</h1>
        <p>Your interactive calculus tutor</p>
      </header>

      <main>
        <div className="topic-grid">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              className={`topic-card ${selected === topic.id ? 'active' : ''}`}
              onClick={() => setSelected(topic.id)}
            >
              <span className="topic-icon">{topic.icon}</span>
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="lesson-area">
            <h2>{TOPICS.find(t => t.id === selected)?.title}</h2>
            <p>Lessons coming soon...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
