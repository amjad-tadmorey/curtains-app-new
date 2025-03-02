import React from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useProducts } from '../features/products/useProducts';
import Spinner from '../ui/Spinner';

export default function Products() {

    const { products, isLoading } = useProducts()

    const columns = [
        { header: "ID", accessor: "sapID", isSortable: true },
        { header: "Product name", accessor: "productName", isSortable: true },
        { header: "In-stock", accessor: "inStock", isSortable: false },
        { header: "Status", accessor: "status", isSortable: false },
    ];

    const rowStates = ["Active", "Inactive", "Archived"];

    if (isLoading) return <Spinner />

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-fit">
                    <Modal>
                        <Modal.Open>
                            <Button >Add Product +</Button>
                        </Modal.Open>
                        <Modal.Window position='top'>
                        </Modal.Window>
                    </Modal>
                </div>
            </div>
            <Table
                columns={columns}
                data={products}
                rowStates={rowStates}
                rowsPerPage={20} // Customize pagination
                view="/products/{id}" // ✅ Pass view URL pattern
            />
        </div>
    )
}
