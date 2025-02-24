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
