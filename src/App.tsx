// App.tsx
import './index.css';
import ProfileHeader from './components/ProfileHeader';
import PostCard from './components/PostCard';
import SideBar from './components/SideBar';
import GroupList from './components/GroupList';

export default function App() {
  return (
    <div className="public-profile-light relative w-full min-h-screen bg-amber-50 overflow-hidden">

      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="main-content absolute left-[83px] top-0 w-[1645px]">
        {/* Header / Backdrop */}
        <div className="header-bg w-full h-80 bg-blue-950" />

        {/* Groups Section */}
        <GroupList groups={['Volleyball Events', 'Chess Club', 'Hackathon Team']} />

        {/* Profile Header */}
        <ProfileHeader
          name="Mario Casas"
          pronouns="He/Him"
          major="Computer Science"
          profileImage="https://placehold.co/144x144"
          bio="Hello! I am a Senior in computer science at FIU. I love to play volleyball and Tetris on my free time."
        />

        {/* Posts Section in Grid */}
        <div className="posts-grid mt-6 px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostCard
            profileName="Profile Name"
            profileImage="https://placehold.co/32x32"
            postImage="https://placehold.co/694x384"
            eventDate="MM/DD/YY"
            eventLocation="Location Of The Event"
            commentsCount={0}
            rsvpCount={0}
            caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
          />
          <PostCard
            profileName="Profile Name"
            profileImage="https://placehold.co/32x32"
            postImage="https://placehold.co/694x384"
            eventDate="MM/DD/YY"
            eventLocation="Location Of The Event"
            commentsCount={0}
            rsvpCount={0}
            caption="Another post example caption here..."
          />
          {/* Add more PostCards here */}
        </div>

        {/* Switch (optional) */}
        <div className="switch absolute left-[19px] top-[765px] w-12 h-8 px-1 py-0.5 bg-white rounded-full inline-flex justify-end items-center rotate-[1.19deg] origin-top-left">
          <div className="switch-handle flex-1 relative">
            <div className="handle-target absolute left-[7.8px] top-[-9.8px] inline-flex justify-center items-center">
              <div className="handle-state inline-flex flex-col justify-center items-center gap-2 rounded-full">
                <div className="handle-shape w-6 h-6 bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
