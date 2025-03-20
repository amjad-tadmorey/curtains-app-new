import React, { useState } from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useProducts } from '../features/products/useProducts';
import Spinner from '../ui/Spinner';

export default function Products() {

    const { products: productsApi, isLoading } = useProducts()
    const [searchTerm, setSearchTerm] = useState("");

    const columns = [
        { header: "ID", accessor: "sapID", isSortable: true },
        { header: "Product name", accessor: "productName", isSortable: true },
        { header: "Product Type", accessor: "productType", isSortable: true },
        { header: "In-stock", accessor: "inStock", isSortable: false },
        { header: "Status", accessor: "status", isSortable: false },
    ];

    const rowStates = ["Active", "Inactive", "Archived"];

    if (isLoading) return <Spinner />

    const products = productsApi
        .filter(item => !searchTerm || Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase())))

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-full flex items-center gap-12 justify-between">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-64 text-2xl border border-gray-300 px-4 py-2 rounded-lg flex-1"
                    />
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
                name={'products'}
                columns={columns}
                data={products}
                rowStates={rowStates}
                rowsPerPage={20} // Customize pagination
                view="/products/{id}" // ✅ Pass view URL pattern
            />
        </div>
    )
}
