const typingDiv = document.getElementById("typing");
const statsDiv = document.getElementById("stats");
const startGameBtn = document.getElementById("startGameBtn");

const paragraphs = [
    // section 1
    "animateToOverview: function(animationType) {\n" +
    "for (let w = 0; w < this._workspaces.length; w++) {\n" +
    "if (animationType == AnimationType.ZOOM)\n" +
    "this._workspaces[w].zoomToOverview();\n" +
    "else\n" +
    "this._workspaces[w].fadeToOverview();\n" +
    "}\n" +
    "this._updateWorkspaceActors(false);\n" +
    "},",
    // section 2
    "animateFromOverview: function(animationType) {\n" +
    "this.actor.remove_clip();\n" +
    "for (let w = 0; w < this._workspaces.length; w++) {\n" +
    "if (animationType == AnimationType.ZOOM)\n" +
    "this._workspaces[w].zoomFromOverview();\n" +
    "else\n" +
    "this._workspaces[w].fadeFromOverview();\n" +
    "}\n" +
    "},"
];

function markKey(activeKey) {

    switch (activeKey) {
        case "a":
            document.getElementById('a').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "b":
            document.getElementById('b').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "c":
            document.getElementById('c').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            break;
        case "d":
            document.getElementById('d').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            break;
        case "e":
            document.getElementById('e').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            break;
        case "f":
            document.getElementById('f').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "g":
            document.getElementById('g').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "h":
            document.getElementById('h').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "i":
            document.getElementById('i').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            break;
        case "j":
            document.getElementById('j').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "k":
            document.getElementById('k').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            break;
        case "l":
            document.getElementById('l').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            break;
        case "m":
            document.getElementById('m').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "n":
            document.getElementById('n').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "o":
            document.getElementById('o').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            break;
        case "p":
            document.getElementById('p').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "q":
            document.getElementById('q').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "r":
            document.getElementById('r').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "s":
            document.getElementById('s').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            break;
        case "t":
            document.getElementById('t').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "u":
            document.getElementById('u').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "v":
            document.getElementById('v').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "w":
            document.getElementById('w').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            break;
        case "x":
            document.getElementById('x').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            break;
        case "y":
            document.getElementById('y').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "z":
            document.getElementById('z').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "A":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('a').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "B":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('b').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "C":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('c').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "D":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('d').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "E":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('e').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "F":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('f').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "G":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('g').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "H":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('h').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "I":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('i').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "J":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('j').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "K":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('k').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "L":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('l').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "M":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('m').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "N":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('n').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "O":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('o').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "P":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('p').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "Q":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('q').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "R":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('r').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "S":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('s').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "T":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('t').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "U":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('u').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "V":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('v').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "W":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('w').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "X":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('x').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "Y":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('y').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "Z":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('z').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;

        // space bar
        case " ":
            document.getElementById('space').classList.add('active-key');
            document.getElementById('finger-r1').classList.add('active-finger');
            break;

        // enter
        case "\n":
            document.getElementById('enter').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;

        // first row - dual keys
        case "`":
            document.getElementById('`').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "1":
            document.getElementById('1').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "2":
            document.getElementById('2').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            break;
        case "3":
            document.getElementById('3').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            break;
        case "4":
            document.getElementById('4').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "5":
            document.getElementById('5').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            break;
        case "6":
            document.getElementById('6').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "7":
            document.getElementById('7').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            break;
        case "8":
            document.getElementById('8').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            break;
        case "9":
            document.getElementById('9').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            break;
        case "0":
            document.getElementById('0').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "-":
            document.getElementById('-').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "=":
            document.getElementById('=').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "~":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('`').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "!":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('1').classList.add('active-key');
            document.getElementById('finger-l5').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "@":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('2').classList.add('active-key');
            document.getElementById('finger-l4').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "#":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('3').classList.add('active-key');
            document.getElementById('finger-l3').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "$":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('4').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "%":
            document.getElementById('shiftRight').classList.add('active-key');
            document.getElementById('5').classList.add('active-key');
            document.getElementById('finger-l2').classList.add('active-finger');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "^":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('6').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "&":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('7').classList.add('active-key');
            document.getElementById('finger-r2').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "*":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('8').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "(":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('9').classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case ")":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('0').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "_":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('-').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "+":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('=').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;

        // second row - dual keys
        case "[":
            document.getElementById('[').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "]":
            document.getElementById(']').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "\\":
            document.getElementById('\\').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "{":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('[').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "}":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById(']').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "|":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById('\\').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;

        // third row - dual keys
        case ";":
            document.getElementById(';').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "'":
            document.getElementById("'").classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case ":":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById(';').classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case '"':
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById("'").classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;

        // fourth row - dual keys
        case ",":
            document.getElementById(',').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            break;
        case ".":
            document.getElementById(".").classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            break;
        case "/":
            document.getElementById("/").classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            break;
        case "<":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById(',').classList.add('active-key');
            document.getElementById('finger-r3').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case ">":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById(".").classList.add('active-key');
            document.getElementById('finger-r4').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
        case "?":
            document.getElementById('shiftLeft').classList.add('active-key');
            document.getElementById("/").classList.add('active-key');
            document.getElementById('finger-r5').classList.add('active-finger');
            document.getElementById('finger-l5').classList.add('active-finger');
            break;
    }
}

const startGame = () => {
    startGameBtn.classList.add('hidden');
    typingDiv.innerHTML = '';
    statsDiv.innerHTML = '';

    const text = paragraphs[parseInt(Math.random() * paragraphs.length)];

    const characters = text
        .split('')
        .map(char => {
            const span = document.createElement('span');
            span.innerText = char;
            // add enter icons
            if (char === '\n') {
                span.classList.add('enter-icon');
                span.classList.add('fa');
                span.classList.add('fa-level-down');
            }
            typingDiv.appendChild(span);
            return span;
        });

    let cursorIndex = 0;
    let cursorCharacter = characters[cursorIndex];
    cursorCharacter.classList.add('cursor');
    markKey(cursorCharacter.innerText);

    let startTime = null;
    let endTime = null;

    const keydown = ({key}) => {
        if (!startTime) {
            startTime = new Date();
        }

        if (
            key === cursorCharacter.innerText ||
            (key === 'Enter' && cursorCharacter.innerText === "\n") // handle enter
        ) {
            // we typed the correct key
            cursorCharacter.classList.remove('cursor');
            cursorCharacter.classList.add('done');
            cursorCharacter = characters[++cursorIndex];
            const activeKeyElements = document.querySelectorAll('.active-key');
            if (activeKeyElements.length > 0) {
                activeKeyElements.forEach(element => element.classList.remove('active-key'));
            }
            const activeFingerElements = document.querySelectorAll('.active-finger');
            if (activeFingerElements.length > 0) {
                activeFingerElements.forEach(element => element.classList.remove('active-finger'));
            }
        }

        if (cursorIndex >= characters.length) {
            // End of Game
            // Calculate Stats
            endTime = new Date();
            const delta = endTime - startTime;
            const seconds = delta / 1000;
            const numberOfWords = characters.length / 4.7; // average word length
            const wps = numberOfWords / seconds;
            const wpm = wps * 60.0;
            // Display Stats
            document.getElementById('stats').innerText = `wpm = ${wpm.toFixed(2)}`;

            document.removeEventListener('keydown', keydown);
            startGameBtn.classList.remove('hidden');
            return;
        }

        cursorCharacter.classList.add('cursor');
        markKey(cursorCharacter.innerText);
    };

    document.addEventListener('keydown', keydown);
};