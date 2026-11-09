/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/


const startingWords = [
  'banana', 'garden', 'pencil', 'window',
  'orange', 'planet', 'camera', 'rabbit',
  'flower', 'castle', 'purple', 'button'
]

function scrambleWord (word) {
  let scrambled = shuffle(word)

  while (scrambled === word) {
    scrambled = shuffle(word)
  }

  return scrambled
}

function App () {
  const [words, setWords] = React.useState(() => {
    const saved = localStorage.getItem('words')
    return saved === null ? shuffle(startingWords) : JSON.parse(saved)
  })

  const [points, setPoints] = React.useState(() => {
    const saved = localStorage.getItem('points')
    return saved === null ? 0 : parseInt(saved)
  })

  const [strikes, setStrikes] = React.useState(() => {
    const saved = localStorage.getItem('strikes')
    return saved === null ? 0 : parseInt(saved)
  })

  const [passes, setPasses] = React.useState(() => {
    const saved = localStorage.getItem('passes')
    return saved === null ? 3 : parseInt(saved)
  })

  const [scrambled, setScrambled] = React.useState(() => {
    const saved = localStorage.getItem('scrambled')
    if (saved !== null) {
      return saved
    }
    return words.length > 0 ? scrambleWord(words[0]) : ''
  })

  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState('')
  const gameOver = words.length === 0 || strikes >= 3

  // Save the current game when something changes.
  React.useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words))
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
    localStorage.setItem('scrambled', scrambled)
  }, [words, points, strikes, passes, scrambled])

  function nextWord () {
    const remaining = words.slice(1)
    setWords(remaining)

    if (remaining.length > 0) {
      setScrambled(scrambleWord(remaining[0]))
    } else {
      setScrambled('')
    }
  }

  function inputHandler (e) {
    setGuess(e.target.value)
  }

  function guessHandler (e) {
    e.preventDefault()

    if (guess === '' || gameOver) {
      return
    }

    if (guess.toLowerCase() === words[0].toLowerCase()) {
      setPoints(points + 1)
      setMessage('Correct! You earned a point.')
      nextWord()
    } else {
      setStrikes(strikes + 1)
      setMessage('Incorrect. Try again!')
    }

    setGuess('')
  }

  function passHandler () {
    if (passes === 0 || gameOver) {
      return
    }

    setPasses(passes - 1)
    setMessage('You skipped that word.')
    setGuess('')
    nextWord()
  }

  function resetHandler () {
    const newWords = shuffle(startingWords)
    setWords(newWords)
    setScrambled(scrambleWord(newWords[0]))
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setGuess('')
    setMessage('')
  }

  return (
    <div className="game">
      <header>
        <h1>Scramble</h1>
        <p>Guess the word from the mixed-up letters.</p>
      </header>

      <div className="scores">
        <div>
          <span>Points</span>
          <strong>{points}</strong>
        </div>
        <div>
          <span>Strikes</span>
          <strong>{strikes} / 3</strong>
        </div>
        <div>
          <span>Passes</span>
          <strong>{passes}</strong>
        </div>
      </div>

      <main className="card">
        {gameOver ? (
          <div>
            <h2>Game Over!</h2>
            <p>
              {words.length === 0
                ? 'You finished all the words!'
                : 'You reached the maximum number of strikes.'}
            </p>
            <p className="message">{message}</p>
            <p>Your final score is {points}.</p>
            <button onClick={resetHandler}>Play Again</button>
          </div>
        ) : (
          <div>
            <p>Word {startingWords.length - words.length + 1} of {startingWords.length}</p>
            <h2 className="scrambled">{scrambled}</h2>

            <form onSubmit={guessHandler}>
              <label htmlFor="guess">Your guess</label>
              <div className="guess-row">
                <input
                  id="guess"
                  type="text"
                  value={guess}
                  onChange={inputHandler}
                  placeholder="Enter a word"
                />
                <button type="submit">Guess</button>
              </div>
            </form>

            <p className="message">{message}</p>
            <button
              className="pass-button"
              onClick={passHandler}
              disabled={passes === 0}
            >
              Pass
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
