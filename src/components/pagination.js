export function initPagination(elements, createPage) {
    const { pages, fromRow, toRow, totalRows } = elements;

    let pageCount = 1;

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = Number(state.rowsPerPage) || 10;
        let page = Number(state.page) || 1;

        if (action?.name === 'first') {
            page = 1;
        }

        if (action?.name === 'prev') {
            page = Math.max(1, page - 1);
        }

        if (action?.name === 'next') {
            page = Math.min(pageCount, page + 1);
        }

        if (action?.name === 'last') {
            page = pageCount;
        }

        if (action?.name === 'page' && action.value) {
            page = Number(action.value) || 1;
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page = 1, limit = 10 }) => {
        pageCount = Math.max(1, Math.ceil(total / limit));

        pages.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const pageElement = createPage(
                pageTemplate.cloneNode(true),
                i,
                i === Number(page)
            );
            pages.append(pageElement);
        }

        const from = total === 0 ? 0 : (Number(page) - 1) * limit + 1;
        const to = total === 0 ? 0 : Math.min(Number(page) * limit, total);

        fromRow.textContent = from;
        toRow.textContent = to;
        totalRows.textContent = total;
    };

    return {
        updatePagination,
        applyPagination
    };
}