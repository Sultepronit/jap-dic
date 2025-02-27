const statusBar = document.getElementById('status-bar');

let fetchCounter = 0;

export default async function fetchWithFeatures(url, parser) {
    try {
        fetchCounter++;
        statusBar.className = 'fetching';
        // console.log(statusBar);

        const response = await fetch(url);
        const result = await response[parser]();

        if (--fetchCounter === 0) statusBar.className = '';

        return result
    } catch (error) {
        console.warn(error);
        console.warn(error.message);
        statusBar.className = 'failed';
        fetchCounter--;
    }
}