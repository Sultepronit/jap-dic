import fetchWithFeatures from "./services/fetchWithFeatures";

const activeLib = {};

async function getList(needle) {
    const index = needle[0];
    if (activeLib[index]) return activeLib[index];

    console.log('fetching list...');
    // try {
    //     // const result = await fetch(`../lib/${index}.json`);
    //     // const list = await result.json();

    //     activeLib[index] = list;
    //     return list;
    // } catch (error) {
    //     return [];
    // }
    // fetchWithFeatures('https://example.comm');
    const list = await fetchWithFeatures(`../lib/${index}.json`, 'json');
    activeLib[index] = list;
    return list || []; 
}

const cachedResults = {};
export async function findCandidates(needle) {
    if (!needle) return [];
    if (cachedResults[needle]) return cachedResults[needle];
    console.log(`Searching for ${needle}...`);

    const list = await getList(needle);
    // console.log(list);

    const matches = [];
    for (const [key, options] of list) {
        if(needle.startsWith(key)) {
            matches.push({
                found: key,
                remainder: needle.replace(key, ''),
                options: typeof options === 'string' ? [options] : options
            });
        }
    }
    
    matches.reverse();

    console.table(matches);
    cachedResults[needle] = matches;

    return matches;
}