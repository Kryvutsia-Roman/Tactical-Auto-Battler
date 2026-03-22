import { AVAILABLE_UNITS } from '../models/units';
import UnitCard from './UnitCard';

export default function SetupPanel({ selectedUnitId, onSelectUnit }) {
  return (
    <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700 mb-6">
      <h3 className="text-lg font-bold text-yellow-500 mb-3 text-center uppercase tracking-wider">
        Твої резерви (Обери загін)
      </h3>
      
      <div className="flex gap-4 justify-center flex-wrap">
        {AVAILABLE_UNITS.map(unit => (
          <UnitCard
            key={unit.id}
            unit={unit}
            isSelected={selectedUnitId === unit.id}
            onClick={() => onSelectUnit(unit.id)}
          />
        ))}
      </div>
    </div>
  );
}