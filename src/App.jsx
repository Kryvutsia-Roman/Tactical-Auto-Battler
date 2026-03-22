import { useState, useEffect } from 'react';
import SetupPanel from './components/SetupPanel';
import Battlefield from './components/Battlefield';
import BattleLog from './components/BattleLog';
import { useBattle } from './hooks/useBattle';
import { AVAILABLE_UNITS } from './models/units';
import { generateEnemyArmy } from './utils/aiLogic';

const PHASES = {
  SETUP: 'SETUP',
  BATTLE: 'BATTLE',
  RESULT: 'RESULT'
};

const SPEED_PRESETS = [
  { label: 'Повільно', value: 2600 },
  { label: 'Нормально', value: 1800 },
  { label: 'Швидко', value: 900 }
];

function App() {
  const [currentPhase, setCurrentPhase] = useState(PHASES.SETUP);
  const [battleResult, setBattleResult] = useState(null);
  const [battleSpeedMs, setBattleSpeedMs] = useState(1800);
  
  // Стан для запам'ятовування, якого юніта зараз клікнув гравець у резерві
  const [selectedUnitId, setSelectedUnitId] = useState(null); 

  // Слоти гравця та ворога (3 ряди по 5)
  const EMPTY_ROW = () => Array(5).fill(null);
  const EMPTY_FIELD = () => Array(3).fill(0).map(EMPTY_ROW);
  const [playerSlots, setPlayerSlots] = useState(EMPTY_FIELD());
  const [enemySlots, setEnemySlots] = useState(EMPTY_FIELD());

  // Хук для бою: активується лише у фазі BATTLE
  const isBattlePhase = currentPhase === PHASES.BATTLE;
  const { playerArmy, enemyArmy, battleLog, battleStatus } = useBattle(
    isBattlePhase ? playerSlots : [],
    isBattlePhase ? enemySlots : [],
    battleSpeedMs
  );

  // Перевірка статусу бою
  useEffect(() => {
    if (battleStatus === 'win' || battleStatus === 'lose') {
      setBattleResult(battleStatus);
      setCurrentPhase(PHASES.RESULT);
    }
  }, [battleStatus]);

  // Розміщення юніта: можна перезаписувати, selectedUnitId не скидається
  const handlePlaceUnit = (rowIdx, colIdx) => {
    if (selectedUnitId) {
      const unit = AVAILABLE_UNITS.find(u => u.id === selectedUnitId);
      if (unit) {
        const newSlots = playerSlots.map(row => [...row]);
        newSlots[rowIdx][colIdx] = { ...unit, hp: unit.maxHp };
        setPlayerSlots(newSlots);
        // selectedUnitId не скидаємо, щоб можна було ставити багато разів
      }
    }
  };

  const handleClearField = () => {
    setPlayerSlots(EMPTY_FIELD());
    setSelectedUnitId(null);
  };

  const startBattle = () => {
    // Підрахунок кількості юнітів
    const playerCount = playerSlots.flat().filter(unit => unit).length;
    if (playerCount > 0) {
      // Генеруємо ворожу армію з такою ж кількістю юнітів, розподіляємо по рядах
      const flatEnemy = generateEnemyArmy(playerCount);
      const enemyField = EMPTY_FIELD();
      let idx = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          if (idx < flatEnemy.length) {
            enemyField[r][c] = flatEnemy[idx++];
          }
        }
      }
      setEnemySlots(enemyField);
      setCurrentPhase(PHASES.BATTLE);
    } else {
      alert('Розмістіть хоча б одного юніта перед початком бою!');
    }
  };

  const resetGame = () => {
    setBattleResult(null);
    setCurrentPhase(PHASES.SETUP);
    setPlayerSlots(EMPTY_FIELD());
    setEnemySlots(EMPTY_FIELD());
    setSelectedUnitId(null);
  };

  const speedPercent = Math.round(((3000 - battleSpeedMs) / (3000 - 400)) * 100);

  // ...existing code...

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-500">Tactical Auto-Battler</h1>
        <p className="text-gray-400 mt-2">Лабораторна робота 6</p>
      </header>

      <main className="max-w-4xl mx-auto bg-stone-800 p-6 rounded-lg shadow-xl border border-stone-700">
        <div className="mb-6 p-4 rounded-lg border border-stone-600 bg-stone-900/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm text-stone-300">Швидкість бою</p>
              <p className="text-xs text-stone-400">Інтервал: {battleSpeedMs} мс | Темп: {speedPercent}%</p>
            </div>
            <div className="w-full md:w-80">
              <div className="mb-3 flex gap-2">
                {SPEED_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setBattleSpeedMs(preset.value)}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                      battleSpeedMs === preset.value
                        ? 'bg-yellow-500 text-stone-900 border-yellow-400'
                        : 'bg-stone-800 text-stone-300 border-stone-600 hover:bg-stone-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="400"
                max="3000"
                step="100"
                value={battleSpeedMs}
                onChange={(e) => setBattleSpeedMs(Number(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <div className="mt-1 flex justify-between text-xs text-stone-500">
                <span>Швидко</span>
                <span>Повільно</span>
              </div>
            </div>
          </div>
        </div>
        
        {currentPhase === PHASES.SETUP && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-center">Фаза розстановки військ</h2>
            
            {/* Панель вибору */}
            <SetupPanel 
              selectedUnitId={selectedUnitId} 
              onSelectUnit={setSelectedUnitId} 
            />

            {/* Поле бою */}
            <Battlefield
              playerSlots={playerSlots}
              enemySlots={enemySlots}
              selectedUnitId={selectedUnitId}
              onPlaceUnit={handlePlaceUnit}
              onClearField={handleClearField}
              phase={currentPhase}
            />

            <div className="flex justify-center mt-4">
              <button 
                onClick={startBattle}
                className="px-8 py-3 bg-red-800 hover:bg-red-700 rounded text-white font-bold transition-colors text-lg"
              >
                Почати бій!
              </button>
            </div>
          </div>
        )}

        {currentPhase === PHASES.BATTLE && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl text-center text-red-500">Бій триває... ⚔️</h2>
            
            {/* Поле бою */}
            <Battlefield
              playerSlots={playerArmy}
              enemySlots={enemyArmy}
              selectedUnitId={null}
              onPlaceUnit={() => {}}
              onClearField={() => {}}
              phase={currentPhase}
            />

            {/* Лог бою */}
            <BattleLog log={battleLog} />
          </div>
        )}

        {currentPhase === PHASES.RESULT && (
          <div className="text-center">
            <h2 className={`text-4xl font-bold mb-4 ${battleResult === 'win' ? 'text-green-500' : 'text-red-500'}`}>
              {battleResult === 'win' ? 'ПЕРЕМОГА!' : 'ПОРАЗКА'}
            </h2>
            <button 
              onClick={resetGame}
              className="mt-6 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-stone-900 font-bold transition-colors"
            >
              Спробувати знову
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;