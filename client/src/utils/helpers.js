function safelyParseJson(value) {
   try {
      JSON.parse(value);
   } catch {
      // if error return the original value
      return value;
   }
   return JSON.parse(value);
}

function checkIsOver(str, num) {
   if (str.length > num) return true;
   else return false;
}

const MAX_CARD_CHARS = 240;

const defaultLevel = 1;

export { checkIsOver, defaultLevel, MAX_CARD_CHARS, safelyParseJson };
