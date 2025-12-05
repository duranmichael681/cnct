import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import ChainIcon from '../components/icons/ChainIcon'
import CollageImg1 from '../assets/placeholder_event_1.png'
import CollageImg2 from '../assets/placeholder_event_2.png'
import CollageImg3 from '../assets/placeholder_event_3.png'
import CollageImg4 from '../assets/placeholder_event_4.png'
import CollageImg5 from '../assets/placeholder_event_5.png'
import CollageImg6 from '../assets/placeholder_event_6.png'
import CollageImg7 from '../assets/placeholder_event_7.png'
import CollageImg8 from '../assets/placeholder_event_8.png'
import { Link, useNavigate } from 'react-router-dom'

//auth imports
import { googleAuth } from '../supabase/auth'
import {signInEmail} from '../supabase/auth'
import { supabase } from '../lib/supabaseClient'

export default function SignIn() {
  const navigate = useNavigate()
  
  useEffect(() => {
    document.title = 'CNCT | Sign In';
  }, []);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const user = await signInEmail(email, password);
      
      // Check if there's questionnaire data to save
      const questionnaireData = localStorage.getItem('questionnaireData');
      if (questionnaireData && user) {
        const parsedData = JSON.parse(questionnaireData);
        
        // Update user profile with questionnaire data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: parsedData.firstName,
            last_name: parsedData.lastName,
            pronouns: parsedData.pronouns,
            degree_program: parsedData.major,
            username_email: parsedData.email || email
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating user profile:', updateError);
        } else {
          console.log('User profile updated successfully');
          // Clear questionnaire data after successful save
          localStorage.removeItem('questionnaireData');
        }
      }
      
      // Navigate to home on successful login
      navigate('/home')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const images = [
    [
      CollageImg3,
    ],
    [CollageImg1, CollageImg5, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', CollageImg6],
    [CollageImg2, CollageImg8, CollageImg4, CollageImg7],
  ]

  const singleSetHeight = 4 * 240

  const scrollUpAnimation = {
    y: [0, -singleSetHeight],
    transition: {
      repeat: Infinity,
      duration: 90,
      ease: 'linear' as const,
    },
  }

  const scrollDownAnimation = {
    y: [-singleSetHeight, 0],
    transition: {
      repeat: Infinity,
      duration: 90,
      ease: 'linear' as const,
    },
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Left Side — Log In Form */}
      <div className='w-full md:w-1/3 h-auto md:h-screen flex justify-center items-center bg-[var(--background)]'>
        <div className='w-full max-w-md mx-auto px-6 md:px-0 mt-8 md:mt-0'>
          {/* Logo Section */}
          <div className='flex justify-center mb-8'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='w-24 h-24 md:w-32 md:h-32 flex items-center justify-center'
            >
              <ChainIcon className='w-full h-full' />
            </motion.div>
          </div>
          
          <h1 className='font-bold text-3xl text-[var(--text)] text-center mb-2'>Welcome To CNCT</h1>
          <p className='text-[var(--text-secondary)] text-center mb-8'>Sign in to your account</p>

          {/* Input fields now use w-full to fill the max-w-md container gracefully */}
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-[var(--text)] mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <input
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-secondary)]'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-[var(--text)] mb-2'>
                Password
              </label>
              <div className='relative'>
                <input
                  placeholder='Enter your password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 pr-12 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--text-secondary)]'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-[var(--danger)]/10 border border-[var(--danger)] text-[var(--danger)] rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading || !email.trim() || !password.trim()}
            className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all ${
              loading || !email.trim() || !password.trim()
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className='mt-6 space-y-3 text-center'>
            <p className='text-sm text-[var(--text)]'>
              Don't have an account?{' '}
              <Link to='/questionnaire/start' className='text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold hover:cursor-pointer'>
                Sign Up
              </Link>
            </p>

            <p className='text-sm text-[var(--text)]'>
              Forgot your password?{' '}
              <Link 
                to="/forgot-password" 
                className='text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold hover:cursor-pointer'
              >
                Reset Password
              </Link>
            </p>
          </div>

          <div className='flex items-center mt-8 mb-6'>
            <div className='flex-grow h-px bg-[var(--border)]'></div>
            <span className='mx-4 text-[var(--text-secondary)] text-sm'>or</span>
            <div className='flex-grow h-px bg-[var(--border)]'></div>
          </div>

          <button 
            onClick={googleAuth} 
            className='flex items-center justify-center w-full py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--card-bg)] hover:border-[var(--primary)] transition-all cursor-pointer mb-8'
          >
            <div className='flex items-center gap-3'>
              <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google' className='w-5 h-5' />
              <span className='text-[var(--text)] font-semibold text-sm whitespace-nowrap'>Continue with Google</span>
            </div>
          </button>
        </div>
      </div>

      {/* Right Side — Animated Showcase */}
      <div className='w-full md:w-2/3 h-[50vh] md:h-screen bg-[#0b132b] flex justify-center items-center overflow-hidden'>
        <div className='flex justify-center gap-20'>
          {images.map((imageSet, columnIndex) => {
            const duplicatedImages = [...imageSet, ...imageSet, ...imageSet]
            return (
              <motion.div
                key={columnIndex}
                className={`flex flex-col gap-5 ${columnIndex === 1 ? 'flex-col-reverse' : ''}`}
                animate={columnIndex === 1 ? scrollDownAnimation : scrollUpAnimation}
                initial={columnIndex === 1 ? { y: -singleSetHeight } : { y: 0 }}
              >
                {duplicatedImages.map((image, index) => (
                  <div key={index} className='relative w-[190px] h-[240px] overflow-hidden rounded-2xl shadow-lg'>
                    <img src={image} alt='Event' className='w-full h-full object-cover hover:scale-105 transition-transform duration-500' />
                  </div>
                ))}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
