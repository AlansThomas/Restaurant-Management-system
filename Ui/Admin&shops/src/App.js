import { Suspense } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
import './app.css'
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import './utils/aaa.css';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Suspense fallback={
           <div class="loader-container">
          <div class="three-body">
<div class="three-body__dot"></div>
<div class="three-body__dot"></div>
<div class="three-body__dot"></div>
</div></div>
          }
          
          >
            <Router />
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
