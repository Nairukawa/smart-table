import { initData } from './data.js';
import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
import './style.css';

const API = initData();

const settings = {
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
};

let sampleTable;
let applySearching;
let applyFiltering;
let updateIndexes;
let applySorting;
let applyPagination;
let updatePagination;

function collectState(table) {
    const state = {};

    if (!table?.container) {
        return state;
    }

    table.container.querySelectorAll('input, select').forEach((el) => {
        const key = el.name || el.dataset.field;
        if (!key) return;

        if (el.type === 'radio') {
            if (el.checked) {
                state[key] = el.value;
            }
            return;
        }

        state[key] = el.value;
    });

    state.page = Number(state.page) || 1;
    state.rowsPerPage = Number(state.rowsPerPage) || 10;

    return state;
}

document.addEventListener('DOMContentLoaded', () => {
    sampleTable = initTable(settings, (action) => render(action));

    const app = document.querySelector('#app');
    app.append(sampleTable.container);

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

            if (input) {
                input.value = page;
                input.checked = isCurrent;
            }

            if (label) {
                label.textContent = page;
            }

            return el;
        }
    );

    applyPagination = paginationResult.applyPagination;
    updatePagination = paginationResult.updatePagination;

    init().then(() => render());
});

async function render(action) {
    const state = collectState(sampleTable);
    let query = {};

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
        searchBySeller: indexes.sellers
    });
}