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

export default function Orders() {
    const [editId, setEditId] = useState(null)
    const queryClient = useQueryClient()
    const { orders, isLoading } = useOrders()
    const { changeStatus, isChanging } = useChangeStatus()

    const columns = [
        { header: "ID", accessor: "id", isSortable: true },
        { header: "Created At", accessor: "created_at", isSortable: true },
        { header: "Customer name", accessor: "customer_name", isSortable: true },
        { header: "Phone number", accessor: "phone_number", isSortable: true },
        { header: "Delivery type", accessor: "delivery_type", isSortable: true },
        { header: "Delivery Date", accessor: "delivery_date", isSortable: true },
        { header: "Sales man", accessor: "sales_man", isSortable: true },
        { header: "Show room", accessor: "show_room", isSortable: true },
        { header: "Status", accessor: "status", isSortable: true },
        // { header: "View", accessor: "", isSortable: false },
    ];

    const rowStates = ["in-progress", "completed", "closed", "returned"];

    if (isLoading) return <Spinner />

    console.log(orders);


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
        .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-fit">
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
            // enableEdit={true}
            />
            {
                editId && <Modal.Window setEditId={setEditId} name="always-visible">
                    <AddOrderForm edit={editId} />
                </Modal.Window>
            }
        </div>
    )
}
