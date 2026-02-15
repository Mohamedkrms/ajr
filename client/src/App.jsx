import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Surah from './pages/Surah';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Quran App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:id" element={<Surah />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
