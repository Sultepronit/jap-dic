export default function makeLatin(input, e) {
    const expected = e.code.replace('Key', '').toLowerCase()
    if (e.key === expected) return;

    e.preventDefault();
    input.setRangeText(expected, input.selectionStart, input.selectionEnd, 'end');
    input.dispatchEvent(new Event('meddled-input'))
}