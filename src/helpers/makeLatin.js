export default function makeLatin(input, e) {
    // console.log(e.code)
    let expected = e.key;

    if (e.code.startsWith('Key')) {
        expected = e.code.slice(3).toLowerCase();
    } else if (e.code === 'Quote') {
        expected = "'";
    }
    if (e.key === expected) return;

    e.preventDefault();
    input.setRangeText(expected, input.selectionStart, input.selectionEnd, 'end');
    input.dispatchEvent(new Event('meddled-input'))
}