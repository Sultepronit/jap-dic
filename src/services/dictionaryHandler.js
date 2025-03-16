import { getMainInputValue } from "../mainInputHandlers";
import fetchWithFeatures from "./fetchWithFeatures";

const jardicOutput = document.getElementById('jardic');
const jishoOutput = document.getElementById('jisho');

async function getJardic(query) {    
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&dic_yarxi=on&q=${query}&page=1`);
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&q=${query}&page=1`);
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&q=${query}&page=1`);
    
    const fetched = await fetchWithFeatures(
        `https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&q=${query}&page=1`,
        'text'
    );
    
    const result = fetched
        .split('<table id="tabContent" width="100%">')[1]
        .split('</table>')[0]
        .replaceAll('width="65%"', '')
        .replaceAll('width="35%"', '');
    
   return `<table><tbody>${result}</tbody></table>`; 
}

const jishoUrl = import.meta.env.VITE_JISHO_URL;

async function getJisho(query) {    
    return await fetchWithFeatures(`${jishoUrl}/?dic=jisho&word=${query}`, 'text');
}

let lastQuery = '';
export default async function initDicSearch() {
    const inputValue = getMainInputValue();
    if (inputValue === lastQuery) return;

    lastQuery = inputValue;
    jardicOutput.innerHTML = 'ダウンロード中...';
    getJardic(inputValue).then(result => jardicOutput.innerHTML = result);

    jishoOutput.innerHTML = 'ダウンロード中...';
    jishoOutput.innerHTML = await getJisho(inputValue);
}

export async function getKanjiReplacement(query) {
    // const result = await fetchWithFeatures(`http://localhost:5050/?dic=kanji-lookup&word=${query}`, 'text');
    const result = await fetchWithFeatures(`${jishoUrl}/?dic=kanji-lookup&word=${query}`, 'text');
    console.log(result);
    return result.split('');
}