import { useEffect, useRef, useState } from 'react';

export default function UnitCard({ unit, onClick, isSelected }) {
  const [hpBlink, setHpBlink] = useState(false);
  const prevHp = useRef(unit ? unit.hp : null);

  useEffect(() => {
    if (unit && prevHp.current !== null && unit.hp < prevHp.current) {
      setHpBlink(true);
      const timeout = setTimeout(() => setHpBlink(false), 500);
      return () => clearTimeout(timeout);
    }
    prevHp.current = unit ? unit.hp : null;
  }, [unit && unit.hp]);

  if (!unit) {
    return (
      <div 
        onClick={onClick}
        className="w-24 h-32 border-2 border-dashed border-stone-600 rounded bg-stone-800/50 flex items-center justify-center text-stone-500 text-sm cursor-pointer hover:bg-stone-700 transition-colors"
      >
        Пусто
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`w-24 h-32 p-2 rounded border-2 cursor-pointer flex flex-col items-center justify-between transition-all duration-200 ${
        isSelected 
          ? 'border-yellow-400 bg-stone-700 shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-105' 
          : 'border-stone-500 bg-stone-800 hover:border-yellow-600'
      }`}
    >
      <div className="text-3xl mt-1">{unit.icon}</div>
      <div className="text-[11px] font-bold text-center leading-tight">{unit.name}</div>
      {/* Смужка характеристик */}
      <div className="w-full text-[10px] flex justify-between bg-stone-900 px-1 py-0.5 rounded">
        <span className="text-red-400">⚔️ {unit.attack}</span>
        <span className={`❤️ ${unit.hp < unit.maxHp ? 'text-red-500' : 'text-green-400'} ${hpBlink ? 'animate-blink' : ''}`}>{unit.hp}</span>
      </div>
    </div>
  );
}