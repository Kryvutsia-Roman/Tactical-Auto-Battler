import { useReducer, useEffect, useCallback } from 'react';
import { DAMAGE_MULTIPLIERS } from '../models/units';

const initialState = {
  playerArmy: [],
  enemyArmy: [],
  battleLog: [],
  battleStatus: 'not_started',
  turnSide: 'player'
};

function battleReducer(state, action) {
  switch (action.type) {
    case 'INIT_ARMIES':
      return {
        ...state,
        playerArmy: [...action.playerArmy],
        enemyArmy: [...action.enemyArmy],
        battleLog: [],
        battleStatus: action.enemyArmy.length > 0 ? 'ongoing' : 'not_started',
        turnSide: 'player'
      };
    case 'BATTLE_TICK':
      const { newPlayer, newEnemy, newLog, nextTurnSide } = action.payload;
      // Для багаторядної структури: перевіряємо всі клітинки
      const playerAlive = newPlayer.flat().some(unit => unit && unit.hp > 0);
      const enemyAlive = newEnemy.flat().some(unit => unit && unit.hp > 0);
      let status = 'ongoing';
      if (!playerAlive) status = 'lose';
      else if (!enemyAlive) status = 'win';
      return {
        ...state,
        playerArmy: newPlayer,
        enemyArmy: newEnemy,
        battleLog: [...state.battleLog, ...newLog],
        battleStatus: status,
        turnSide: nextTurnSide ?? state.turnSide
      };
    default:
      return state;
  }
}

export function useBattle(playerArmy, enemyArmy, tickMs = 1800) {
  const [state, dispatch] = useReducer(battleReducer, initialState);


  useEffect(() => {
    dispatch({ type: 'INIT_ARMIES', playerArmy, enemyArmy });
  }, [playerArmy, enemyArmy]);

  const performAttack = useCallback((attacker, defender, attackerName, defenderName) => {
    const multiplier = DAMAGE_MULTIPLIERS[attacker.type][defender.type] || 1;
    const damage = Math.floor(attacker.attack * multiplier);
    const newHp = Math.max(0, defender.hp - damage);
    const logMessage = `${attackerName} наносить ${damage} урону ${defenderName} (множник: ${multiplier})`;
    return { newHp, logMessage };
  }, []);


  // Повертає індекс першого "живого" ряду для гравця (зверху вниз)
  function getFirstAlivePlayerRow(army) {
    for (let r = 0; r < army.length; r++) {
      if (army[r].some(unit => unit && unit.hp > 0)) return r;
    }
    return null;
  }

  // Повертає індекс першого "живого" ряду для ворога (знизу вгору)
  function getFirstAliveEnemyRow(army) {
    for (let r = army.length - 1; r >= 0; r--) {
      if (army[r].some(unit => unit && unit.hp > 0)) return r;
    }
    return null;
  }

  // Перевіряє, чи у армії залишилися живі юніти
  function isArmyAlive(army) {
    return army.some(row => row.some(unit => unit && unit.hp > 0));
  }

  // Знаходить найближчу живу ціль у ряду відносно позиції атакуючого
  function findClosestAliveTargetIndex(row, fromCol) {
    let bestIdx = null;
    let bestDistance = Infinity;

    for (let i = 0; i < row.length; i++) {
      if (!row[i] || row[i].hp <= 0) continue;
      const distance = Math.abs(i - fromCol);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIdx = i;
      }
    }

    return bestIdx;
  }

  const battleTick = useCallback(() => {
    const newPlayer = state.playerArmy.map(row => [...row]);
    const newEnemy = state.enemyArmy.map(row => [...row]);
    const newLog = [];


    // Визначаємо активний ряд для кожної сторони
    const playerRowIdx = getFirstAlivePlayerRow(newPlayer);
    const enemyRowIdx = getFirstAliveEnemyRow(newEnemy);

    // Бій завершується лише якщо у ВСІХ рядах однієї зі сторін немає живих юнітів
    if (!isArmyAlive(newPlayer) || !isArmyAlive(newEnemy)) {
      dispatch({ type: 'BATTLE_TICK', payload: { newPlayer, newEnemy, newLog } });
      return;
    }

    // Б'ються лише активні ряди
    const playerRow = newPlayer[playerRowIdx];
    const enemyRow = newEnemy[enemyRowIdx];

    const nextTurnSide = state.turnSide === 'player' ? 'enemy' : 'player';

    if (state.turnSide === 'player') {
      // За тік виконується лише одна атака гравця для наочності
      const attackerIdx = findClosestAliveTargetIndex(playerRow, 0);
      if (attackerIdx !== null) {
        const targetIdx = findClosestAliveTargetIndex(enemyRow, attackerIdx);
        if (targetIdx !== null) {
          const attacker = playerRow[attackerIdx];
          const target = enemyRow[targetIdx];
          const { newHp, logMessage } = performAttack(attacker, target, attacker.name, target.name);
          enemyRow[targetIdx] = { ...target, hp: newHp };
          newLog.push(logMessage);
          if (newHp <= 0) enemyRow[targetIdx] = null;
        }
      }
    } else {
      // За тік виконується лише одна атака ворога для наочності
      const attackerIdx = findClosestAliveTargetIndex(enemyRow, 0);
      if (attackerIdx !== null) {
        const targetIdx = findClosestAliveTargetIndex(playerRow, attackerIdx);
        if (targetIdx !== null) {
          const attacker = enemyRow[attackerIdx];
          const target = playerRow[targetIdx];
          const { newHp, logMessage } = performAttack(attacker, target, attacker.name, target.name);
          playerRow[targetIdx] = { ...target, hp: newHp };
          newLog.push(logMessage);
          if (newHp <= 0) playerRow[targetIdx] = null;
        }
      }
    }

    newPlayer[playerRowIdx] = playerRow;
    newEnemy[enemyRowIdx] = enemyRow;

    dispatch({ type: 'BATTLE_TICK', payload: { newPlayer, newEnemy, newLog, nextTurnSide } });
  }, [state.playerArmy, state.enemyArmy, state.turnSide, performAttack]);

  useEffect(() => {
    if (state.battleStatus === 'ongoing') {
      // Повільніший, покроковий темп для візуального сприйняття бою
      const interval = setInterval(battleTick, tickMs);
      return () => clearInterval(interval);
    }
  }, [state.battleStatus, battleTick, tickMs]);

  return {
    playerArmy: state.playerArmy,
    enemyArmy: state.enemyArmy,
    battleLog: state.battleLog,
    battleStatus: state.battleStatus
  };
}