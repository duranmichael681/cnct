interface GroupListProps {
  groups?: string[];
}

const GroupList: React.FC<GroupListProps> = ({ groups = [] }) => {
  return (
    <div className="group-list absolute top-8 right-8 w-60">
      <h2 className="text-white text-5xl font-bold mb-6">Groups</h2>
      <ul className="space-y-4">
        {groups.map((group, index) => (
          <li
            key={index}
            className="text-white text-2xl font-bold text-center bg-sky-950 rounded-lg py-2"
          >
            {group}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
