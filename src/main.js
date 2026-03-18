import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import { processFormData, collectState } from './lib/utils.js';

const sourceData = window.sourceData || {};
const API = initData(sourceData);

const settings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
};

let sampleTable;
let applySearching, applyFiltering, updateIndexes, applySorting, applyPagination, updatePagination;

async function initializeComponents() {
    sampleTable = initTable(settings, (action) => render({action}));

    applySearching = initSearching('search');
    const filteringResult = initFiltering(sampleTable.filter.elements);
    applyFiltering = filteringResult.applyFiltering;
    updateIndexes = filteringResult.updateIndexes;
    
    applySorting = initSorting([
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);
    
    const paginationResult = initPagination(
        sampleTable.pagination.elements,
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            if (input) input.value = page;
            if (input) input.checked = isCurrent;
            if (label) label.textContent = page;
            return el;
        }
    );
    applyPagination = paginationResult.applyPagination;
    updatePagination = paginationResult.updatePagination;
}

async function render({ action } = {}) {
    try {
        const state = collectState(sampleTable);
        let query = {};

        query = applySearching(query, state, action);
        query = applyFiltering(query, state, action);
        query = applySorting(query, state, action);
        query = applyPagination(query, state, action);

        const { total, items } = await API.getRecords(query);
        updatePagination(total, query);
        sampleTable.render(items);
    } catch (error) {
        console.error('Render error:', error);
    }
}

async function init() {
    try {
        const indexes = await API.getIndexes();
        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers,
        });
    } catch (error) {
        console.error('Init error:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeComponents();
    await init();
    render();
});


    
    // @todo: использование (последовательность: поиск → фильтр → сортировка → пагинация)
    // result = applySearching(result, state, action);
    // result = applyFiltering(result, state, action);
    // result = applySorting(result, state, action);
    // result = applyPagination(result, state, action);

