export default function BattleLog({ log }) {
  return (
    <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700 max-h-64 overflow-y-auto">
      <h3 className="text-lg font-bold text-yellow-500 mb-3 text-center uppercase tracking-wider">
        Лог бою
      </h3>
      <div className="space-y-1 text-sm">
        {log.length === 0 ? (
          <p className="text-stone-500 italic">Бій ще не розпочався...</p>
        ) : (
          log.map((message, index) => (
            <div key={index} className="text-stone-300">
              {message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}