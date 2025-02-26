
export default async function getJardic(query) {    
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&dic_yarxi=on&q=${query}&page=1`);
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&q=${query}&page=1`);
    const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&q=${query}&page=1`);
    const fetched = await response.text();
    
    const result = fetched
        .split('<table id="tabContent" width="100%">')[1]
        .split('</table>')[0]
        .replaceAll('width="65%"', '')
        .replaceAll('width="35%"', '');
    
   return `<table><tbody>${result}</tbody></table>`; 
}

const jishoUrl = import.meta.env.VITE_JISHO_URL;

export async function getJisho(query) {    
    const response = await fetch (`${jishoUrl}/?dic=jisho&word=${query}`);
    const fetched = await response.text();
    
   return fetched; 
}