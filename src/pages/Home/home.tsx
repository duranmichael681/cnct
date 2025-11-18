import SideBar from '../../components/SideBar'
import PostCard from '../../components/PostCard'
import Footer from '../../components/Footer'
import PopularEventImage from '../../assets/how-it-works.jpg'
import { useState, useEffect } from 'react'
import { getAllEvents, type Event } from '../../services/api'
import { LoadingSpinner, ErrorMessage } from '../../components/ui/UIComponents'
import { formatEventDate } from '../../utils/helpers'

export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch events from backend
  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        setLoading(true)
        const data = await getAllEvents()
        if (mounted) {
          setEvents(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching events:', err)
          setError('Failed to load events. Make sure the backend server is running.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchEvents()
    return () => { mounted = false }
  }, [])
  
  // Use real events or empty array
  const displayEvents = events.length > 0 ? events : [];

  // Get attendee count for each event
  const getAttendeeCount = (event: Event) => {
    return event.attendees && event.attendees.length > 0 ? event.attendees[0].count : 0;
  };

  // Popular events - latest 4 upcoming events
  const popularEvents = events
    .filter(event => new Date(event.start_date) > new Date())
    .slice(0, 4)
    .map((event) => ({
      id: event.id,
      title: event.title,
      image: event.post_picture_url || PopularEventImage,
      description: event.body,
      location: event.building || 'Location TBD',
      date: formatEventDate(event.start_date),
    }));

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
              Latest Events
            </h2>

            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading events from Supabase..." />}

            {/* Error State */}
            {error && (
              <ErrorMessage
                message={error}
                actionText="Retry"
                onAction={() => window.location.reload()}
              />
            )}

            {/* Empty State */}
            {!loading && !error && displayEvents.length === 0 && (
              <div className='text-center py-10 bg-[var(--menucard)] rounded-lg'>
                <p className='text-[var(--text)] text-lg'>No events yet</p>
                <p className='text-[var(--text)] opacity-70 mt-2'>Be the first to create an event!</p>
              </div>
            )}

            {/* Events List */}
            {!loading && displayEvents.map((event, index) => (
              <div key={event.id} className={`animate-fade-in-delay-${Math.min(index + 2, 4)}`}>
                <div className='bg-[var(--menucard)] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold'>
                      {event.title[0]}
                    </div>
                    <div>
                      <p className='text-[var(--text)] font-semibold'>{event.title}</p>
                      <p className='text-[var(--text)] opacity-60 text-sm'>
                        {formatEventDate(event.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className='text-[var(--text)] mb-3'>{event.body}</p>
                  <div className='flex gap-4 text-sm text-[var(--text)] opacity-80 flex-wrap'>
                    {event.building && <span>📍 {event.building}</span>}
                    <span>📅 {formatEventDate(event.start_date)}</span>
                    {event.end_date && <span>⏰ Ends: {formatEventDate(event.end_date)}</span>}
                    <span>👥 {getAttendeeCount(event)} attending</span>
                    {event.is_private && <span className='text-yellow-500'>🔒 Private</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {width >= 1300 && (
            <div className='m-5 w-1/3 h-auto flex flex-col justify-start items-center border-l border-[var(--border)] mt-20 animate-fade-in-delay-1'>
              <h1 className='text-center text-[var(--primary)] font-semibold text-3xl mb-6 animate-fade-in-delay-2'>Popular this Week</h1>

              <div className='flex flex-col w-full gap-10'>
                {popularEvents.length === 0 ? (
                  <p className='text-center text-[var(--text)] opacity-70'>No events yet</p>
                ) : (
                  popularEvents.map((event, index) => (
                    <div key={event.id || index} className={`flex w-full relative cursor-pointer hover:bg-[var(--menucard)] transition-colors rounded-lg p-2 animate-fade-in-delay-${Math.min(index + 3, 4)}`}>
                      <div className='flex flex-col sm:flex-row w-full items-center sm:items-start sm:justify-start'>
                        <img src={event.image} alt={event.title} className='ml-5 rounded-xl max-w-[175px] aspect-square object-cover mt-10' />
                      </div>
                      <div className='mt-10 mr-10 w-2/3 flex-row items-center justify-center'>
                        <h2 className='text-[var(--primary)] font-semibold text-2xl'>{event.title}</h2>
                        <div className='bg-[var(--border)] h-0.25 w-15 my-3' />
                        <p className='text-[var(--text)] line-clamp-3'>{event.description}</p>
                        <p className='text-[var(--text)] opacity-70 text-sm mt-2'>📍 {event.location}</p>
                        <p className='text-[var(--text)] opacity-70 text-sm'>📅 {event.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
