export function markKey(activeKey: string): void {
  // Clear all active keys and fingers
  document.querySelectorAll('.active-key').forEach(el => el.classList.remove('active-key'))
  document.querySelectorAll('.active-finger').forEach(el => el.classList.remove('active-finger'))

  const addActiveKey = (keyId: string, ...fingerIds: string[]): void => {
    const keyEl = document.getElementById(keyId)
    if (keyEl) keyEl.classList.add('active-key')
    fingerIds.forEach(fingerId => {
      const fingerEl = document.getElementById(fingerId)
      if (fingerEl) fingerEl.classList.add('active-finger')
    })
  }

  switch (activeKey) {
    // Lowercase letters
    case 'a': addActiveKey('a', 'finger-l5'); break
    case 'b': addActiveKey('b', 'finger-l2'); break
    case 'c': addActiveKey('c', 'finger-l3'); break
    case 'd': addActiveKey('d', 'finger-l3'); break
    case 'e': addActiveKey('e', 'finger-l3'); break
    case 'f': addActiveKey('f', 'finger-l2'); break
    case 'g': addActiveKey('g', 'finger-l2'); break
    case 'h': addActiveKey('h', 'finger-r2'); break
    case 'i': addActiveKey('i', 'finger-r3'); break
    case 'j': addActiveKey('j', 'finger-r2'); break
    case 'k': addActiveKey('k', 'finger-r3'); break
    case 'l': addActiveKey('l', 'finger-r4'); break
    case 'm': addActiveKey('m', 'finger-r2'); break
    case 'n': addActiveKey('n', 'finger-r2'); break
    case 'o': addActiveKey('o', 'finger-r4'); break
    case 'p': addActiveKey('p', 'finger-r5'); break
    case 'q': addActiveKey('q', 'finger-l5'); break
    case 'r': addActiveKey('r', 'finger-l2'); break
    case 's': addActiveKey('s', 'finger-l4'); break
    case 't': addActiveKey('t', 'finger-l2'); break
    case 'u': addActiveKey('u', 'finger-r2'); break
    case 'v': addActiveKey('v', 'finger-l2'); break
    case 'w': addActiveKey('w', 'finger-l4'); break
    case 'x': addActiveKey('x', 'finger-l4'); break
    case 'y': addActiveKey('y', 'finger-r2'); break
    case 'z': addActiveKey('z', 'finger-l5'); break

    // Uppercase letters
    case 'A': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('a', 'finger-l5'); break
    case 'B': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('b', 'finger-l2'); break
    case 'C': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('c', 'finger-l3'); break
    case 'D': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('d', 'finger-l3'); break
    case 'E': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('e', 'finger-l3'); break
    case 'F': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('f', 'finger-l2'); break
    case 'G': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('g', 'finger-l2'); break
    case 'H': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('h', 'finger-r2'); break
    case 'I': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('i', 'finger-r3'); break
    case 'J': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('j', 'finger-r2'); break
    case 'K': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('k', 'finger-r3'); break
    case 'L': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('l', 'finger-r4'); break
    case 'M': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('m', 'finger-r2'); break
    case 'N': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('n', 'finger-r2'); break
    case 'O': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('o', 'finger-r4'); break
    case 'P': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('p', 'finger-r5'); break
    case 'Q': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('q', 'finger-l5'); break
    case 'R': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('r', 'finger-l2'); break
    case 'S': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('s', 'finger-l4'); break
    case 'T': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('t', 'finger-l2'); break
    case 'U': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('u', 'finger-r2'); break
    case 'V': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('v', 'finger-l2'); break
    case 'W': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('w', 'finger-l4'); break
    case 'X': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('x', 'finger-l4'); break
    case 'Y': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('y', 'finger-r2'); break
    case 'Z': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('z', 'finger-l5'); break

    // Special keys
    case ' ': addActiveKey('space', 'finger-r1'); break
    case '\n': addActiveKey('enter', 'finger-r5'); break

    // Numbers
    case '`': addActiveKey('`', 'finger-l5'); break
    case '1': addActiveKey('1', 'finger-l5'); break
    case '2': addActiveKey('2', 'finger-l4'); break
    case '3': addActiveKey('3', 'finger-l3'); break
    case '4': addActiveKey('4', 'finger-l2'); break
    case '5': addActiveKey('5', 'finger-l2'); break
    case '6': addActiveKey('6', 'finger-r2'); break
    case '7': addActiveKey('7', 'finger-r2'); break
    case '8': addActiveKey('8', 'finger-r3'); break
    case '9': addActiveKey('9', 'finger-r4'); break
    case '0': addActiveKey('0', 'finger-r5'); break
    case '-': addActiveKey('-', 'finger-r5'); break
    case '=': addActiveKey('=', 'finger-r5'); break

    // Shifted numbers
    case '~': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('`', 'finger-l5'); break
    case '!': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('1', 'finger-l5'); break
    case '@': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('2', 'finger-l4'); break
    case '#': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('3', 'finger-l3'); break
    case '$': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('4', 'finger-l2'); break
    case '%': addActiveKey('shiftRight', 'finger-r5'); addActiveKey('5', 'finger-l2'); break
    case '^': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('6', 'finger-r2'); break
    case '&': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('7', 'finger-r2'); break
    case '*': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('8', 'finger-r3'); break
    case '(': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('9', 'finger-r4'); break
    case ')': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('0', 'finger-r5'); break
    case '_': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('-', 'finger-r5'); break
    case '+': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('=', 'finger-r5'); break

    // Brackets
    case '[': addActiveKey('[', 'finger-r5'); break
    case ']': addActiveKey(']', 'finger-r5'); break
    case '\\': addActiveKey('\\', 'finger-r5'); break
    case '{': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('[', 'finger-r5'); break
    case '}': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey(']', 'finger-r5'); break
    case '|': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('\\', 'finger-r5'); break

    // Punctuation
    case ';': addActiveKey(';', 'finger-r5'); break
    case "'": addActiveKey("'", 'finger-r5'); break
    case ':': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey(';', 'finger-r5'); break
    case '"': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey("'", 'finger-r5'); break
    case ',': addActiveKey(',', 'finger-r3'); break
    case '.': addActiveKey('.', 'finger-r4'); break
    case '/': addActiveKey('/', 'finger-r5'); break
    case '<': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey(',', 'finger-r3'); break
    case '>': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('.', 'finger-r4'); break
    case '?': addActiveKey('shiftLeft', 'finger-l5'); addActiveKey('/', 'finger-r5'); break
  }
}

