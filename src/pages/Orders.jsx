import React from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import AddOrderForm from '../features/orders/AddOrderForm';
import { useOrders } from '../features/orders/useOrders'

export default function Orders() {
    const { orders, isLoading } = useOrders()

    const columns = [
        { header: "ID", accessor: "id", isSortable: true },
        { header: "Customer name", accessor: "customer_name", isSortable: true },
        { header: "Phone number", accessor: "phone_number", isSortable: false },
        { header: "Delivery type", accessor: "delivery_type", isSortable: false },
        { header: "Sales man", accessor: "sales_man", isSortable: false },
        { header: "Show room", accessor: "show_room", isSortable: false },
        { header: "Status", accessor: "status", isSortable: false },
        { header: "View", accessor: "", isSortable: false },
    ];

    const rowStates = ["Active", "Inactive", "Archived"];

    if (isLoading) return null
    console.log(orders);

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-fit">
                    <Modal>
                        <Modal.Open>
                            <Button >Add Order +</Button>
                        </Modal.Open>
                        <Modal.Window position='top'>
                            <AddOrderForm />
                        </Modal.Window>
                    </Modal>
                </div>
            </div>
            <Table
                columns={columns}
                data={orders}
                rowStates={rowStates}
                rowsPerPage={20} // Customize pagination
            />
        </div>
    )
}
