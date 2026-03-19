const sortMap = {
    none: 'asc',
    asc: 'desc',
    desc: 'none'
};

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        if (action && action.dataset && action.dataset.field) {
            const current = action.dataset.value || 'none';
            const next = sortMap[current] || 'none';

            columns.forEach((column) => {
                if (!column || !column.dataset) return;

                if (column.dataset.field === action.dataset.field) {
                    column.dataset.value = next;
                    field = column.dataset.field;
                    order = next;
                } else {
                    column.dataset.value = 'none';
                }
            });
        } else {
            columns.forEach((column) => {
                if (!column || !column.dataset) return;

                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        const sort = field && order !== 'none'
            ? `${field}:${order}`
            : null;

        return sort
            ? Object.assign({}, query, { sort })
            : query;
    };
}
