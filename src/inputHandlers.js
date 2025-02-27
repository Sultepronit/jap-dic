// import getJardic, { getJisho } from "./dictionaryHandler.js";
import initDicSearch from "./dictionaryHandler.js";
import { addJapSpace, focusMainInput, getMainInputValue, putMagicInput, removeMagicInput, selectAllOfMainInput } from "./mainInputHandlers.js";
import { replaceRoma, replaceSelection, selectKana, toKatakana } from "./replacers.js";
import { findCandidates } from "./wordSearch.js";

const optionsPopup = document.getElementById('input-options');

const magicInput = document.getElementById('magicInput');
const widthMaker = document.getElementById('widthMaker');

let magicMode = false;
let conversionMode = false;
let kanaMode = false;

function startMagic() {
    magicMode = true;

    putMagicInput(magicInput);
    magicInput.focus();
}

async function stopMagic() {
    magicMode = false;

    removeMagicInput(magicInput);

    initDicSearch();
}

function arrangeKanaSuggection(list, entry, replacement) {
    const entryIndex = list.indexOf(entry);
    if (entryIndex >= 0 && entryIndex < 2) {
        list[entryIndex] = replacement;
        return null;
    }

    if (entryIndex >= 0) list.splice(entryIndex, 1);
    return replacement;
}

let selectedOption = null;
function addOptions(match, inputOptions) {
    const rect = magicInput.getBoundingClientRect();
    optionsPopup.classList.remove('hidden');
    optionsPopup.style.top = `${rect.bottom + window.scrollY}px`;
    optionsPopup.style.left = `${rect.left + window.scrollX}px`;

    // we are adding to the top of list katakana (0) and hiragana (1) options
    // but, if these options are already there inside the suggested list we don't do that
    // and we adjust index of the selected option to be the first of the suggested ones
    console.log(inputOptions);

    const optionsList = [...inputOptions];

    const addOptions = [
        arrangeKanaSuggection(optionsList, '=', match),
        arrangeKanaSuggection(optionsList, '=k', toKatakana(match))
    ].filter(option => option);
    console.log(addOptions);

    const selectedIndex = addOptions.length;
    
    console.log(optionsList);

    selectKana(magicInput, match);
    replaceSelection(magicInput, optionsList[0]);

    const options = [...addOptions, ...optionsList].map(
        (option, index) => `<p id="option-${index}">${option}</p>`
    ).join('');

    optionsPopup.innerHTML = `<div class="options-list">${options}</div>`;

    selectedOption = document.getElementById(`option-${selectedIndex}`);
    selectedOption.classList.add('selected-option');
}

function reselect(target) {
    if (target === selectedOption) return;

    replaceSelection(magicInput, target.textContent);

    selectedOption.classList.remove('selected-option');
    selectedOption = target;
    selectedOption.classList.add('selected-option');
    selectedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function selectNextOption(increment) {
    let target = selectedOption;
    for (let i = 0; i !== increment; i += increment > 0 ? 1 : -1) {
        const candidate = increment > 0 ? target.nextElementSibling : target.previousElementSibling;
        if (!candidate) break;
        target = candidate;
    }

    reselect(target);
}

let initialInput = '';
let lastWanted = '';
let found = '';
let remainder = '';
let candidates = null;
let candidateIndex = 0;
function handleConversion() {
    console.log(candidates);
    const candidate = candidates[candidateIndex];
    if (!candidate) {
        stopConversion();
        return;
    }

    remainder = candidate.remainder;
    found = candidate.found;
    addOptions(found, candidate.options);
}

function resetConversion(increment) {
    const newIndex = candidateIndex - increment;
    
    if (newIndex < 0 || newIndex >= candidates.length) return;
    candidateIndex = newIndex;

    replaceSelection(magicInput, found);
    handleConversion();
}

async function searchAndConverse(input) {
    lastWanted = input; 
    candidates = await findCandidates(input);
    candidateIndex = 0;
    handleConversion();
}

function startConversion() {
    conversionMode = true;
    initialInput = magicInput.value;
    searchAndConverse(magicInput.value);
}

function stopConversion() {
    conversionMode = false;
    optionsPopup.classList.add('hidden');
}

function finishStage() {
    if (remainder && !kanaMode) {
        searchAndConverse(remainder);
    } else {
        kanaMode = false;
        stopConversion();
        stopMagic();
    }
}

function breakConversion() {
    stopConversion();
    magicInput.value = initialInput;
    magicInput.dispatchEvent(new Event('contentChange'));
}

function resumeConversion() {
    kanaMode = false;
    replaceSelection(magicInput, (found + remainder));
    handleConversion();
}

function setKanaMode() {
    if (kanaMode) return;
    kanaMode = true;
    optionsPopup.classList.add('hidden');
    replaceSelection(magicInput, found);
    magicInput.setSelectionRange(magicInput.selectionStart, magicInput.value.length);
}

function setHiragana() {
    setKanaMode();
    replaceSelection(magicInput, (found + remainder));
}

function setKatakana() {
    setKanaMode();
    replaceSelection(magicInput, toKatakana(found + remainder));
}

function keyHandlers(e) {
    // console.log(e);
    if (e.code === 'Enter') {
        e.preventDefault();
        if (conversionMode) {
            finishStage();
        } else if (magicMode) {
            stopMagic();
        } else {
            initDicSearch();
        }
    } else if (e.code === 'Space') {
        e.preventDefault();
        if (magicMode) {
            // e.preventDefault();
            if (!conversionMode) {
                startConversion();
            } else if (kanaMode) {
                resumeConversion();
            }
        } else {
            addJapSpace();
        }
    } else if (e.code === 'Escape') {
        if (conversionMode) {
            breakConversion();
        } else if (!magicMode) {
            selectAllOfMainInput();
        }
    } else if (conversionMode) {
        if (!(e.ctrlKey && e.code === 'KeyR')) e.preventDefault();

        switch (e.code) {
            case 'ArrowDown':
                selectNextOption(e.ctrlKey ? 5 : 1);
                break;
            case 'ArrowUp':
                selectNextOption(e.ctrlKey ? -5 : -1);
                break;
            case 'ArrowLeft':
                resetConversion(-1);
                break;
            case 'ArrowRight':
                resetConversion(1);
                break;
            case 'KeyH':
                setHiragana();
                break;
            case 'KeyK':
                setKatakana()
                break;
        }
    } else if (e.key.length === 1 && !e.ctrlKey) {
        if (!magicMode) {
            focusMainInput();
            startMagic();
        } else {
            magicInput.focus();
        }
    }
}

function adjustWidth() {
    widthMaker.textContent = magicInput.value || '-';
    magicInput.style.width = widthMaker.offsetWidth + 2 + 'px';
}

function typeInHandler() {
    replaceRoma(magicInput);
    adjustWidth();
}

export function addInputHandlers() {
    focusMainInput();
    magicInput.addEventListener('input', typeInHandler);
    magicInput.addEventListener('contentChange', adjustWidth);
    document.body.addEventListener('keydown', keyHandlers)
}