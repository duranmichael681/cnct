import React from "react";

interface StatsSectionProps {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  showSwitch?: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  postsCount = 0,
  followersCount = 0,
  followingCount = 0,
  showSwitch = true,
}) => {
  return (
    <div className="stats-section absolute top-[765px] left-[19px] flex flex-col items-start space-y-4">
      {/* Posts Count */}
      <div className="text-white font-rubik font-bold text-xl">
        Posts: {postsCount}
      </div>

      {/* Followers Count */}
      <div className="text-white font-rubik font-bold text-xl">
        Followers: {followersCount}
      </div>

      {/* Following Count */}
      <div className="text-white font-rubik font-bold text-xl">
        Following: {followingCount}
      </div>

      {/* Switch */}
      {showSwitch && (
        <div className="switch relative w-12 h-8 bg-white rounded-full mt-4 flex items-center justify-end p-1">
          <div className="handle w-6 h-6 bg-black rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default StatsSection;
