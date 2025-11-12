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
    <div className="w-full max-w-full p-4 bg-[var(--menucard)] dark:bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-4">
        Groups
      </h2>
      {/* Scrollable container - max 3 groups visible */}
      <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-[var(--menucard)]">
        {groups.map((g, index) => (
          <div
            key={g.id || index}
            className="p-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base break-words flex-shrink-0"
          >
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}