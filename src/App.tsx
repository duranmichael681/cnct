import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/home'
import SignUp from './auth/Signup'

export default function App() {
  return (
    <Routes>
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/Home' element={<Home />} />
    </Routes>
  )
}
