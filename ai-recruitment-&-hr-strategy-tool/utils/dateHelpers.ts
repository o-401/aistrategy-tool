import { zodiacs, etoSigns } from '../constants';

export const getZodiacSign = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacs[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacs[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return zodiacs[2]; // Gemini
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return zodiacs[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacs[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacs[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return zodiacs[6]; // Libra
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return zodiacs[7]; // Scorpio
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return zodiacs[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacs[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacs[10]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacs[11]; // Pisces
  return '';
};


export const getEtoSign = (date: Date): string => {
    const year = date.getFullYear();
    // (year - 4) % 12 is the formula to get the index for Eto signs array.
    // The base year is Rat (子) which is 4 AD.
    const etoIndex = (year - 4 + 12) % 12;
    return etoSigns[etoIndex];
};
