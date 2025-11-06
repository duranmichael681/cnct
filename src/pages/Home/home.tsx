import SideBar from '../../components/SideBar'
import UserPicture from '../../assets/istockphoto-1495088043-612x612.jpg'
import PostPicture from '../../assets/download.jfif'
import ChainIcon from '../../assets/455691.png'
import CommentIcon from '../../assets/comment_24dp_BLACK_FILL0_wght400_GRAD0_opsz24.svg'
import PopularEventImage from '../../assets/how-it-works.jpg'
import { useState, useEffect } from 'react'

export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)

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
    <div className='flex min-h-screen'>
      <SideBar />
      <div className='flex-grow bg-[var(--background)] flex'>
        {/* Left Section - Posts */}
        <div className='p-8 text-black w-2/3 flex flex-col gap-10'>
          <h1 className='text-5xl font-semibold mb-4'>CNCT</h1>

          {posts.map((post, index) => (
            <div key={index}>
              <div className='mt-4 flex items-center gap-4'>
                <img src={UserPicture} alt='User Picture' className='w-full max-w-[70px] aspect-square rounded-full object-cover' />
                <h2 className='text-xl font-semibold'>{post.user}</h2>
                <div className='bg-gray-500 h-12 w-0.25 mx-15'></div>
                <h2 className='font-semibold text-xl'>{post.time}</h2>
              </div>

              <div className='relative w-full max-w-[765px] aspect-[765/268] my-5 flex-col flex'>
                <h2 className='mt-5 font-semibold text-2xl'>Event_title</h2>
                <img src={post.image} alt='User Post' className='w-full h-full object-cover rounded-xl' />
              </div>

              <div className='flex justify-start'>
                <div className='mx-8 flex flex-row gap-10'>
                  <img src={ChainIcon} alt='Chain Icon' className='w-6 h-6 object-contain' />
                  <h2 className='font-semibold text-xl'>{post.likes}</h2>
                  <img src={CommentIcon} alt='Comment Icon' className='w-6 h-6 object-contain' />
                  <h2 className='font-semibold text-xl'>{post.comments}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        {width >= 1300 && (
          <div className='m-5 w-1/3 h-auto flex flex-col justify-start items-center border-l border-gray-500 mt-20'>
            <h1 className='text-center text-[var(--primary)] font-semibold text-3xl mb-6'>Popular this Week</h1>

            <div className='flex flex-col w-full gap-10'>
              {popularEvents.map((event, index) => (
                <div key={index} className='flex w-full relative'>
                  <div className='flex flex-col sm:flex-row w-full items-center sm:items-start sm:justify-start'>
                    <img src={event.image} alt={event.title} className='ml-5 rounded-xl max-w-[175px] aspect-square object-cover mt-10' />
                  </div>
                  <div className='mt-10 mr-10 w-2/3 flex-row items-center justify-center'>
                    <h2 className='text-[var(--primary)] font-semibold text-2xl'>{event.title}</h2>
                    <div className='bg-gray-500 h-0.25 w-15 my-3' />
                    <p className='text-[var(--primary-text)]'>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
