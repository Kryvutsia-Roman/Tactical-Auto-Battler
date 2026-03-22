// Типи юнітів
export const UNIT_TYPES = {
  SWORDS: 'Swords',
  SPEARS: 'Spears',
  CAVALRY: 'Cavalry',
  RANGED: 'Ranged'
};

// Множники урону (матриця бонусів)
export const DAMAGE_MULTIPLIERS = {
  [UNIT_TYPES.SWORDS]: {
    [UNIT_TYPES.SPEARS]: 1.5, // Swords бонус проти Spears
    [UNIT_TYPES.SWORDS]: 1,
    [UNIT_TYPES.CAVALRY]: 1,
    [UNIT_TYPES.RANGED]: 1
  },
  [UNIT_TYPES.SPEARS]: {
    [UNIT_TYPES.CAVALRY]: 1.5, // Spears бонус проти Cavalry
    [UNIT_TYPES.SWORDS]: 1,
    [UNIT_TYPES.SPEARS]: 1,
    [UNIT_TYPES.RANGED]: 1
  },
  [UNIT_TYPES.CAVALRY]: {
    [UNIT_TYPES.SWORDS]: 1.5, // Cavalry бонус проти Swords
    [UNIT_TYPES.RANGED]: 1.5, // та Ranged
    [UNIT_TYPES.SPEARS]: 1,
    [UNIT_TYPES.CAVALRY]: 1
  },
  [UNIT_TYPES.RANGED]: {
    // Ranged вразливий в ближньому бою, але має урон здалеку
    [UNIT_TYPES.SWORDS]: 0.5,
    [UNIT_TYPES.SPEARS]: 0.5,
    [UNIT_TYPES.CAVALRY]: 0.5,
    [UNIT_TYPES.RANGED]: 1
  }
};

// Доступні юніти
export const AVAILABLE_UNITS = [
  {
    id: 'hastati',
    name: 'Гастати',
    type: UNIT_TYPES.SPEARS,
    hp: 200,
    maxHp: 200,
    attack: 20,
    icon: '🗡️'
  },
  {
    id: 'triarii',
    name: 'Тріарії',
    type: UNIT_TYPES.SWORDS,
    hp: 240,
    maxHp: 240,
    attack: 25,
    icon: '⚔️'
  },
  {
    id: 'equites',
    name: 'Еквіти',
    type: UNIT_TYPES.CAVALRY,
    hp: 160,
    maxHp: 160,
    attack: 30,
    icon: '🐎'
  },
  {
    id: 'velites',
    name: 'Веліти',
    type: UNIT_TYPES.RANGED,
    hp: 120,
    maxHp: 120,
    attack: 15,
    icon: '🏹'
  }
];