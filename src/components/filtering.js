export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (!elements[elementName]) return;

            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                })
            );
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            if (field && state[field] !== undefined) {
                state[field] = '';
            }

            const input = action.parentElement?.querySelector('input, select');
            if (input) {
                input.value = '';
            }
        }

        const filter = {};

        Object.keys(elements).forEach((key) => {
            const element = elements[key];
            if (!element) return;

            if (['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                filter[`filter[${element.name}]`] = element.value;
            }
        });

        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}