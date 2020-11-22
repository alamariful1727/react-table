export const camelToWords = (str: string) => {
  let newKey = '';
  let index = 0;
  let code;
  let wasPrevNumber = true;
  let wasPrevUppercase = true;

  while (index < str.length) {
    code = str.charCodeAt(index);
    if (index === 0) {
      newKey += str[index].toUpperCase();
    } else if ((!wasPrevUppercase && code >= 65 && code <= 90) || (!wasPrevNumber && code >= 48 && code <= 57)) {
      newKey += ' ';
      newKey += str[index].toUpperCase();
    } else {
      newKey += str[index].toLowerCase();
    }
    wasPrevNumber = code >= 48 && code <= 57;
    wasPrevUppercase = code >= 65 && code <= 90;
    index++;
  }

  return newKey;
};
