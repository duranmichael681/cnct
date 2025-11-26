import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I create an event post?',
    answer: 'Navigate to the Create page using the sidebar or mobile navigation. Fill in the event details including title, description, location, time, and tags. You can also upload up to 3 images. Click "Save" to publish your event.',
  },
  {
    question: 'How do I edit my post?',
    answer: 'Go to your Profile page where all your posts are displayed. Click the three-dot menu (⋮) on any of your posts and select "Edit Post". Update the details in the modal that appears and click "Save Changes" to apply your edits.',
  },
  {
    question: 'How do I delete my post?',
    answer: 'From your Profile page, click the three-dot menu (⋮) on the post you want to delete and select "Delete Post". Confirm the deletion when prompted. Note: This action cannot be undone.',
  },
  {
    question: 'How do I RSVP to an event?',
    answer: 'Click the link icon (🔗) on any event card to RSVP. The icon will fill with gold color to indicate you\'re attending. Click again to cancel your RSVP. When you hover over an RSVP\'d event, you\'ll see an unlink icon to easily cancel.',
  },
  {
    question: 'How do I filter content on my feed?',
    answer: 'Use the Sort/Filter options at the top of your feed. You can sort by newest, oldest, or filter by specific tags. On the Discover page, you can search for events by keywords or filter by categories that match your interests.',
  },
  {
    question: 'Can I advertise non-FIU related events?',
    answer: 'No. CNCT is exclusively for FIU campus events and activities. All posts must be related to FIU students, clubs, organizations, or campus life. Posts violating this policy may be removed and repeated violations can result in account restrictions.',
  },
  {
    question: 'How do I comment on an event?',
    answer: 'Click on any event card to expand it, then click the comment icon or "Show Comments" button. Type your comment in the input field at the bottom. You can also add emojis using the smiley face button (😊). Your comments will appear at the top of the comment list.',
  },
  {
    question: 'Can I edit or delete my comments?',
    answer: 'Yes! Your own comments will have edit (pencil) and delete (trash) icons next to them. Click edit to modify your comment, or delete to remove it permanently. You can also upvote or downvote other comments.',
  },
  {
    question: 'What does "Not Interested" do?',
    answer: 'On the Home and Discover pages, you can mark posts as "Not Interested" from the three-dot menu. This helps us personalize your feed by showing less content with similar tags. This option is not available on profile pages.',
  },
  {
    question: 'How do I report inappropriate content?',
    answer: 'Click the three-dot menu (⋮) on any post and select "Report". The post will be flagged for moderator review. You can also block users from the same menu if you don\'t want to see their content.',
  },
  {
    question: 'How do I share an event?',
    answer: 'Click the share icon or select "Share" from the three-dot menu. You can copy the event link, share to Twitter, or share to Instagram. The share modal provides multiple options for spreading the word about campus events.',
  },
  {
    question: 'How do I change my profile picture or information?',
    answer: 'Go to Settings from the sidebar. You can update your profile picture, bio, interests, and other personal information. Changes are saved automatically. You can also change your password from the Settings page.',
  },
  {
    question: 'What are tags and how do I use them?',
    answer: 'Tags are keywords (like #Volleyball, #StudyGroup) that categorize events. When creating a post, add relevant tags separated by commas. Users can click on tags to see similar events, and tags help our algorithm recommend content you\'ll enjoy.',
  },
  {
    question: 'How do I see who\'s attending an event?',
    answer: 'The RSVP count shows how many people are attending. In the future, you\'ll be able to click on this to see a full list of attendees. This feature is currently in development.',
  },
  {
    question: 'Can I save drafts of my events?',
    answer: 'Yes! On the Create page, click "Save Draft" to store your work-in-progress. Your draft will be saved locally and automatically loaded next time you visit the Create page. Click "Clear Draft" to start fresh.',
  },
];

export default function FAQ() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  useEffect(() => {
    document.title = 'CNCT | FAQ';
  }, []);
  
  // Show navbar if user is logged in, UNLESS explicitly coming from landing page footer
  const fromLanding = location.state?.fromLanding === true;
  const isLoggedIn = sessionStorage.getItem('hasVisitedApp') === 'true' || 
                     location.pathname.includes('/home') || 
                     location.pathname.includes('/profile');
  
  // Only hide navbar if coming from landing AND not logged in
  const showNavbar = isLoggedIn && !fromLanding;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {showNavbar && <SideBar />}
      <div className={`flex-1 overflow-y-auto ${showNavbar ? 'pb-24 md:pb-0 md:ml-[70px]' : ''}`}>
        <div className="max-w-[900px] mx-auto px-6 sm:px-12 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
              Frequently Asked <span className="text-[var(--primary)]">Questions</span>
            </h1>
            <div className="w-32 h-1 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Find answers to common questions about using CNCT. Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--menucard)] transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-[var(--text)] pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp size={24} className="text-[var(--primary)] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={24} className="text-[var(--primary)] flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-[var(--text)] leading-relaxed border-t border-[var(--border)] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center p-8 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Still have questions?</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              We're here to help! Reach out to our team for additional support.
            </p>
            <button 
              onClick={() => window.location.href = 'mailto:support@cnct.com?subject=Support Request'}
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
