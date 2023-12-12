import {jest} from '@jest/globals'

const mockIsWord = jest.fn(() => true)
jest.unstable_mockModule('../words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord
    } 
})

const {Wordle, buildLetter} = await import('../wordle.js')

describe('building a letter object', () => {
    test('returns a letter object', () => {
    expect(buildLetter('a', 'b')).toEqual({letter: 'a', status: 'b'})
    })
})

describe('constructing a new Wordle game', () => {
    test('sets maxGuesses to 6 if no argument is passed', () => {
        const wordle = new Wordle()
        expect(wordle.maxGuesses).toBe(6)
    })

    test('set maxGuesses to the argument passed', () => {
        const wordle = new Wordle(10)
        expect(wordle.maxGuesses).toBe(10)
    })
    
    test('sets guesses to an array of length maxGuesses', () => {
        const wordle = new Wordle()
        expect(wordle.guesses.length).toBe(6)
    })

    test('sets currGuess to 0', () => {
        const wordle = new Wordle()
        expect(wordle.currGuess).toBe(0)
    })

    test('sets word to a word from getWord', () => {
        const wordle = new Wordle()
        expect(wordle.word).toBe('APPLE')
    })
})

describe('building a guess from word', () => {
    test('sets the status of a correct letter to CORRECT', () => {
        const wordle = new Wordle()
        let guess = wordle.buildGuessFromWord('A____')
        expect(guess[0].status).toBe('CORRECT')
    })

    test('sets the status of a present letter to PRESENT', () => {
        const wordle = new Wordle()
        let guess = wordle.buildGuessFromWord('E____')
        expect(guess[0].status).toBe('PRESENT')
    })

    test('sets the status of an absent letter to ABSENT', () => {
        const wordle = new Wordle()
        let guess = wordle.buildGuessFromWord('Z____')
        expect(guess[0].status).toBe('ABSENT')
    })
})

describe('making a guess', () => {
    test('throw an error if no more guesses are allowed', () => {
        const wordle = new Wordle(1)
        wordle.appendGuess('HELLO')
        expect(() => {
            wordle.appendGuess('HELLO')
        }).toThrow()
    })

    test('throws an error if the guess is not of length 5', () => {
        const wordle = new Wordle()
        expect(() => {
            wordle.appendGuess('THREES')
        }).toThrow()
    })

    test('throws an error if the guess is not a word', () => {
        const wordle = new Wordle()
        mockIsWord.mockReturnValue(false)
        expect(() => {
            wordle.appendGuess('GUESS')
        }).toThrow()
    })

    test('increments the current guess', () => {
        const wordle = new Wordle()
        wordle.appendGuess('GUESS')
        expect(wordle.currGuess).toBe(1)
    }) 
})

describe('wordle is solved', () => {
    test('return true if the latest guess is the correct word', () => {
        const wordle = new Wordle()
        wordle.appendGuess('SMILE')
        expect(wordle.isSolved()).toBe(true)
    })

    test('return false if the latest guess is not the correct word', () => {
        const wordle = new Wordle()
        wordle.appendGuess('SMILE')
        expect(wordle.isSolved()).toBe(false)
    })
})

describe('should end game', () => {
    test('returns true if the latest guess is the correct word', () => {
        const wordle = new Wordle()
        wordle.appendGuess('SMILE')
        expect(wordle.shouldEndGame()).toBe(true)
    })
    
    test('returns true if there are no guesses left', () => {
        const wordle = new Wordle(1)
        wordle.appendGuess('SMILE')
        expect(wordle.shouldEndGame()).toBe(true)
    })

    test('returns false if no guess has been made', () => {
        const wordle = new Wordle()
        expect(wordle.shouldEndGame()).toBe(false)
    })

    test('returns false if there are guesses left and the word has not been guessed', () => {
        const wordle = new Wordle();
        wordle.appendGuess('GUESS');
        expect(wordle.shouldEndGame()).toBe(false);
      });
})