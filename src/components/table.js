function cloneTemplate(name) {
    const template =
        document.querySelector(`#${name}Template`) ||
        document.querySelector(`#${name}`);

    if (!template) {
        throw new Error(`Template "${name}" not found in DOM`);
    }

    const fragment = template.content.cloneNode(true);
    const container = fragment.firstElementChild;

    const elements = {};
    container.querySelectorAll('[data-element], [data-name]').forEach((el) => {
        const key = el.dataset.element || el.dataset.name;
        if (key) {
            elements[key] = el;
        }
    });

    return { container, elements };
}

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: Function}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before = [], after = [] } = settings;
    const root = cloneTemplate(tableTemplate);

    [...before].reverse().forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    root.container.addEventListener('change', (e) => {
        onAction(e.target);
    });

    root.container.addEventListener('reset', (e) => {
        setTimeout(() => onAction(e.target));
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data = []) => {
        const nextRows = data.map((item) => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach((key) => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {
        ...root,
        render
    };
}

