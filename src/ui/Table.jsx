import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const Table = ({
    columns,
    data,
    rowStates,
    onRowStateChange,
    menuIcon = <FaEllipsisV />,
    shadow = "shadow-lg",
    rowsPerPage = 5,
}) => {
    const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Sorting logic applied before pagination
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handleStateChange = (rowIndex, newState) => {
        onRowStateChange(rowIndex, newState);
        setOpenMenuIndex(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={`overflow-x-auto ${shadow} rounded-lg`}>
            <table className="min-w-full border-collapse bg-white rounded-lg">
                <thead className="bg-gray-100 text-gray-600">
                    <tr className="text-sm">
                        {columns.map((column, index) => (
                            <th
                                key={`${column.header}-${index}`}
                                className="py-4 px-6 text-left font-medium cursor-pointer relative"
                                style={{ width: column.width }}
                                onClick={() => column.isSortable && handleSort(column.accessor)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{column.header}</span>
                                    {column.isSortable && (
                                        <span className="ml-2 text-xs">
                                            {sortConfig.key === column.accessor && sortConfig.direction === "asc"
                                                ? "↑"
                                                : sortConfig.key === column.accessor && sortConfig.direction === "desc"
                                                    ? "↓"
                                                    : ""}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        <th className="py-4 px-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`text-sm text-gray-700 ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-200`}
                        >
                            {columns.map((column) => (
                                <td key={`${rowIndex}-${column.accessor}`} className="py-4 px-6 border-t">
                                    {row[column.accessor]}
                                </td>
                            ))}
                            <td className="py-4 px-6 text-center border-t relative">
                                <button
                                    className="text-gray-600 hover:text-blue-600 transition-all"
                                    onClick={() => setOpenMenuIndex(openMenuIndex === rowIndex ? null : rowIndex)}
                                >
                                    {menuIcon}
                                </button>
                                {openMenuIndex === rowIndex && (
                                    <div className="absolute bg-white border rounded-lg shadow-md mt-1 right-0 w-40 z-10">
                                        {rowStates.map((state) => (
                                            <button
                                                key={state}
                                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStateChange(rowIndex, state)}
                                            >
                                                {state}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end items-center mt-4 pt-4 border-t bg-white">
                <button
                    className={`px-6 py-2 text-sm font-semibold ${currentPage === 1 ? "text-gray-400" : "text-blue-600"}`}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    ‹ Prev
                </button>
                <div className="flex space-x-2 mx-4">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 text-sm ${currentPage === index + 1 ? "bg-blue-600 text-white" : "text-blue-600"} rounded-full hover:bg-blue-200`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    className={`px-6 py-2 text-sm font-semibold ${currentPage === totalPages ? "text-gray-400" : "text-blue-600"}`}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next ›
                </button>
            </div>
        </div>
    );
};

export default Table;
