import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { processFormData, collectState } from './lib/utils.js';

const API = initData(sourceData);

const settings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
};

const sampleTable = initTable(settings, (action) => render({action}));

const applySearching = initSearching('search');
const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const {applyPagination, updatePagination} = initPagination(
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

async function render({ action } = {}) {
    const state = collectState(sampleTable);
    let query = {};

    // последовательность: поиск → фильтр → сортировка → пагинация
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await API.getRecords(query);

    updatePagination(total, query);
    sampleTable.render(items);
}

async function init() {
    const indexes = await API.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers,
    });
}

// ✅ Запуск
init().then(() => render());

    
    // @todo: использование (последовательность: поиск → фильтр → сортировка → пагинация)
    // result = applySearching(result, state, action);
    // result = applyFiltering(result, state, action);
    // result = applySorting(result, state, action);
    // result = applyPagination(result, state, action);

