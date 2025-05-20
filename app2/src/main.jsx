import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx';
// import { GravityProvider } from './context/ProjectsGravity.jsx';
import { HeaderProvider } from './context/HeaderContext.jsx';
import router from './lib/Routes.jsx';
import App from './App.jsx'
import './output.css'
// import './input.css'
// import './styles/style.fonts.css'

// import ScrollWrapper from './scroll/ScrollWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ScrollWrapper> */}
    {/* <GravityProvider> */}
      <ThemeProvider>
        <HeaderProvider>
          <RouterProvider router={router} />
        </HeaderProvider>
      </ThemeProvider>
    {/* </GravityProvider> */}
    {/* </ScrollWrapper> */}
  </StrictMode>,
)
