import initDicSearch, { getKanjiReplacement } from "./services/dictionaryHandler.js";
import { addJapSpace, focusMainInput, getMainInputSelection, getPositionForMagic, mainInput, implementMagic, selectAllOfMainInput } from "./mainInputHandlers.js";
import { replaceRoma, replaceSelection, selectKana, toKatakana } from "./replacers.js";
import fetchWithFeatures from "./services/fetchWithFeatures.js";
import { findCandidates } from "./wordSearch.js";
import { addKanjiOptions, addWordOptions, hideOptionList, selectNextOption } from "./optionsHandlers.js";

const magicPopup = document.getElementById('magic-popup');

const magicInput = document.getElementById('magicInput');
const widthMaker = document.getElementById('widthMaker');

let magicMode = false;
let conversionMode = false;
let kanaMode = false;
let kanjiMagicMode = false;

function putMagicPopup() {
    const { left, top } = getPositionForMagic();
    magicPopup.classList.remove('hidden');
    magicPopup.style.left = `${left}px`;
    // magicContainer.style.top = `${top}px`;
}

function startMagic() {
    magicMode = true;

    putMagicPopup();
    magicInput.classList.remove('hidden');
    magicInput.focus();
}

function stopMagic() {
    magicMode = false;

    implementMagic(magicInput.value);

    magicInput.value = '';
    magicInput.classList.add('hidden');
    
    initDicSearch();
}

let attemptCounter = 1;
let kanjiToReplace = '';
async function startKanjiMagic() {
    attemptCounter = 1;
    kanjiToReplace = getMainInputSelection();
    if (!kanjiToReplace) return;
    kanjiMagicMode = true;

    const candidates = await getKanjiReplacement(kanjiToReplace);

    putMagicPopup();
    addKanjiOptions(candidates);
}

async function retryKanjiMagic() {
    const candidates = await getKanjiReplacement(kanjiToReplace, ++attemptCounter);
    addKanjiOptions(candidates);
}

function breakKanjiMagic() {
    kanjiMagicMode = false;
    hideOptionList();
    replaceSelection(mainInput, kanjiToReplace);
}

function stopKanjiMagic() {
    kanjiMagicMode = false;    
    hideOptionList();
    initDicSearch();
}

let initialInput = '';
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
    addWordOptions(found, candidate.options);
}

function resetConversion(increment) {
    const newIndex = candidateIndex - increment;
    
    if (newIndex < 0 || newIndex >= candidates.length) return;
    candidateIndex = newIndex;

    replaceSelection(magicInput, found);
    handleConversion();
}

async function searchAndConverse(input) {
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
    // optionsList.classList.add('hidden');
    hideOptionList();
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
    // optionsList.classList.add('hidden');
    hideOptionList();
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
        } else if (kanjiMagicMode) {
            stopKanjiMagic();
        } else {
            initDicSearch();
        }
    } else if (e.code === 'Space') {
        e.preventDefault();
        if (magicMode) {
            if (!conversionMode) {
                startConversion();
            } else if (kanaMode) {
                resumeConversion();
            }
        } else if(kanjiMagicMode) {
            retryKanjiMagic();
        } else if (e.ctrlKey) {
            // getMainInputSelection();
            // initKanjiReplacement();
            startKanjiMagic();
        } else {
            addJapSpace();
        }
    } else if (e.code === 'Escape') {
        if (conversionMode) {
            breakConversion();
        } else if (kanjiMagicMode) {
            breakKanjiMagic();
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
    } else if (kanjiMagicMode) {
        if (!(e.ctrlKey && e.code === 'KeyR')) e.preventDefault();

        switch (e.code) {
            case 'ArrowDown':
                selectNextOption(e.ctrlKey ? 5 : 1, true);
                break;
            case 'ArrowUp':
                selectNextOption(e.ctrlKey ? -5 : -1, true);
                break;
        }
    } else if (e.key.length === 1 && !e.ctrlKey) {
        if (!magicMode) {
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