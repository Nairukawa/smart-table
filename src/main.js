import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { processFormData, collectState } from './lib/utils.js';

const data = await initData();
const indexes = data.indexes;
const sampleData = data.table;

// @todo: подготовка настроек таблицы
const settings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
};

// @todo: инициализация
const sampleTable = initTable(settings, (action) => render({action}));

const applySearching = initSearching('search');
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// @todo: рендер
function render({action} = {}) {
    const state = collectState(sampleTable);
    
    let result = sampleData;
    
    // @todo: использование (последовательность: поиск → фильтр → сортировка → пагинация)
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    
    sampleTable.render(result);
}

// Первоначальный рендер
render();

