const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  // Adding the Premium semantic palette for backward compatibility with components that might use it
  premium: {
    gold: '#22d3ee', // Mapped to Cyan for safety
    background: '#0b0f19',
    card: '#1e293b',
    green: '#22c55e',
    red: '#ef4444',
    text: '#e2e8f0',
    textDim: '#94a3b8',
    border: '#334155',
    overlay: 'rgba(1, 11, 20, 0.85)',
  }
};
