import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home    from './pages/Home';
import Results from './pages/Results';
import Compare from './pages/Compare';
import Admin   from './pages/Admin';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/results/:city" element={<Results />} />
        <Route path="/compare"       element={<Compare />} />
        <Route path="/admin"         element={<Admin />} />
        <Route path="*"              element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
