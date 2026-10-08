import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './app/page';
import PracticePage from './app/practice/page';
import './app/globals.css';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/practice" element={<PracticePage/>} />
    </Routes>
  </BrowserRouter>
);
