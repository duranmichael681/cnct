import './index.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/home.tsx'

export default function App() {
  ;<Routes>
    {/* Route for /home */}
    <Route path='/home' element={<Home />} />
  </Routes>
}
