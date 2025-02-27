const statusBar = document.getElementById('status-bar');

async function setPause(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

let fetchCounter = 0;
export default async function fetchWithFeatures(url, parser) {
    try {
        fetchCounter++;
        statusBar.className = 'fetching';

        const response = await fetch(url);
        const result = await response[parser]();

        if (--fetchCounter === 0) statusBar.className = '';

        return result
    } catch (error) {
        fetchCounter--;
        statusBar.className = 'failed';

        if (error.message.includes('Failed to fetch')) {
            console.log('wait & try again!');
            await setPause(5000);
            return await fetchWithFeatures(url, parser);
        } else {
            console.warn(error);
        }
    }
}