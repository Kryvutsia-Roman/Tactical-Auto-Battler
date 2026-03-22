import UnitCard from './UnitCard';

export default function Battlefield({ playerSlots, enemySlots, selectedUnitId, onPlaceUnit, onClearField, phase }) {
  const isSetupPhase = phase === 'SETUP';

  return (
    <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
      <h3 className="text-lg font-bold text-yellow-500 mb-4 text-center uppercase tracking-wider">
        Поле бою
      </h3>

      {/* Ворожі ряди */}
      <div className="mb-4">
        <h4 className="text-sm text-red-400 mb-2 text-center">Ворог</h4>
        <div className="flex flex-col gap-2 items-center">
          {enemySlots.map((row, rowIdx) => (
            <div className="flex gap-2 justify-center" key={`enemy-row-${rowIdx}`}>
              {row.map((unit, colIdx) => (
                <UnitCard
                  key={`enemy-${rowIdx}-${colIdx}`}
                  unit={unit}
                  onClick={() => {}}
                  isSelected={false}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Ряди гравця */}
      <div>
        <h4 className="text-sm text-green-400 mb-2 text-center">Твої війська</h4>
        <div className="flex flex-col gap-2 items-center">
          {playerSlots.map((row, rowIdx) => (
            <div className="flex gap-2 justify-center" key={`player-row-${rowIdx}`}>
              {row.map((unit, colIdx) => (
                <UnitCard
                  key={`player-${rowIdx}-${colIdx}`}
                  unit={unit}
                  onClick={() => {
                    if (isSetupPhase && selectedUnitId) {
                      onPlaceUnit(rowIdx, colIdx);
                    }
                  }}
                  isSelected={false}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {isSetupPhase && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onClearField}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-bold transition-colors"
          >
            Очистити поле
          </button>
        </div>
      )}
    </div>
  );
}