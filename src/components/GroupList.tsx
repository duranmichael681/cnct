const mockGroups = [
  { name: "Volleyball Events" },
  { name: "Art Club" },
  { name: "Tech Talks" },
];

export default function GroupList() {
  return (
    <div className="p-4 bg-[var(--menucard)] rounded-lg">
      <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-4">
        Groups
      </h2>
      <div className="flex flex-col gap-3">
        {mockGroups.map((g) => (
          <div
            key={g.name}
            className="p-3 rounded-lg bg-[var(--primary)] text-[var(--background)] font-semibold"
          >
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}