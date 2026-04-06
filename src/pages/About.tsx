import { Link } from 'react-router-dom'
import { ReactElement } from 'react'
import '../styles/Home.css'

export default function About(): ReactElement {
  return (
    <>
      <header>
        <h1>About Oakland Evans</h1>
        <p className="subtitle">Developer & Creator</p>
      </header>

      <main>
        <div className="about-content">
          <p>
            Welcome to my personal portfolio site. I'm Oakland Evans, a developer passionate about creating
            interactive tools and games using modern web technologies.
          </p>
          <p>
            This site showcases various projects including typing trainers, games, and other utilities.
            All projects are built with React, TypeScript, and Vite for optimal performance.
          </p>
          <p>
            Feel free to explore the projects and check out the source code on GitHub.
          </p>
          <div className="links">
            <a href="https://github.com/oaklandevans" target="_blank" rel="noopener noreferrer" className="link-button">
              GitHub Profile
            </a>
            <Link to="/" className="link-button">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
