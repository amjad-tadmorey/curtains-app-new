import React, { useEffect, useState } from 'react'
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
import supabase from '../services/supabase';

export default function Orders() {
    const [startDate, setStartDate] = useState(new Date("2025-01-01").toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date("2026-01-01").toISOString().split("T")[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const queryClient = useQueryClient()
    const { orders: ordersApi, isLoading: isLoadingOrders } = useOrders()
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
        { header: "Branch", accessor: "branch", isSortable: true },
        { header: "Status", accessor: "status", isSortable: true },
        // { header: "View", accessor: "", isSortable: false },
    ];

    const rowStates = ["قيد الانتظار", "جاري", "تم الاستلام", "مقفل", "مرتجع"];

    if (isLoadingOrders) return <Spinner />



    function onRowStateChange(data) {
        const { rowId, state } = data
        changeStatus({ rowIndex: rowId, newState: state }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [`orders`] })
            }
        });

    }
    const orders = ordersApi
        .map(o => ({ ...o, created_at: formatDate(o.created_at) }))
        .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date))
        .filter(item => (!startDate || new Date(item.delivery_date) >= new Date(startDate)) && (!endDate || new Date(item.delivery_date) <= new Date(endDate)))
        .filter(item =>
            !localStorage.getItem('searchTerm-products') ||
            [item.customer_name, item.phone_number].some(value =>
                String(value).toLowerCase().includes(localStorage.getItem('searchTerm-products').toLowerCase())
            )
        )

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="w-full flex items-center gap-12 flex-col-reverse lg:flex-row">
                    <input
                        type="text"
                        value={localStorage.getItem('searchTerm-products')}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            localStorage.setItem('searchTerm-products', e.target.value)
                        }}
                        placeholder="Search..."
                        className="lg:w-64 text-2xl border border-gray-300 px-4 py-2 rounded-lg flex-1 w-full"
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
                name={'orders'}
                columns={columns}
                data={orders}
                rowStates={rowStates}
                actions={true}
                rowsPerPage={99999999999999999999999999999999999} // Customize pagination
                view="/orders/view/{id}" // ✅ Pass view URL pattern
                onRowStateChange={onRowStateChange}
            />
        </div>
    )
}
