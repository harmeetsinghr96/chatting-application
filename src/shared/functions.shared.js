/* Pagination function get */
exports.paginate = (array, pageSize, currentPage) => {
    --currentPage; /* because pages logically start with 1, but technically with 0 */
    return array.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
}