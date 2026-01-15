import { getMainInputValue } from "./mainInputHandlers.js";
import fetchArticle from "./services/dictionaryHandler.js";

const tabs = document.getElementById('tabs');

const articles = {
    main: document.getElementById('main-article'),
    translate: document.getElementById('translate-article'),
    ai: document.getElementById('ai-article'),
}

const resultsFor = { main: '', translate: '', ai: '' };

const mainTab = tabs.querySelector(`[name="main"]`);
let active = 'main';
let activeTab = mainTab;

let query = '';

function useQuery() {
    if (query === resultsFor[active]) return;
    resultsFor[active] = query;
    fetchArticle(query, active);
}

function changeTab(newTab) {
    activeTab.classList.remove('active');
    activeTab = newTab;
    activeTab.classList.add('active');

    articles[active].classList.add('hidden');
    active = newTab.name;
    articles[active].classList.remove('hidden');
}

function handleClick({ target }) {
    if (!target.classList.contains('tab') || target.classList.contains('active')) return;
    changeTab(target);
    useQuery();
}

export default function addTabsHandler() {
    tabs.addEventListener('click', handleClick);

    document.addEventListener('new-query', () => {
        query = getMainInputValue();
        if (active !== 'main') changeTab(mainTab);
        useQuery();
    });
}