import { useState } from "react";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [selectedFAQ, setSelectedFAQ] = useState<null | (typeof faqs)[number]>(
    null
  );

  const handleClose = () => setSelectedFAQ(null);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SideBar />

      {/* Main content shifted so it's not under the fixed sidebar on desktop */}
      <div className="ml-0 md:ml-[70px] flex-1">
        {/* Hero */}
        <div className="h-1/4 bg-[#B5A642] m-4 sm:m-8 rounded-xl rounded-b-none flex flex-col justify-center items-center px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-[var(--background)]">
            How can we help with CNCT?
          </h1>
        </div>

        {/* Sub-heading section (using your outline spot) */}
        <div className="-mt-4 sm:-mt-8 h-1/4 flex-col border-4 border-[#B5A642] m-4 sm:m-8 rounded-xl flex justify-center items-center px-6 py-10 rounded-t-none">
          <p className="text-lg sm:text-xl font-thin text-center -mt-4 pt-2 text-[var(--text)]">
            Learn how to create plans, join events, and make the most out of
            CNCT at FIU.
          </p>
        </div>

        {/* Featured Articles Title */}
        <div className="flex items-center justify-center mt-2">
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text)]">
            Featured Questions
          </h1>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6 pb-16">
          {faqs.map((faq) => (
            <motion.button
              key={faq.id}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.03, backgroundColor: "#D3D3D3" }}
              className="w-full p-5 rounded-xl flex flex-col items-center shadow-lg bg-[var(--menucard)] cursor-pointer"
              onClick={() => setSelectedFAQ(faq)}
            >
              <span className="text-lg font-bold text-[var(--text)] text-center">
                {faq.question}
              </span>
              <span className="text-sm text-gray-500 mt-1 text-center">
                {faq.summary}
              </span>
              <span className="text-xs text-[var(--primary)] mt-3">
                Click to learn more
              </span>
            </motion.button>
          ))}
        </div>

        <Footer />
      </div>

      {/* Modal / Popup for selected FAQ */}
      <AnimatePresence>
        {selectedFAQ && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="bg-[var(--background)] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-4 text-[var(--text)]/60 hover:text-[var(--text)] text-xl font-bold"
                aria-label="Close FAQ details"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-3 text-[var(--text)]">
                {selectedFAQ.question}
              </h2>
              <p className="text-sm text-[var(--text)]/70 mb-4">
                {selectedFAQ.summary}
              </p>

              <div className="space-y-3 text-[var(--text)] text-sm sm:text-base">
                {selectedFAQ.details}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 12 FAQ items for CNCT
 * - question: Title on the card
 * - summary: Short description on the card / modal subtitle
 * - details: JSX rendered inside the modal (can have lists, paragraphs, etc.)
 */
const faqs = [
  {
    id: 1,
    question: "What is CNCT?",
    summary:
      "A platform for FIU students to create and join on-campus plans and events.",
    details: (
      <>
        <p>
          CNCT is an event and plan gatherer built specifically for FIU
          students. You can join existing events or create your own meetups for
          things like volleyball, study sessions, sparring, running, or casual
          hangouts.
        </p>
        <p>
          Each plan includes its own chat thread and a “Who&apos;s Going” list
          so you always know who&apos;s attending and can coordinate details
          easily.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "Who can use CNCT?",
    summary:
      "Access is limited to verified FIU students to keep events safe and focused.",
    details: (
      <>
        <p>
          CNCT is designed for current FIU students. We use FIU email
          verification (and eventually single sign-on) to make sure only real
          students can create or join events.
        </p>
        <p>
          This keeps the community focused, safer, and more relevant to student
          life on campus.
        </p>
      </>
    ),
  },
  {
    id: 3,
    question: "How do I join an event?",
    summary: "Use the RSVP button on a plan to be added to the list and chat.",
    details: (
      <>
        <ol className="list-decimal list-inside space-y-1">
          <li>Browse events on the Home or Discover page.</li>
          <li>Click on a plan that interests you to see more details.</li>
          <li>
            Tap the <strong>RSVP / “I&apos;m Going”</strong> button.
          </li>
        </ol>
        <p className="mt-2">
          Once you RSVP, you&apos;ll appear in the “Who&apos;s Going” list and
          gain access to the event&apos;s chat thread so you can coordinate
          timing, rides, or any last-minute updates.
        </p>
      </>
    ),
  },
  {
    id: 4,
    question: "How do I create my own plan or event?",
    summary: "Start a meetup in a few steps using the Create page.",
    details: (
      <>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Go to the <strong>Create</strong> tab in the sidebar.
          </li>
          <li>
            Choose a clear title (e.g., “Rec Center Volleyball Run”, “CS Study
            Jam”).
          </li>
          <li>
            Set the date, time, and location (or “TBD” if it&apos;s flexible).
          </li>
          <li>Add a short description so people know what to expect.</li>
          <li>Choose whether it&apos;s public or invite-only.</li>
        </ol>
        <p className="mt-2">
          Once you publish, your plan becomes discoverable (if public) and gets
          its own chat and attendee list.
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: "What is the “Who’s Going” list?",
    summary: "A list of all students who have RSVP’d to a specific event.",
    details: (
      <>
        <p>
          The “Who&apos;s Going” list shows everyone who has RSVP&apos;d to a
          plan. It helps reduce awkwardness and lets you see if friends or
          familiar faces are attending.
        </p>
        <p>
          Event creators can also use this list to cap attendance or decide if
          they want to run the event based on interest.
        </p>
      </>
    ),
  },
  {
    id: 6,
    question: "What’s the difference between public and private events?",
    summary: "Public = visible to all FIU students; Private = invite-only.",
    details: (
      <>
        <p>
          <strong>Public events</strong> are visible to any FIU student using
          CNCT. Anyone can view the details and RSVP unless you set a cap.
        </p>
        <p>
          <strong>Private events</strong> are invite-only. Only students with a
          direct invite or link (depending on your settings) can view and join
          the event.
        </p>
        <p>
          Use private events for smaller groups, club leadership meetings, or
          invite-only hangouts.
        </p>
      </>
    ),
  },
  {
    id: 7,
    question: "How does event chat work?",
    summary: "Each event has a dedicated message thread for coordination.",
    details: (
      <>
        <p>
          Once you RSVP to an event, you get access to its built-in chat thread.
          You can:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Ask questions about timing, gear, or location.</li>
          <li>Coordinate rides or meeting spots.</li>
          <li>Share updates if something changes last-minute.</li>
        </ul>
        <p className="mt-2">
          If you leave the event (cancel your RSVP), you&apos;ll also leave the
          chat.
        </p>
      </>
    ),
  },
  {
    id: 8,
    question: "How do I cancel my RSVP or leave an event?",
    summary: "You can un-RSVP and leave the chat in one step.",
    details: (
      <>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open the event you previously joined.</li>
          <li>
            Click the <strong>“Leave Event”</strong> or{" "}
            <strong>“Cancel RSVP”</strong> button.
          </li>
        </ol>
        <p className="mt-2">
          You&apos;ll be removed from the “Who&apos;s Going” list and
          you&apos;ll lose access to the event chat. This helps organizers know
          who is actually still planning to attend.
        </p>
      </>
    ),
  },
  {
    id: 9,
    question: "What types of events are allowed on CNCT?",
    summary:
      "Social, fitness, academic, and hobby-based meetups that are safe and respectful.",
    details: (
      <>
        <p>In general, events should fit one or more of these categories:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>
            Sports & fitness (volleyball, lifting, running groups, sparring,
            etc.)
          </li>
          <li>Study groups, project sessions, tutoring meetups</li>
          <li>Club events, information sessions, collabs</li>
          <li>Hobby or interest groups (gaming, music, cars, etc.)</li>
        </ul>
        <p className="mt-2">
          Events that involve harassment, illegal activity, or unsafe behavior
          are not allowed and can be reported.
        </p>
      </>
    ),
  },
  {
    id: 10,
    question: "Is CNCT free to use?",
    summary: "Yes. CNCT is free for FIU students.",
    details: (
      <>
        <p>
          CNCT does not charge students to create or join events. There are no
          subscription fees, listing fees, or per-event costs for normal usage.
        </p>
        <p>
          If an event itself has a cost (for example, a paid class or ticketed
          outing), that will be clearly described by the event organizer.
        </p>
      </>
    ),
  },
  {
    id: 11,
    question: "What if I’m new or shy about joining events?",
    summary: "There are plenty of low-pressure and beginner-friendly plans.",
    details: (
      <>
        <p>
          You&apos;re exactly the type of person CNCT is trying to help. Many
          events are beginner-friendly and expect solo attendees.
        </p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>
            Look for descriptions that say things like “all levels welcome”.
          </li>
          <li>
            Start with smaller groups like study sessions or casual workouts.
          </li>
          <li>Use the chat to introduce yourself before you show up.</li>
        </ul>
        <p className="mt-2">
          Over time, you&apos;ll start recognizing faces and building a small
          community.
        </p>
      </>
    ),
  },
  {
    id: 12,
    question: "How do I report an issue or unsafe behavior?",
    summary:
      "Use in-app reporting and reach out to organizers or admins if needed.",
    details: (
      <>
        <p>
          If you see something that breaks community guidelines or feels unsafe:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>
            Report the event or user using the in-app report option (when
            available).
          </li>
          <li>
            Leave the event and avoid further interaction if you feel
            uncomfortable.
          </li>
          <li>
            For serious safety concerns, contact campus security or the
            appropriate FIU office.
          </li>
        </ul>
        <p className="mt-2">
          CNCT is meant to make campus more connected and safe, not the
          opposite. Your feedback helps keep the platform healthy.
        </p>
      </>
    ),
  },
];
