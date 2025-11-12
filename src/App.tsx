import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/home'
import Landing from './pages/Landing/landing'
import SignUp from './auth/Signup'
import UploadPage from './pages/Home/UploadPage'
import MobileNavBar from './pages/Home/Navbars/MobileNavBar'

import SignIn from './auth/Signin'

export default function App() {
  return (
    <Routes>
      <Route path='/MobileNav' element={<MobileNavBar />}></Route>
      <Route path='/' element={<SignUp />} />
      <Route path='/landing' element={<Landing />} />
      <Route path='/Signin' element={<SignIn />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/Upload' element={<UploadPage />} />
    </Routes>
  )
}
