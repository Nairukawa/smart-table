import { createComparison } from "../lib/utils.js";
const defaultRules = [/* правила из utils */];

export function initFiltering(elements, indexes) {
    return (data, state, action) => {
        // @todo: #4.1 — заполнить select опциями
        Object.keys(indexes).forEach(elementName => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        });

        // @todo: #4.2 — очистка полей (опционально)
        if (action?.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        // @todo: #4.3 — функция сравнения
        const compare = createComparison(defaultRules);

        // @todo: #4.5 — фильтрация данных
        return data.filter(row => compare(row, state));
    };
}
