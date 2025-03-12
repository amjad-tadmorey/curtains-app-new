import React, { useState } from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import AddOrderForm from '../features/orders/AddOrderForm';
import { useOrders } from '../features/orders/useOrders'
import { useChangeStatus } from '../features/orders/useChangeStatus';
import { useQueryClient } from '@tanstack/react-query';
import Spinner from '../ui/Spinner';
import { formatDate } from '../utils/helpers';
import DateFilter from '../ui/DateFilter';

export default function Orders() {
    const [startDate, setStartDate] = useState(new Date("2025-01-01").toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date("2026-01-01").toISOString().split("T")[0]);
    const [searchTerm, setSearchTerm] = useState("");


    const [editId, setEditId] = useState(null)
    const queryClient = useQueryClient()
    const { orders, isLoading } = useOrders()
    const { changeStatus, isChanging } = useChangeStatus()

    const columns = [
        { header: "ID", accessor: "id", isSortable: true },
        { header: "Created At", accessor: "created_at", isSortable: true },
        { header: "Customer name", accessor: "customer_name", isSortable: true },
        { header: "Phone number", accessor: "phone_number", isSortable: true },
        { header: "Area", accessor: "area", isSortable: true },
        { header: "Delivery type", accessor: "delivery_type", isSortable: true },
        { header: "Delivery Date", accessor: "delivery_date", isSortable: true },
        { header: "Sales man", accessor: "sales_man", isSortable: true },
        { header: "Show room", accessor: "show_room", isSortable: true },
        { header: "Status", accessor: "status", isSortable: true },
        // { header: "View", accessor: "", isSortable: false },
    ];

    const rowStates = ["in-progress", "completed", "closed", "returned"];

    if (isLoading) return <Spinner />



    function onRowStateChange(rowIndex, newState) {
        changeStatus({ rowIndex, newState }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [`orders`] })
            }
        });

    }
    function onRowEdit(id) {
        setEditId(id);
    }

    const sortedOrders = orders
        .map(o => ({ ...o, created_at: formatDate(o.created_at) })) // Create a new object with "created_at" set
        .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date))
        .filter(item => (!startDate || new Date(item.delivery_date) >= new Date(startDate)) && (!endDate || new Date(item.delivery_date) <= new Date(endDate)))
        .filter(item => !searchTerm || Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase())))



    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="w-full flex items-center gap-12">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-64 text-2xl border border-gray-300 px-4 py-2 rounded-lg flex-1"
                    />
                    <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} />
                    <Modal>
                        <Modal.Open opens="add-order">
                            <Button>Add Order +</Button>
                        </Modal.Open>

                        <Modal.Window name="add-order" position="top">
                            <AddOrderForm />
                        </Modal.Window>
                    </Modal>
                </div>
            </div>
            <Table
                columns={columns}
                data={sortedOrders}
                rowStates={rowStates}
                rowsPerPage={20} // Customize pagination
                view="/orders/{id}" // ✅ Pass view URL pattern
                onRowStateChange={onRowStateChange}
                onRowEdit={onRowEdit}
            />
        </div>
    )
}
