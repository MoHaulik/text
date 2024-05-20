const editor = document.getElementById('editor');
let currentCanvas = 0;
const canvasKeys = ['canvas0', 'canvas1', 'canvas2', 'canvas3', 'canvas4'];
let translationTimeout;

// Load canvases from localStorage or initialize them
const canvases = canvasKeys.map(key => localStorage.getItem(key) || '');

// Function to update the editor with the current canvas content
function updateEditor() {
    editor.innerText = canvases[currentCanvas];
}

// Function to save the editor content to the current canvas
function saveCurrentCanvas() {
    canvases[currentCanvas] = editor.innerText;
    localStorage.setItem(canvasKeys[currentCanvas], editor.innerText);
}

// Function to translate specific text patterns
function translateText(text) {
    return text.replace(/aa/g, 'å').replace(/ae/g, 'æ').replace(/oe/g, 'ø');
}

// Event listener for keydown events
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        saveCurrentCanvas();
        if (e.key === 'ArrowLeft') {
            currentCanvas = (currentCanvas === 0) ? 4 : currentCanvas - 1;
        } else {
            currentCanvas = (currentCanvas === 4) ? 0 : currentCanvas + 1;
        }
        updateEditor();
    }
});

// Event listener for input events to handle text translation
editor.addEventListener('input', () => {
    if (currentCanvas === 0 || currentCanvas === 1) {
        clearTimeout(translationTimeout);
        translationTimeout = setTimeout(() => {
            const translatedText = translateText(editor.innerText);
            if (translatedText !== editor.innerText) {
                const cursorPosition = window.getSelection().getRangeAt(0).startOffset;
                editor.innerText = translatedText;
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(editor.childNodes[0], cursorPosition);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }, 1000);  // Adjust the timeout duration as needed
    }
    saveCurrentCanvas();
});

// Initialize the editor with the first canvas content
updateEditor();
