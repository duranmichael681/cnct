const mockGroups = [
  { name: "Volleyball Events" },
  { name: "Art Club" },
  { name: "Tech Talks" },
];

export default function GroupList() {
  return (
    <div className="w-full max-w-full p-4 bg-[var(--menucard)] dark:bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-4">
        Groups
      </h2>
      <div className="flex flex-col gap-3">
        {mockGroups.map((g) => (
          <div
            key={g.name}
            className="p-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] dark:text-[var(--secondary)] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base break-words"
          >
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}