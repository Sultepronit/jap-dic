import { getMainInputSelection, getPositionForMagic } from "./mainInputHandlers";
import fetchWithFeatures from "./services/fetchWithFeatures";

export async function initKanjiReplacement() {
    const query = getMainInputSelection();
    // if (!query) return;

    const result = await fetchWithFeatures(`http://localhost:5050/?dic=kanji-lookup&word=${query}`, 'text');
    console.log(result);
    const candidates = result.split('');
    console.log(candidates);

    addOptions(candidates);
}

const optionsPopup = document.getElementById('input-options');

let selectedOption = null;
function addOptions(options) {
    const { left, top } = getPositionForMagic();
    optionsPopup.classList.remove('hidden');
    optionsPopup.style.left = `${left}px`;
    optionsPopup.style.top = `${top}px`;
    
    // replaceSelection(magicInput, optionsList[0]);

    const html = options.map(
        (option, index) => `<p id="option-${index}">${option}</p>`
    ).join('');

    optionsPopup.innerHTML = `<div class="options-list">${html}</div>`;

    selectedOption = document.getElementById(`option-${0}`);
    selectedOption.classList.add('selected-option');
}