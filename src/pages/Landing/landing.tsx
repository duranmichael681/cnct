import '../../index.css'
import { Link } from 'react-router-dom'
import SideBar from '../../components/SideBar'
import Footer from '../../components/Footer'

export default function LandingPage() {
  return (
    <>
    <div className='bg-[var(--background)] flex'>
        <SideBar/>
        <div className='py-10 w-full'>
          <h2 className='pl-10 text-4xl font-black hidden sm:block'>CNCT</h2>

          <div className='my-4 sm:pl-10 grid grid-cols-1 gap-4 sm:grid-cols-2 h-[400px]'>
            <div className='flex flex-col gap-4 sm:pl-0 pl-6 justify-center z-20'>
                <p className='text-4xl'>Welcome to</p>
                <h1 className='font-black text-6xl'>CNCT!</h1>
                <hr className='w-[120px] border-[var(--tertiary)] border-1' />
                <p className='font-light'>Join activities, sports, events and more.</p>
                <Link to="/Signin" className='inline-block bg-[var(--tertiary)] max-w-60 text-white py-3 px-12 rounded-2xl rounded-tr-4xl text-center'>
                    Get Started Now
                </Link>
            </div>
            <figure className='sm:relative absolute top-0 left-0'>
                <img 
                    className='rounded-none object-cover h-full w-full top-0 z-0 sm:relative sm:rounded-bl-4xl sm:rounded-tl-4xl' 
                    src="/src/assets/hero.jpg" 
                />
                <div className='z-10 absolute top-0 left-0 h-full w-full sm:hidden bg-gradient-to-b from-transparent to-[#FFFBEB]'></div>
            </figure>
          </div>

          <div className='p-6'>
            <h2 className='text-[var(--tertiary)] text-3xl font-bold'>What is CNCT?</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-12 py-4'>
              <figure className='hidden sm:block'>
                <img className='rounded-br-4xl h-100 object-cover object-center' src="/src/assets/image1.jpg" alt="What is CNCT?" />
              </figure>
              <div className='flex flex-col gap-6 sm:gap-12 pr-4'>
                <figure className='w-20'>
                  <img src="/src/assets/linkChain.gif" alt="" />
                </figure>
                <hr className='w-[120px] border-[var(--tertiary)] border-1' />
                <p>CNCT shorter for connect is a website where FIU students can easily create and join plans — from volleyball or running to sparring and study groups. Each plan has a messaging thread for quick coordination and a “Who’s Going” list so everyone knows who’s in. </p>
              </div>
            </div>
          </div>

          <div className='bg-[var(--secondary)] relative w-full grid grid-cols-1 sm:grid-cols-2 gap-12 h-[600px] text-white p-0 sm:p-10'>
            <div className='flex flex-col gap-8 z-20 p-10 sm:p-none'>
              <h2 className='text-3xl font-bold'>How it Works</h2>
              <hr className='w-[60px] sm:w-[120px] border-white border-1' />
              <p>
                If you ever want to get out of your comfort zone, learn a new hobby, or meet new 
                people, CNCT makes it simple. <br /><br />
                
                Just hit “Find a Plan” to see what’s happening around campus — sports, study groups, 
                workouts, and more. <br /><br />

                Got something more niche in mind? “Create a plan” and let others RSVP to join you.
              </p>
            </div>
            <figure className='sm:relative absolute top-0 left-0 w-full h-full'>
              <img className='h-full sm:h-100 z-0 object-cover rounded-none sm:rounded-tl-4xl bg-bottom-left object-center' 
              src="/src/assets/how-it-works.jpg" 
              alt="How it Works" />
              <div className='z-10 absolute top-0 left-0 h-full w-full sm:hidden bg-gradient-to-t from-transparent to-[#0C2B63]'></div>
            </figure>
          </div>

          <div className='text-center p-20'>
            <h2 className='text-[var(--tertiary)] font-bold text-4xl'>What are you Waiting For?</h2>
            <div className='flex flex-col gap-2 items-center'>
              <Link to="/Signin" className='mt-6 bg-[var(--secondary)] max-w-80 text-white py-3 px-12 rounded-2xl'>
                  Join a Plan
              </Link>
              <Link to="/Signin" className='mt-6 bg-[var(--tertiary)] max-w-80 text-white py-3 px-12 rounded-2xl'>
                  Create a Plan
              </Link>
            </div>
          </div>
        
        </div>
        {/* <SignUp /> */}
    </div>
    <Footer/>
    </>
  )
}