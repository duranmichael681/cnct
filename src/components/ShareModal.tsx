import { X, Link2, MessageCircle, Instagram } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postUrl: string
  isInModal?: boolean
}

export default function ShareModal({ isOpen, onClose, postUrl, isInModal = false }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleShareInstagram = () => {
    // Instagram doesn't have a direct share URL, so we copy the link and prompt user
    handleCopyLink()
    alert('Link copied! You can now paste it in your Instagram story or post.')
  }

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md p-4 ${isInModal ? 'z-[150]' : 'z-50'}`}
      onClick={onClose}
    >
      <div 
        className="bg-[var(--card-bg)] rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text)]"
          aria-label="Close share modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Share Event</h2>

        <div className="space-y-3">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--menucard)] transition-colors text-left"
          >
            <Link2 size={20} className="text-[var(--primary)]" />
            <div className="flex-1">
              <p className="font-semibold text-[var(--text)]">
                {copied ? 'Link Copied!' : 'Copy Link'}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Share this event link
              </p>
            </div>
          </button>

          <button
            onClick={handleShareTwitter}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--menucard)] transition-colors text-left"
          >
            <MessageCircle size={20} className="text-[var(--primary)]" />
            <div className="flex-1">
              <p className="font-semibold text-[var(--text)]">Share to Twitter</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Post on your Twitter feed
              </p>
            </div>
          </button>

          <button
            onClick={handleShareInstagram}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--menucard)] transition-colors text-left"
          >
            <Instagram size={20} className="text-[var(--primary)]" />
            <div className="flex-1">
              <p className="font-semibold text-[var(--text)]">Share to Instagram</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Copy link to share on Instagram
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
