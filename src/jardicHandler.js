// import { jishoUrl } from "./secret.js";

// await fetch (jishoUrl);
// await fetch ('http://localhost:5000?dic=jisho&word=全部');

export default async function getJardic(query) {    
    // const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&dic_yarxi=on&q=${query}&page=1`);
    const response = await fetch(`https://us-central1-word-exp.cloudfunctions.net/fetchWebsiteContent?dic_jardic=on&dic_warodai=on&dic_edict=on&q=${query}&page=1`);
    const fetched = await response.text();
    
    const result = fetched
        .split('<table id="tabContent" width="100%">')[1]
        .split('</table>')[0]
        .replaceAll('width="65%"', '')
        .replaceAll('width="35%"', '');
    
   return `<table><tbody>${result}</tbody></table>`; 
}

// export default async function getJardic(query) {    
//     // const response = await fetch(`http://localhost:5000?dic=jisho&word=${query}`);
//     const response = await fetch (`${jishoUrl}${query}`);
//     const fetched = await response.text();
    
//    return fetched; 
// }