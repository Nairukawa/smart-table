import { sortMap } from "../lib/utils.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = 'none';

        // @todo: #3.1 — обработать действия сортировки
        if (action) {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;
        }

        // @todo: #3.3 — применить выбранный режим сортировки при перерисовках
        columns.forEach(column => {
            if (column.dataset.value !== 'none') {
                field = column.dataset.field;
                order = column.dataset.value;
            }
        });

        // @todo: #3.2 — сбросить состояние других кнопок сортировки
        if (action) {
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        }

        // Применяем сортировку только если выбрано поле и направление
        if (field && order !== 'none') {
            return [...data].sort((a, b) => {
                const aValue = a[field];
                const bValue = b[field];
                
                if (order === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        return data;
    };
}
