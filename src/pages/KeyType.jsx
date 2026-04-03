import { useState, useEffect, useRef } from 'react'
import Keyboard from '../components/Keyboard'
import { markKey } from '../utils/keyMapping'
import { paragraphs } from '../utils/paragraphs'
import '../styles/KeyType.css'

function KeyType() {
  const [isGameActive, setIsGameActive] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [wpm, setWpm] = useState(null)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [characters, setCharacters] = useState([])
  const [cursorIndex, setCursorIndex] = useState(0)
  const typingRef = useRef(null)
  const startTimeRef = useRef(null)

  const startGame = () => {
    setIsGameActive(true)
    setHeaderVisible(false)
    setWpm(null)
    setCursorIndex(0)
    startTimeRef.current = null

    const text = paragraphs[Math.floor(Math.random() * paragraphs.length)]
    const chars = text.split('').map((char, index) => ({
      char,
      status: index === 0 ? 'cursor' : 'pending'
    }))
    setCharacters(chars)

    setTimeout(() => {
      typingRef.current?.focus({ preventScroll: true })
      if (chars.length > 0) {
        markKey(chars[0].char)
      }
    }, 0)
  }

  useEffect(() => {
    if (!isGameActive) return

    const keydown = (event) => {
      const key = event.key

      if (key === 'Shift') return

      const scrollKeys = new Set([' ', 'Spacebar', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])
      if (scrollKeys.has(key)) {
        event.preventDefault()
      }

      if (!startTimeRef.current) {
        startTimeRef.current = new Date()
      }

      const currentChar = characters[cursorIndex]
      if (!currentChar) return

      if (key === currentChar.char || (key === 'Enter' && currentChar.char === '\n')) {
        // Correct key
        const newChars = [...characters]
        newChars[cursorIndex].status = 'done'

        const nextIndex = cursorIndex + 1
        if (nextIndex < newChars.length) {
          newChars[nextIndex].status = 'cursor'
          setCursorIndex(nextIndex)
          setCharacters(newChars)
          markKey(newChars[nextIndex].char)
        } else {
          // Game complete
          setCharacters(newChars)
          const endTime = new Date()
          const delta = endTime - startTimeRef.current
          const seconds = delta / 1000
          const numberOfWords = characters.length / 4.7
          const wps = numberOfWords / seconds
          const calculatedWpm = wps * 60.0

          setWpm(Math.round(calculatedWpm))
          setIsGameActive(false)
          setHeaderVisible(true)
        }
      } else {
        // Wrong key - trigger error pulse
        const typingDiv = typingRef.current
        if (typingDiv) {
          typingDiv.classList.remove('error-pulse')
          void typingDiv.offsetWidth
          typingDiv.classList.add('error-pulse')
        }
      }
    }

    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
    }
  }, [isGameActive, characters, cursorIndex])

  useEffect(() => {
    return () => {
      document.querySelectorAll('.active-key').forEach(el => el.classList.remove('active-key'))
      document.querySelectorAll('.active-finger').forEach(el => el.classList.remove('active-finger'))
    }
  }, [])

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard)
    const keyboard = document.getElementById('keyboard')
    if (keyboard) {
      keyboard.classList.toggle('hidden')
    }
    const typing = typingRef.current
    if (typing) {
      typing.focus({ preventScroll: true })
    }
  }

  return (
    <div className="keytype-container">
      {headerVisible && <h1 id="header">KeyType</h1>}
      <div id="typing" ref={typingRef} tabIndex="-1">
        {!isGameActive && !wpm && 'Better Every Day'}
        {characters.map((charObj, index) => {
          const className = charObj.status === 'cursor' ? 'cursor' : charObj.status === 'done' ? 'done' : ''
          const isEnter = charObj.char === '\n'
          return (
            <span
              key={index}
              className={`${className} ${isEnter ? 'enter-icon fa fa-level-down' : ''}`}
            >
              {charObj.char}
            </span>
          )
        })}
      </div>
      <div id="stats">{wpm ? `${wpm} WPM!` : ''}</div>
      {!isGameActive && (
        <button id="startGameBtn" onClick={startGame}>
          Start Game
        </button>
      )}
      <button id="toggleKeyboardBtn" onClick={toggleKeyboard}>
        {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
      </button>
      <Keyboard />
    </div>
  )
}

export default KeyType
