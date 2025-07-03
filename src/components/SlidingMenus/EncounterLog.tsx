import useEncounterLog from "../../hooks/useEncounterLog";

const EncounterLog = () => {
  const { log } = useEncounterLog();

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Encounters</h2>
      {log.length === 0 ? (
        <p className="text-center text-gray-500">No encounters yet.</p>
      ) : (
        <div className="space-y-4">
          {log.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-2 rounded-lg bg-primary"
            >
              <img
                src={entry.pokemonSprite}
                alt={entry.pokemonName}
                className="w-16 h-16 object-contain"
              />
              <div className="flex-grow">
                <p className="font-bold">{entry.pokemonName}</p>
                <p className="text-sm">Throws: {entry.throws}</p>
                <p className="text-sm">Status: {entry.status}</p>
                {entry.status === "caught" && (
                  <p className="text-sm">Stardust: +{entry.stardust}</p>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EncounterLog;
