import React from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import AddOrderForm from '../features/orders/AddOrderForm';
import { useOrders } from '../features/orders/useOrders'
import { useChangeStatus } from '../features/orders/useChangeStatus';
import { useQueryClient } from '@tanstack/react-query';

export default function Orders() {
    const queryClient = useQueryClient()
    const { orders, isLoading } = useOrders()
    const { changeStatus, isChanging } = useChangeStatus()

    const columns = [
        { header: "ID", accessor: "id", isSortable: true },
        { header: "Customer name", accessor: "customer_name", isSortable: true },
        { header: "Phone number", accessor: "phone_number", isSortable: false },
        { header: "Delivery type", accessor: "delivery_type", isSortable: false },
        { header: "Delivery Date", accessor: "delivery_date", isSortable: true },
        { header: "Sales man", accessor: "sales_man", isSortable: false },
        { header: "Show room", accessor: "show_room", isSortable: false },
        { header: "Status", accessor: "status", isSortable: true },
        // { header: "View", accessor: "", isSortable: false },
    ];

    const rowStates = ["in-progress", "completed", "closed", "returned"];

    if (isLoading) return null

    function onRowStateChange(rowIndex, newState) {
        changeStatus({ rowIndex, newState }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [`orders`] })
            }
        });

    }



    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-fit">
                    <Modal>
                        <Modal.Open>
                            <Button >Add Order +</Button>
                        </Modal.Open>
                        <Modal.Window position='top'>
                            <AddOrderForm close={close} />
                        </Modal.Window>
                    </Modal>
                </div>
            </div>
            <Table
                columns={columns}
                data={orders.sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date))}
                rowStates={rowStates}
                rowsPerPage={20} // Customize pagination
                view="/orders/{id}" // ✅ Pass view URL pattern
                onRowStateChange={onRowStateChange}
            />
        </div>
    )
}
