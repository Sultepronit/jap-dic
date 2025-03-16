import { mainInput } from "./mainInputHandlers";
import { replaceSelection, selectKana, toKatakana } from "./replacers";

const optionsList = document.getElementById('input-options');

let selectedOption = null;

export function hideOptionList() {
    optionsList.classList.add('hidden');
}

function arrangeKanaSuggection(list, entry, actualKana) {
    const entryIndex = list.indexOf(entry);
    // if kana suggestion is at the top we leave it as is,
    // replacting its placeholder with actual value
    if (entryIndex >= 0 && entryIndex < 2) {
        list[entryIndex] = actualKana;
        return null;
    }

    // else we remove it, and the kana value will be added to the additioan list
    if (entryIndex >= 0) list.splice(entryIndex, 1);
    return actualKana;
}

function addOptions(options, input, selectedIndex = 0) {
    optionsList.classList.remove('hidden');
    
    replaceSelection(input, options[selectedIndex]);

    optionsList.innerHTML = options.map((option) => `<p>${option}</p>`).join('');

    selectedOption = optionsList.children[selectedIndex];
    selectedOption.classList.add('selected-option');
}

export function addKanjiOptions(options) {
    addOptions(options, mainInput);
}

export function addWordOptions(match, inputOptions) {
    // optionsList.classList.remove('hidden');

    // we are adding to the top of list katakana (0) and hiragana (1) options
    // but, if these options are already there inside the suggested list we don't do that
    // and we adjust index of the selected option to be the first of the suggested ones
    console.log(inputOptions);

    const mainOptions = [...inputOptions];

    const kanaOptions = [
        arrangeKanaSuggection(mainOptions, '=', match),
        arrangeKanaSuggection(mainOptions, '=k', toKatakana(match))
    ].filter(option => option);
    console.log(kanaOptions);

    const selectedIndex = kanaOptions.length;
    
    console.log(mainOptions);

    selectKana(magicInput, match);

    addOptions([...kanaOptions, ...mainOptions], magicInput, selectedIndex);
    // replaceSelection(magicInput, mainOptions[0]);

    // const options = [...addOptions, ...mainOptions].map(
    //     (option, index) => `<p id="option-${index}">${option}</p>`
    // ).join('');

    // optionsList.innerHTML = `<div class="options-list">${options}</div>`;

    // selectedOption = document.getElementById(`option-${selectedIndex}`);
    // selectedOption.classList.add('selected-option');
}

export function selectNextOption(increment, kanjiMagic = false) {
    let target = selectedOption;
    for (let i = 0; i !== increment; i += increment > 0 ? 1 : -1) {
        const candidate = increment > 0 ? target.nextElementSibling : target.previousElementSibling;
        if (!candidate) break;
        target = candidate;
    }

    if (target === selectedOption) return;
    
    replaceSelection(kanjiMagic ? mainInput : magicInput, target.textContent);

    selectedOption.classList.remove('selected-option');
    selectedOption = target;
    selectedOption.classList.add('selected-option');
    selectedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}