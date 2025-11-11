import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'
import SignUp from './auth/Signup'
import SignIn from './auth/Signin'
import MobileNavBar from './pages/Home/Navbars/MobileNavBar'
import ProfilePage from './pages/ProfilePage'
import DiscoverPage from './pages/DiscoverPage'
import CreatePage from './pages/CreatePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path='/MobileNav' element={<MobileNavBar />}></Route>
      <Route path='/' element={<SignUp />} />
      <Route path='/Signin' element={<SignIn />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/discover' element={<DiscoverPage />} />
      <Route path='/create' element={<CreatePage />} />
      <Route path='/settings' element={<SettingsPage />} />
    </Routes>
  )
}
