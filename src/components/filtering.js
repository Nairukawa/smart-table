export function initFiltering(elements, indexes = {}) {
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                }));
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
            const input = action.parentElement?.querySelector('input');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key] && ['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                filter[`filter[${elements[key].name}]`] = elements[key].value;
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    if (indexes && Object.keys(indexes).length) {
        updateIndexes(indexes);
    }

    return {
        updateIndexes,
        applyFiltering
    };
}
