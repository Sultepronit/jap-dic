import { getMainInputValue } from "../mainInputHandlers";
import fetchWithFeatures from "./fetchWithFeatures";

const jardicOutput = document.getElementById('jardic');
const jishoOutput = document.getElementById('jisho');

const jardicUrl = import.meta.env.VITE_JAR_URL;
async function getJardic(query) {  
    const url = `${jardicUrl}/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&q=${query}&page=1`;
    const fetched = await fetchWithFeatures(url, 'text');
    
    const result = fetched
        .split('<table id="tabContent" width="100%">')[1]
        .split('</table>')[0]
        .replaceAll('width="65%"', '')
        .replaceAll('width="35%"', '');
    
   return `<table><tbody>${result}</tbody></table>`; 
}

const jishoUrl = import.meta.env.VITE_JISHO_URL;
async function getJisho(query) {    
    // return await fetchWithFeatures(`${jishoUrl}/?dic=jisho&word=${query}`, 'text');
    return await fetchWithFeatures(`${jishoUrl}/grabber/jisho?request=${query}`, 'text');
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

export async function getKanjiReplacement(query, attempt = 1) {
    const attQuery = attempt > 1 ? `&attempt=${attempt}` : '';
    // const url = `${jishoUrl}/?dic=kanji-lookup&word=${query}${attQuery}`
    const url = `${jishoUrl}/artificial/guess-kanji?request=${query}${attQuery}`
    const result = await fetchWithFeatures(url, 'text');
    console.log(result);
    return result.split('');
}