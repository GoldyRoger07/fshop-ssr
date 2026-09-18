import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Preset de thème de l'application.
 * Couleur primaire du site : noir (#000), dans l'esprit Shein.
 * Les promotions utilisent la couleur « sale » (#fa6338) définie dans styles.css.
 */
export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#c8c8c8',
      300: '#a4a4a4',
      400: '#818181',
      500: '#000000',
      600: '#000000',
      700: '#1a1a1a',
      800: '#262626',
      900: '#333333',
      950: '#0a0a0a',
    },
  },
});
