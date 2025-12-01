import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import SideBar from '../components/SideBar'
import Footer from '../components/Footer'
import { MapPin, Calendar, User, Share2, ArrowLeft, MessageCircle, Heart } from 'lucide-react'
import ShareModal from '../components/ShareModal'
import { motion } from 'framer-motion'

interface EventDetail {
  id: string
  title: string
  body: string | null
  organizer_id: string
  building: string | null
  start_date: string
  end_date: string | null
  post_picture_url: string | null
  created_at: string
  is_private: boolean
  rsvps: number
  organizer_name: string
  organizer_profile_pic: string | null
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isRsvpd, setIsRsvpd] = useState(false)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [isRsvpLoading, setIsRsvpLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    document.title = 'CNCT | Event Details'
    checkAuthStatus()
    loadEventDetails()
  }, [eventId])

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsLoggedIn(!!session)
  }

  const handleBackClick = () => {
    if (isLoggedIn) {
      navigate('/home')
    } else {
      navigate('/')
    }
  }

  const loadEventDetails = async () => {
    if (!eventId) {
      setError('Event ID is missing')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Fetch event from posts table
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          body,
          organizer_id,
          building,
          start_date,
          end_date,
          post_picture_url,
          created_at,
          is_private,
          rsvps
        `)
        .eq('id', eventId)
        .single()

      if (postError) throw postError
      if (!post) throw new Error('Event not found')

      // Fetch organizer info
      const { data: organizer, error: organizerError } = await supabase
        .from('users')
        .select('first_name, last_name, profile_picture_url')
        .eq('id', post.organizer_id)
        .single()

      if (organizerError) throw organizerError

      // Combine data
      const eventDetail: EventDetail = {
        ...post,
        organizer_name: `${organizer?.first_name || ''} ${organizer?.last_name || ''}`.trim(),
        organizer_profile_pic: organizer?.profile_picture_url || null
      }

      setEvent(eventDetail)
      setRsvpCount(post.rsvps || 0)
      
      // Check if current user has RSVP'd (implement when backend is ready)
      // const { data: { user } } = await supabase.auth.getUser()
      // if (user) {
      //   const { data: rsvp } = await supabase
      //     .from('attendees')
      //     .select('id')
      //     .eq('posts_id', eventId)
      //     .eq('user_id', user.id)
      //     .single()
      //   setIsRsvpd(!!rsvp)
      // }

    } catch (err: any) {
      console.error('Error loading event:', err)
      setError(err.message || 'Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async () => {
    setIsRsvpLoading(true)
    try {
      // Simulate API call - implement when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newRsvpState = !isRsvpd
      setIsRsvpd(newRsvpState)
      setRsvpCount(prev => newRsvpState ? prev + 1 : prev - 1)

      // TODO: Make actual API call
      // const { data: { user } } = await supabase.auth.getUser()
      // if (newRsvpState) {
      //   await supabase.from('attendees').insert({ posts_id: eventId, user_id: user.id })
      // } else {
      //   await supabase.from('attendees').delete().match({ posts_id: eventId, user_id: user.id })
      // }
    } catch (error) {
      console.error('Failed to RSVP:', error)
    } finally {
      setIsRsvpLoading(false)
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
              <p className="text-[var(--text)]">Loading event...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px] flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Event Not Found</h1>
              <p className="text-[var(--text-secondary)] mb-6">{error || 'This event may have been deleted or made private.'}</p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  const postUrl = `${window.location.origin}/event/${event.id}`

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <div className="flex flex-1">
        <SideBar />
        
        <main className="flex-1 p-6 pb-24 md:pb-6 md:ml-[70px]">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[var(--card-bg)] rounded-xl shadow-lg overflow-hidden"
            >
              {/* Event Image */}
              {event.post_picture_url ? (
                <div className="w-full aspect-video md:aspect-[21/9] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20">
                  <img 
                    src={event.post_picture_url} 
                    alt={event.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video md:aspect-[21/9] bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--tertiary)]/20 flex items-center justify-center">
                  <Calendar size={80} className="text-[var(--primary)] opacity-50" />
                </div>
              )}

              {/* Event Content */}
              <div className="p-4 md:p-6 lg:p-8">
                {/* Event Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text)] mb-4 break-words">
                  {event.title}
                </h1>

                {/* Organizer Info */}
                <div 
                  className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity w-fit"
                  onClick={() => navigate(`/profile/${event.organizer_id}`)}
                >
                  {event.organizer_profile_pic ? (
                    <img 
                      src={event.organizer_profile_pic} 
                      alt={event.organizer_name} 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0" 
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] rounded-full flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-[var(--text-secondary)]">Organized by</p>
                    <p className="font-bold text-sm md:text-base text-[var(--text)] hover:text-[var(--primary)] transition-colors truncate">
                      {event.organizer_name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar size={24} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Date & Time</p>
                      <p className="font-semibold text-[var(--text)]">{formatDate(event.start_date)}</p>
                      {event.end_date && (
                        <p className="text-sm text-[var(--text-secondary)]">
                          Ends: {formatTime(event.end_date)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={24} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Location</p>
                      <p className="font-semibold text-[var(--text)]">
                        {event.building || 'Location TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User size={24} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Attendees</p>
                      <p className="font-semibold text-[var(--text)]">
                        {rsvpCount} {rsvpCount === 1 ? 'person' : 'people'} going
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                {event.body && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[var(--text)] mb-3">About This Event</h2>
                    <p className="text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                      {event.body}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={handleRSVP}
                    disabled={isRsvpLoading}
                    className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRsvpd
                        ? 'bg-[var(--secondary)] text-[var(--text)] border-2 border-[var(--primary)]'
                        : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                    }`}
                  >
                    <Heart size={20} className={isRsvpd ? 'fill-current' : ''} />
                    {isRsvpLoading ? 'Loading...' : isRsvpd ? 'Going' : 'RSVP'}
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--background)] border-2 border-[var(--border)] text-[var(--text)] font-semibold rounded-lg hover:bg-[var(--menucard)] transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Share2 size={20} />
                    Share
                  </button>

                  <button
                    onClick={() => {/* TODO: Scroll to comments or open comments modal */}}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--background)] border-2 border-[var(--border)] text-[var(--text)] font-semibold rounded-lg hover:bg-[var(--menucard)] transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageCircle size={20} />
                    Comments
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postUrl={postUrl}
      />
    </div>
  )
}
