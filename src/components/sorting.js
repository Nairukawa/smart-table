export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = "none";

        // @todo: #3.1 — обработать действия сортировки
        if (action) {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;
        }

        // @todo: #3.3 — применить выбранный режим сортировки при перерисовках
        columns.forEach((column) => {
            if (column.dataset.value !== "none") {
                field = column.dataset.field;
                order = column.dataset.value;
            }
        });

        // @todo: #3.2 — сбросить состояние других кнопок сортировки
        if (action) {
            columns.forEach((column) => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = "none";
                }
            });
        }

        const sort =
            field && order !== "none" ? `${field}:${order}` : null;

        return sort ? Object.assign({}, query, { sort }) : query;
    };
}