import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-3xl font-bold text-center mt-20">Devlytic 🚀</div>} />
      </Routes>
    </Router>
  );
}

export default App;