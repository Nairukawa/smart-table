export function initPagination(elements, createPage) {
    const { pages, fromRow, toRow, totalRows } = elements;
    
    return (data, state, action) => {
        // @todo: #2.1
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;


        // @todo: #2.2
        const skip = (page - 1) * rowsPerPage;
        const visibleData = data.slice(skip, skip + rowsPerPage);

        // @todo: #2.3
        const pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.firstElementChild.remove();


const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // переносим код, который делали под @todo: #2.6

    return Object.assign({}, query, { // добавим параметры к query, но не изменяем исходный объект
        limit,
        page
    });
}

const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // переносим код, который делали под @todo: #2.4
    // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
}

return {
    updatePagination,
    applyPagination
};

    };
}
