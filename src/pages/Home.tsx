import { Link } from 'react-router-dom'
import '../styles/Home.css'

export default function Home(): React.ReactElement {
  return (
    <>
      <header>
        <h1>Oakland Evans</h1>
        <p className="subtitle">Projects & Tools</p>
      </header>

      <main>
        <div className="project-grid">
          <Link to="/keytype" className="project-card">
            <div className="card-content">
              <h2>KeyType</h2>
              <p>Interactive typing trainer with on-screen keyboard and real-time finger positioning guides</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  )
}

