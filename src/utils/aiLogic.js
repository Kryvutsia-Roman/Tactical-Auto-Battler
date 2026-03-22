import { AVAILABLE_UNITS } from '../models/units';

// Функція для генерації ворожої армії
export function generateEnemyArmy(size) {
  const enemyArmy = [];
  for (let i = 0; i < size; i++) {
    // Випадково вибираємо юніта з доступних
    const randomIndex = Math.floor(Math.random() * AVAILABLE_UNITS.length);
    const unitTemplate = AVAILABLE_UNITS[randomIndex];
    // Створюємо копію юніта з повним HP
    const enemyUnit = {
      ...unitTemplate,
      hp: unitTemplate.maxHp
    };
    enemyArmy.push(enemyUnit);
  }
  return enemyArmy;
}