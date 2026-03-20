export function initPagination(elements, createPage) {
    const { pages, fromRow, toRow, totalRows } = elements;

    let pageCount = 1;

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = Number(state.rowsPerPage) || 10;
        let page = Number(state.page) || 1;

        if (action?.name === 'rowsPerPage') {
            page = 1;
        }

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

        if (
            action?.name === 'search' ||
            action?.name === 'date' ||
            action?.name === 'customer' ||
            action?.name === 'seller' ||
            action?.name === 'totalFrom' ||
            action?.name === 'totalTo' ||
            action?.name === 'clear' ||
            action?.name === 'sort'
        ) {
            page = 1;
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page = 1, limit = 10 }) => {
        const currentPage = Number(page) || 1;
        pageCount = Math.max(1, Math.ceil(total / limit));

        pages.innerHTML = '';

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(pageCount, startPage + 2);

        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageElement = createPage(
                pageTemplate.cloneNode(true),
                i,
                i === currentPage
            );
            pages.append(pageElement);
        }

        const from = total === 0 ? 0 : (currentPage - 1) * limit + 1;
        const to = total === 0 ? 0 : Math.min(currentPage * limit, total);

        fromRow.textContent = String(from);
        toRow.textContent = String(to);
        totalRows.textContent = String(total);
    };

    return {
        updatePagination,
        applyPagination
    };
}