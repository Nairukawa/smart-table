const sortMap = {
    none: 'up',
    up: 'down',
    down: 'none'
};

export function initSorting(columns) {
    let activeField = null;
    let activeOrder = 'none';

    const syncButtons = () => {
        columns.forEach((column) => {
            if (!column?.dataset) return;

            if (column.dataset.field === activeField) {
                column.dataset.value = activeOrder;
            } else {
                column.dataset.value = 'none';
            }
        });
    };

    return (query, state, action) => {
        if (action?.name === 'sort' && action.dataset?.field) {
            const clickedField = action.dataset.field;

            if (activeField !== clickedField) {
                activeField = clickedField;
                activeOrder = 'up';
            } else {
                activeOrder = sortMap[activeOrder] || 'none';

                if (activeOrder === 'none') {
                    activeField = null;
                }
            }
        }

        syncButtons();

        if (!activeField || activeOrder === 'none') {
            return query;
        }

        return Object.assign({}, query, {
            sort: `${activeField}:${activeOrder}`
        });
    };
}