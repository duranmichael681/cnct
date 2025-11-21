import SideBar from '../../components/SideBar'
import PostCard from '../../components/PostCard'
import Footer from '../../components/Footer'
import PostPicture from '../../assets/download.jfif'
import PopularEventImage from '../../assets/how-it-works.jpg'
import { useState, useEffect } from 'react'
import {supabase} from '../../supabase/client'


export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)

   useEffect(() => {
      supabase.auth.getUser().then((res) => console.log(res));
    } , []); //for seeing if log in via supabase worked , can delete later 

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Array of posts
  const posts = [
    {
      user: 'Profile_Name1',
      time: 'DATE/TIME 1',
      image: PostPicture,
      likes: 20,
      comments: 10,
    },
    {
      user: 'Profile_Name2',
      time: 'DATE/TIME 2',
      image: PostPicture,
      likes: 35,
      comments: 5,
    },
    {
      user: 'Profile_Name3',
      time: 'DATE/TIME 3',
      image: PostPicture,
      likes: 50,
      comments: 12,
    },
  ]

  // Array of popular events
  const popularEvents = [
    {
      title: 'Event 1',
      image: PopularEventImage,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a mi placerat.',
    },
    {
      title: 'Event 2',
      image: PopularEventImage,
      description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.',
    },
    {
      title: 'Event 3',
      image: PopularEventImage,
      description: 'Pellentesque a mi placerat, aliquam sem ut, tincidunt justo.',
    },
    {
      title: 'Event 4',
      image: PopularEventImage,
      description: 'Mauris in metus ut lorem consequat feugiat.',
    },
  ]

  return (
    <div className='flex min-h-screen bg-[var(--background)] flex-col'>
      <div className='flex flex-1'>
        <SideBar />
        <div className='flex-grow flex flex-col lg:flex-row pb-24 md:pb-0 md:ml-[70px]'>
          {/* Left Section - Posts */}
          <div className='p-4 sm:p-6 lg:p-8 w-full lg:w-2/3 flex flex-col gap-6 sm:gap-8 lg:gap-10'>
            {/* Welcome Message */}
            <div className='animate-fade-in'>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-2'>
                Welcome Back, <span className='text-[var(--primary)]'>User</span>!
              </h1>
              <p className='text-base sm:text-lg text-[var(--text)] opacity-80'>
                Here's what's happening today
              </p>
            </div>

            {/* CNCT Title */}
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--text)] animate-fade-in-delay-1'>
              Latest Posts
            </h2>

            {posts.map((_post, index) => (
              <div key={index} className={`animate-fade-in-delay-${Math.min(index + 2, 4)}`}>
                <PostCard />
              </div>
            ))}
          </div>
          {width >= 1300 && (
            <div className='m-5 w-1/3 h-auto flex flex-col justify-start items-center border-l border-[var(--border)] mt-20 animate-fade-in-delay-1'>
              <h1 className='text-center text-[var(--primary)] font-semibold text-3xl mb-6 animate-fade-in-delay-2'>Popular this Week</h1>

              <div className='flex flex-col w-full gap-10'>
                {popularEvents.map((event, index) => (
                  <div key={index} className={`flex w-full relative cursor-pointer hover:bg-[var(--menucard)] transition-colors rounded-lg p-2 animate-fade-in-delay-${Math.min(index + 3, 4)}`}>
                    <div className='flex flex-col sm:flex-row w-full items-center sm:items-start sm:justify-start'>
                      <img src={event.image} alt={event.title} className='ml-5 rounded-xl max-w-[175px] aspect-square object-cover mt-10' />
                    </div>
                    <div className='mt-10 mr-10 w-2/3 flex-row items-center justify-center'>
                      <h2 className='text-[var(--primary)] font-semibold text-2xl'>{event.title}</h2>
                      <div className='bg-[var(--border)] h-0.25 w-15 my-3' />
                      <p className='text-[var(--text)]'>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
