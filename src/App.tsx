import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}