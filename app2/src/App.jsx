import { useState } from 'react'
import './input.css'
import './output.css'
import './styles/style.header.css'
import Header from './components/Header'
import { useTheme } from './context/ThemeContext'

function App() {
  const { palette } = useTheme()

  return (
    <>
      <div className="h-[200vh] w-full"
      style={{backgroundColor: palette.colors[1]}}>
        <Header />
        <div className='flex  pt-12 justify-center  spacingDesktopDevice'>
            <p
            className='text-[7.5vw] uppercase heartContainer text-center max-w-[50vw] leading-none mobileText'
            style={{color: palette.colors[0]}}>
              The quick brown fox jumps over the lazy dog
            </p>
        </div>
      </div>
    </>
  )
}

export default App
