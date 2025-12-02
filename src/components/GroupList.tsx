interface Group {
  id?: number;
  name: string;
}

interface GroupListProps {
  groups?: Group[];
}

const mockGroups = [
  { name: "Volleyball Events" },
  { name: "Art Club" },
  { name: "Tech Talks" },
];

export default function GroupList({ groups = mockGroups }: GroupListProps) {
  return (
    <div className="flex flex-col gap-2">
      {groups.map((g, index) => (
        <div
          key={g.id || index}
          className="p-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer text-sm break-words"
          onClick={() => {
            // TODO: Navigate to group page when groups feature is implemented
            console.log('Clicked group:', g.name, g.id);
          }}
        >
          {g.name}
        </div>
      ))}
    </div>
  );
}