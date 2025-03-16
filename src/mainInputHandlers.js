const mainInput = document.getElementById('main-input');

export { mainInput };

export function focusMainInput() {
    mainInput.focus();
}

const selection = { start: 0, end: 0 };
function refreshSelection() {
    selection.start = mainInput.selectionStart;
    selection.end = mainInput.selectionEnd;
}

function putData(data, useSavedSelection = false) {
    if (!useSavedSelection) refreshSelection();

    mainInput.setRangeText(data, selection.start, selection.end, 'end');
}

let avatar = null;
export function getPositionForMagic() {
    focusMainInput();
    refreshSelection();    

    if (!avatar) {
        avatar = document.getElementById('main-input-avatar');
        const inputStyle = window.getComputedStyle(mainInput);
        avatar.style.font = inputStyle.font;
        avatar.style.padding = inputStyle.padding;
        avatar.style.border = inputStyle.border;
        avatar.style.whiteSpace = 'pre';
    }

    avatar.textContent = mainInput.value.substring(0, selection.start);

    const inputRect = mainInput.getBoundingClientRect();
    const textRect = avatar.getBoundingClientRect();
    console.log(inputRect.left, textRect.width);

    return {
        left: inputRect.left + textRect.width - 10,
        // top: inputRect.top + textRect.height
        // top: 36
    }
}

export function implementMagic(data) {
    putData(data, true);
    focusMainInput();
}

export function addJapSpace() {
    focusMainInput();
    putData('　');
}

export function getMainInputValue() {
    return mainInput.value;
}

export function selectAllOfMainInput() {    
    mainInput.select();
}

export function getMainInputSelection() {
    refreshSelection();
    const { start, end } = selection;
    if (start === end) return '';

    // const toReplace = mainInput.value.substring(start, end);
    // console.log(toReplace);
    return mainInput.value.substring(start, end);
}