import React, { useState, useMemo, useEffect } from "react";
import { FaEllipsisV, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Table = ({
    columns,
    data,
    rowStates,
    onRowStateChange,
    menuIcon = <FaEllipsisV />,
    shadow = "shadow-lg",
    rowsPerPage = 5,
    view, // Optional: URL template for the view column
}) => {
    const [sortConfig, setSortConfig] = useState({ key: "", direction: null });
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Memoized sorting for better performance
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Scroll to top when changing pages
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handleStateChange = (rowProp, newState) => {
        onRowStateChange(rowProp, newState);
        setOpenMenuIndex(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getViewUrl = (row) => view ? view.replace(/\{id\}/g, encodeURIComponent(row.id)) : "#";

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
                                            {sortConfig.key === column.accessor ?
                                                (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)
                                                : <FaSort className="text-gray-400" />}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        {view && <th className="py-4 px-6 text-center">View</th>}
                        <th className="py-4 px-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row) => (
                        <tr
                            key={row.id}
                            className={`text-sm text-gray-700 ${row.id % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-200`}
                        >
                            {columns.map((column) => {
                                const cellValue = row[column.accessor];

                                // If column is "status", apply dynamic class
                                const cellClass = column.accessor === "status" ? `status-${cellValue.toLowerCase().replace(/\s+/g, "-")}` : "";

                                return (
                                    <td key={`${row.id}-${column.accessor}`} className={`py-4 px-6 border-t border-gray-300 ${cellClass}`}>
                                        {cellValue}
                                    </td>
                                );
                            })}
                            {view && (
                                <td className="py-4 px-6 text-center border-t border-gray-300">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 transition-all"
                                        onClick={() => navigate(getViewUrl(row))}
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            )}
                            <td className="py-4 px-6 text-center border-t border-gray-300 relative">
                                <button
                                    className="text-gray-600 hover:text-blue-600 transition-all"
                                    onClick={() => setOpenMenuIndex(openMenuIndex === row.id ? null : row.id)}
                                >
                                    {menuIcon}
                                </button>
                                {openMenuIndex === row.id && (
                                    <div className="absolute bg-white border rounded-lg shadow-md mt-1 right-0 w-40 z-10">
                                        {rowStates.map((state) => (
                                            <button
                                                key={state}
                                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStateChange(row.id, state)}
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

            <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-300 bg-white">
                <button
                    className={`px-3 py-1 text-sm font-semibold bg-[#1E293B] rounded-lg m-2 text-white cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    ‹ Prev
                </button>
                <div className="flex space-x-2 mx-4">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 text-sm ${currentPage === index + 1 ? "bg-[#101828] text-white" : "text-[#101828]"} rounded-full hover:bg-[#1E293B] hover:text-white cursor-pointer`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    className={`px-3 py-1 text-sm font-semibold bg-[#1E293B] rounded-lg m-2 text-white cursor-pointer ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
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
