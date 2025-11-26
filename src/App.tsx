import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'
import SignUp from './auth/Signup'
import SignIn from './auth/Signin'
import ProfilePage from './pages/ProfilePage'
import GuestProfilePage from './pages/GuestProfilePage'
import DiscoverPage from './pages/DiscoverPage'
import CreatePage from './pages/CreatePage'
import SettingsPage from './pages/SettingsPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LandingPage from './pages/LandingPage'
import AuthCallback from './pages/AuthCallback'
import QuestionnaireStart from './pages/Questionnaire/QuestionnaireStart'
import QuestionnairePage from './pages/Questionnaire/QuestionnairePage'
import QuestionnaireComplete from './pages/Questionnaire/QuestionnaireComplete'
import MeetTheTeam from './pages/MeetTheTeam'
import FAQ from './pages/FAQ'
import About from './pages/About'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      
      {/* Questionnaire Routes */}
      <Route path='/questionnaire/start' element={<QuestionnaireStart />} />
      <Route path='/questionnaire/:step' element={<QuestionnairePage />} />
      <Route path='/questionnaire/complete' element={<QuestionnaireComplete />} />
      
      {/* Protected Routes (require auth when Supabase is integrated) */}
      <Route path='/home' element={<Home />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/profile/:userId' element={<GuestProfilePage />} />
      <Route path='/discover' element={<DiscoverPage />} />
      <Route path='/create' element={<CreatePage />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/change-password' element={<ChangePasswordPage />} />
      <Route path='/auth/callback' element={<AuthCallback />} />
      
      {/* Info Pages */}
      <Route path='/meet-the-team' element={<MeetTheTeam />} />
      <Route path='/faq' element={<FAQ />} />
      <Route path='/about' element={<About />} />
    </Routes>
  );
}
