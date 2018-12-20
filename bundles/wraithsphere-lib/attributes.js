'use strict';

module.exports = [
  {
    name: 'health',
    base: 100,
    formula: {
      requires: [],
      fn: function (character, health) {
        return health + (character.level * 2);
      },
    },
  },
  { name: 'strength', base: 0 },
  { name: 'endurance', base: 0 },
  { name: 'agility', base: 0 },
  { name: 'dexterity', base: 0 },
  { name: 'charisma', base: 0},
  { name: 'intellect', base: 0 },
  { name: 'perception', base: 0 },
];
