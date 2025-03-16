const mainInput = document.getElementById('input');

export function focusMainInput(longWay = false) {
    if (!longWay) {
        if (document.activeElement === mainInput) return;
        if (mainInput.innerText === '') mainInput.focus();
        if (document.activeElement === mainInput) return;
    }
    
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(mainInput);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
}

export function putMagicInput(magicInput) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(magicInput);
    magicInput.classList.remove('hidden');

    selection.removeAllRanges();

    mainInput.contentEditable = 'false';
}

export function removeMagicInput(magicInput) {
    const textNode = document.createTextNode(magicInput.value);
    mainInput.insertBefore(textNode, magicInput);

    magicInput.value = '';
    magicInput.classList.add('hidden');

    mainInput.contentEditable = 'true';
    
    const selection = window.getSelection();    
    const range = document.createRange();
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    selection.removeAllRanges();
    selection.addRange(range);
}

export function addJapSpace() {
    mainInput.innerText += '　';
    focusMainInput(true);
}

export function getMainInputValue() {
    return mainInput.innerText;
}

export function selectAllOfMainInput() {    
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(mainInput);
    // range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
}

// mainInput.addEventListener('paste', (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData('text/plain');
//     document.execCommand('insertText', false, text);
// });

// let currenCharacter = null;
// let lastOffset = -1;
// mainInput.addEventListener('click', (e) => {
// // mainInput.addEventListener('mousemove', (e) => {
//     if (!e.ctrlKey) return;

//     const range = document.caretPositionFromPoint(e.clientX, e.clientY);
//     // console.log(range2.offset);
//     // console.log(range2.offsetNode.textContent);

//     if (range && range.offsetNode.textContent) {
//         console.log(range.offset)
//         if (lastOffset === range.offset) return;
//         lastOffset = range.offset;

//         // const index = range.offset;
//         const text = range.offsetNode.textContent;
//         // const character = text[index];
//         // console.log(character);
//         if (range.offset < text.length) {
//             // currenCharacter = character;
//             selectCharacter(range.offsetNode, range.offset)
//         }
//     }
// });

// function selectCharacter(node, index) {
//     const range = document.createRange();
//     range.setStart(node, index);
//     range.setEnd(node, index + 1);

//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
// }