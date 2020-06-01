export const effects = [
  // Keywords
  'Armor', 'Candy', 'Charge', 'Disarmed', 'Dodge', 'Dust', 'Fatigue', 'Future', 'Haste', 'Invulnerable', 'Magic', 'Paralyze', 'Ranged', 'Silence', 'Support', 'Taunt', 'Transparency', 'Turbo', 'Turn end', 'Turn start', 'Thorns',
  'Synergy',
  // Tribes
  'Amalgamates?', 'Bombs?', 'Dogs?', 'Froggits?', 'G followers?', 'Lost souls?', 'Molds?', 'Plants?', 'Royal guards?', 'Snails?', 'Spiders?', 'Temmies?', 'Chaos Weapons?',
  'Arachnids?', 'Pieces?',
];
export const specials = ['ATK', 'DMG', 'HP', 'KR', 'cost', 'G'];

const div = document.querySelector('#descriptionTip div');
function addType(type) {
    const el = document.createElement('span');
    el.innerText = type.replace('s?', '');
    div.append(el, ' ');
}
effects.forEach(addType);
specials.forEach(addType);
