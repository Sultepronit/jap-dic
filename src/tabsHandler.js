const tabs = document.getElementById('tabs');

const articles = {
    main: document.getElementById('main-article'),
    translate: document.getElementById('translate-article'),
    ai: document.getElementById('ai-article'),
}

let active = 'main';
let activeTab = tabs.querySelector(`[name="main"]`);

function handleClick({ target }) {
    if (!target.classList.contains('tab') || target.classList.contains('active')) return;

    activeTab.classList.remove('active');
    activeTab = target;
    activeTab.classList.add('active');

    articles[active].classList.add('hidden');
    active = target.name;
    articles[active].classList.remove('hidden');
}

export default function addTabsHandler() {
    console.log(tabs);
    tabs.addEventListener('click', handleClick);
}