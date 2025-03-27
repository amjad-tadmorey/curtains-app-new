import React, { useState, useMemo, useEffect } from "react";
import { FaEllipsisV, FaEye, FaSort, FaSortUp, FaSortDown, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MiniSpinner from "./MiniSpinner";
import { useAuth } from "../context/AuthContext";

const Table = ({
    name,
    columns,
    data,
    actions,
    rowStates,
    onRowStateChange,
    menuIcon = <FaEllipsisV />,
    shadow = "shadow-lg",
    rowsPerPage = 5,
    view,
    print,
}) => {
    const { user, isLoading } = useAuth()
    const [sortConfig, setSortConfig] = useState(() => {
        const savedSort = localStorage.getItem(`${name}-tableSortConfig`);
        return savedSort ? JSON.parse(savedSort) : { key: "", direction: null };
    });
    const [filters, setFilters] = useState(() => {
        const savedFilters = localStorage.getItem(`${name}-tableFilters`);
        return savedFilters ? JSON.parse(savedFilters) : {};
    });
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingRowId, setLoadingRowId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(`${name}-tableSortConfig`, JSON.stringify(sortConfig));
    }, [sortConfig]);

    useEffect(() => {
        localStorage.setItem(`${name}-tableFilters`, JSON.stringify(filters));
    }, [filters]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            Object.entries(filters).every(([key, value]) =>
                value ? String(row[key]).toLowerCase() === value.toLowerCase() : true
            )
        );
    }, [data, filters]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getViewUrl = (row) => (view ? view.replace(/\{id\}/g, encodeURIComponent(row.id)) : "#");
    const getPrintUrl = (row) => (print ? print.replace(/\{id\}/g, encodeURIComponent(row.id)) : "#");

    function authClose() {
        setOpenMenuIndex(null)
        alert('ليس لديك صلاحية تغيير حالة العميل')
    }

    const handleRowStateChange = async (rowId, state) => {
        if (user.user_metadata.role !== 'admin') return authClose()


        setLoadingRowId(rowId);
        try {
            await new Promise((resolve, reject) => {
                onRowStateChange({ rowId, state }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: [`orders`] });
                        resolve();
                    },
                    onError: (error) => {
                        console.error("Error changing state:", error);
                        reject(error);
                    }
                });
                setOpenMenuIndex(null)
                setLoadingRowId(null);
            });
        } catch (error) {
            console.error("Failed to change row state:", error);
        } finally {
        }
    };

    useEffect(() => {
        document.addEventListener("click", function (event) {
            if (event.target.closest('td') === null || !event.target.closest('td').classList.contains('menu')) {
                setOpenMenuIndex(null)
            }
        });
    }, [])


    console.log(data);


    return (
        <div className={`overflow-x-auto ${shadow} rounded-lg`}>
            <table className="min-w-full border-collapse bg-white rounded-lg">
                <thead className="bg-gray-100 text-gray-600">
                    <tr className="text-sm">
                        {columns.map((column, index) => (
                            <th key={`${column.header}-${index}`} className="py-2 px-6 text-left font-medium relative">
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => column.isSortable && handleSort(column.accessor)}>
                                    <span>{column.header}</span>
                                    {column.isSortable && (
                                        <span className="ml-2 text-xs">
                                            {sortConfig.key === column.accessor ? (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                                        </span>
                                    )}
                                </div>
                                <select
                                    className="mt-1 p-1 w-full text-sm border rounded"
                                    value={filters[column.accessor] || ""}
                                    onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                                >
                                    <option value="">All</option>
                                    {[...new Set(data.map(row => row[column.accessor]))].map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </th>

                        ))}
                        {view && <th className="py-2 px-6 text-center">View</th>}
                        {print && <th className="py-2 px-6 text-center">Print</th>}
                        {actions && <th className="py-2 px-6 text-center">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row) => (
                        <tr key={row.id} className="text-sm text-gray-700 hover:bg-gray-200">
                            {
                                columns.map((column) => {
                                    const cellValue = row[column.accessor];
                                    const cellClass = column.accessor === "status" ? `status-${cellValue.toLowerCase().replace(/\s+/g, "-")}` : "";

                                    return (
                                        <td key={`${row.id}-${column.accessor}`} className={`py-4 px-6 border-t border-gray-300 ${cellClass}`}>
                                            {cellValue}
                                        </td>
                                    );
                                })
                            }
                            {view && (
                                <td className="py-4 px-6 text-center border-t border-gray-300">
                                    <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(getViewUrl(row))}>
                                        <FaEye />
                                    </button>
                                </td>
                            )}
                            {print && (
                                <td className="py-4 px-6 text-center border-t border-gray-300">
                                    <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(getPrintUrl(row))}>
                                        <FaPrint />
                                    </button>
                                </td>
                            )}
                            {
                                actions && <td className="menu py-4 px-6 text-center border-t border-gray-300 relative">
                                    <button className="text-gray-600 hover:text-blue-600" onClick={() => setOpenMenuIndex(openMenuIndex === row.id ? null : row.id)}>
                                        {menuIcon}
                                    </button>
                                    {openMenuIndex === row.id && (
                                        <div className="menu absolute bg-white border rounded-lg shadow-md mt-1 right-0 w-40 z-10 h-44 flex justify-center items-center flex-col">
                                            {
                                                loadingRowId !== null ? <MiniSpinner /> :
                                                    rowStates.map((state) => (
                                                        <button key={state} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100" onClick={() => handleRowStateChange(row.id, state)}>
                                                            {state}
                                                        </button>
                                                    ))
                                            }
                                        </div>
                                    )}
                                </td>
                            }
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
