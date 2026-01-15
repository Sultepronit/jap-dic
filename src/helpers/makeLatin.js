export default function makeLatin(input, e) {
    if (!e.code.startsWith('Key')) return;
    const expected = e.code.slice(3).toLowerCase()
    if (e.key === expected) return;

    e.preventDefault();
    input.setRangeText(expected, input.selectionStart, input.selectionEnd, 'end');
    input.dispatchEvent(new Event('meddled-input'))
}