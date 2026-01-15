import { getMainInputValue } from "../mainInputHandlers";
import fetchWithFeatures from "./fetchWithFeatures";

const jardicOutput = document.getElementById('jardic');
const jishoOutput = document.getElementById('jisho');
const translationArticle = document.getElementById('translate-article');
const aiAtricle = document.getElementById('ai-article');

const jishoUrl = import.meta.env.VITE_JISHO_URL;
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

async function getJisho(query) {    
    // return await fetchWithFeatures(`${jishoUrl}/?dic=jisho&word=${query}`, 'text');
    return await fetchWithFeatures(`${jishoUrl}/grabber/jisho?request=${query}`, 'text');
}

async function updateMainArticle(query) {
    jardicOutput.innerHTML = 'ダウンロード中...';
    getJardic(query).then(result => jardicOutput.innerHTML = result);

    jishoOutput.innerHTML = 'ダウンロード中...';
    jishoOutput.innerHTML = await getJisho(query);
}

async function updateTranslation(query) {
    translationArticle.innerHTML = 'ダウンロード中...';
    const url = `${jishoUrl}/gtranslate/ja-uk?request=${query}`;
    translationArticle.innerHTML = await fetchWithFeatures(url, 'text');
}

async function updateAi(query) {
    translationArticle.innerHTML = 'ダウンロード中...';
    const url = `${jishoUrl}/artificial/translate-ja-uk?request=${query}`;
    aiAtricle.innerHTML = await fetchWithFeatures(url, 'text');
}

export default async function fetchArticle(query, mode) {
    switch (mode) {
        case 'main': 
            updateMainArticle(query);
            break;
        case 'translate':
            updateTranslation(query);
            break;
        case 'ai':
            updateAi(query);
            break;
    }  
}

export async function getKanjiReplacement(query, attempt = 1) {
    const attQuery = attempt > 1 ? `&attempt=${attempt}` : '';
    // const url = `${jishoUrl}/?dic=kanji-lookup&word=${query}${attQuery}`
    const url = `${jishoUrl}/artificial/guess-kanji?request=${query}${attQuery}`
    const result = await fetchWithFeatures(url, 'text');
    console.log(result);
    return result.split('');
}