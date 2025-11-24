import SideBar from '../../components/SideBar'
import PostCard from '../../components/PostCard'
import Footer from '../../components/Footer'
import PostPicture from '../../assets/download.jfif'
import PopularEventImage from '../../assets/how-it-works.jpg'
import { useState, useEffect } from 'react'

export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    document.title = 'CNCT | Home';
    // Mark that user has visited the app (for showing sidebar on info pages)
    sessionStorage.setItem('hasVisitedApp', 'true');
    
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
      postId: 'pop1',
      username: 'EventOrganizer1',
      timestamp: '3h ago',
      eventName: 'Beach Volleyball Tournament',
      location: 'FIU Beach',
      time: 'Saturday, 2:00 PM',
      description: 'Join us for an exciting beach volleyball tournament! All skill levels welcome.',
      tags: ['#Volleyball', '#Beach', '#Tournament'],
      imageUrl: PopularEventImage,
      initialRsvpCount: 45,
      initialCommentCount: 12,
    },
    {
      postId: 'pop2',
      username: 'StudentLife',
      timestamp: '5h ago',
      eventName: 'Campus Food Festival',
      location: 'GC Ballrooms',
      time: 'Friday, 11:00 AM',
      description: 'Taste cuisines from around the world at our annual food festival!',
      tags: ['#Food', '#Festival', '#Culture'],
      imageUrl: PopularEventImage,
      initialRsvpCount: 120,
      initialCommentCount: 28,
    },
    {
      postId: 'pop3',
      username: 'FIUAthletics',
      timestamp: '1d ago',
      eventName: 'Panthers Basketball Game',
      location: 'FIU Arena',
      time: 'Thursday, 7:00 PM',
      description: 'Cheer on the Panthers as they take on their conference rivals!',
      tags: ['#Basketball', '#Panthers', '#Sports'],
      imageUrl: PopularEventImage,
      initialRsvpCount: 200,
      initialCommentCount: 45,
    },
    {
      postId: 'pop4',
      username: 'ArtClub',
      timestamp: '2d ago',
      eventName: 'Student Art Exhibition',
      location: 'Patricia & Phillip Frost Art Museum',
      time: 'Sunday, 1:00 PM',
      description: 'Showcase of incredible artwork from FIU students. Don\'t miss it!',
      tags: ['#Art', '#Exhibition', '#Culture'],
      imageUrl: PopularEventImage,
      initialRsvpCount: 85,
      initialCommentCount: 19,
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
                Welcome, <span className='text-[var(--primary)]'>User</span>!
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

              <div className='flex flex-col w-full gap-6 px-4'>
                {popularEvents.map((event, index) => (
                  <div key={index} className={`animate-fade-in-delay-${Math.min(index + 3, 4)}`}>
                    <PostCard
                      postId={event.postId}
                      username={event.username}
                      timestamp={event.timestamp}
                      eventName={event.eventName}
                      location={event.location}
                      time={event.time}
                      description={event.description}
                      tags={event.tags}
                      imageUrl={event.imageUrl}
                      initialRsvpCount={event.initialRsvpCount}
                    />
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
