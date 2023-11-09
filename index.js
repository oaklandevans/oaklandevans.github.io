const typingDiv = document.getElementById("typing");
const statsDiv = document.getElementById("stats");
const startGameBtn = document.getElementById("startGameBtn");

const paragraphs = [
    "animateToOverview: function(animationType) {\n" +
    "for (let w = 0; w < this._workspaces.length; w++) {\n" +
    "if (animationType == AnimationType.ZOOM)\n" +
    "this._workspaces[w].zoomToOverview();\n" +
    "else\n" +
    "this._workspaces[w].fadeToOverview();\n" +
    "}\n" +
    "this._updateWorkspaceActors(false);\n" +
    "},"
];

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
            typingDiv.appendChild(span);
            return span;
        });

    let cursorIndex = 0;
    let cursorCharacter = characters[cursorIndex];
    cursorCharacter.classList.add('cursor');

    let startTime = null;
    let endTime = null;

    const keydown = ({ key }) => {
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
    };

    document.addEventListener('keydown', keydown);
};