import { useState } from 'react'
import './input.css'
import './output.css'
import Header from './components/Header'
import { useTheme } from './context/ThemeContext'

function App() {
  const { palette } = useTheme()

  return (
    <>
      <div className="h-[200vh] w-full"
      style={{backgroundColor: palette.colors[1]}}>
        <Header />
        <div className='flex justify-center my-40'>
            <p
            className='text-[7.5vw] uppercase text-center max-w-[50vw] leading-none'
            style={{color: palette.colors[0]}}>
              The quick brown fox jumps over the lazy dog
            </p>
        </div>
      </div>
    </>
  )
}

export default App
