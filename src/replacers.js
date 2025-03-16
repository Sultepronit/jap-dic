import { kanagana } from './lib/kanagana.js';
import { romaKana, sokuon } from './lib/romaKana.js';

export function replaceRoma(input) {
    for (const [roma, kana] of romaKana) {
        const start = input.value.indexOf(roma);
        if (start < 0) continue;
        const end = start + roma.length;
        input.setRangeText(kana, start, end, 'end');
        break;
    }

    const cursorPosition = input.selectionStart;
    for (const [target, replacement] of sokuon) {
        const start = input.value.indexOf(target);
        if (start < 0) continue;
        const end = start + target.length;
        input.setRangeText(replacement, start, end, 'preserve');
        input.selectionStart = input.selectionEnd = cursorPosition;
        break;
    }
}

export function selectKana(input, kana) {
    const start = input.value.indexOf(kana);
    input.selectionStart = start;
    input.selectionEnd = start + kana.length;
}

export function replaceSelection(input, replacement) {
    input.setRangeText(replacement, input.selectionStart, input.selectionEnd, 'select');
    input.dispatchEvent(new Event('contentChange'));
}

export function toKatakana(hiragana) {
    return hiragana.split('').map(symbol => kanagana[symbol] || symbol).join('');
}