import { getMainInputValue } from "./mainInputHandlers.js";
import fetchArticle from "./services/dictionaryHandler.js";

const tabs = document.getElementById('tabs');

const articles = {
    main: document.getElementById('main-article'),
    translate: document.getElementById('translate-article'),
    ai: document.getElementById('ai-article'),
}

const resultsFor = { main: '', translate: '', ai: '' };

let active = 'main';
let activeTab = tabs.querySelector(`[name="main"]`);

let query = '';

function useQuery() {
    if (query === resultsFor[active]) return;
    resultsFor[active] = query;
    fetchArticle(query, active);
}

function handleClick({ target }) {
    if (!target.classList.contains('tab') || target.classList.contains('active')) return;

    activeTab.classList.remove('active');
    activeTab = target;
    activeTab.classList.add('active');

    articles[active].classList.add('hidden');
    active = target.name;
    articles[active].classList.remove('hidden');

    useQuery();
}
tabs.addEventListener('click', handleClick);

export default function addTabsHandler() {
    console.log(tabs);
    tabs.addEventListener('click', handleClick);
}

document.addEventListener('new-query', () => {
    query = getMainInputValue();
    useQuery();
});