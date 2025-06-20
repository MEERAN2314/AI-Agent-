import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import QuestionBuilder from './components/QuestionBuilder';
import PPTMaker from './components/PPTMaker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/question-builder" element={<QuestionBuilder />} />
        <Route path="/ppt-maker" element={<PPTMaker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;