import React, { useState } from 'react'
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useProducts } from '../features/products/useProducts';
import Spinner from '../ui/Spinner';
import AddProductFrom from '../features/products/AddProductFrom';

export default function Products() {

    const { products: productsApi, isLoading } = useProducts()
    const [searchTerm, setSearchTerm] = useState("");

    const columns = [
        { header: "ID", accessor: "sapID", isSortable: true },
        { header: "Product name", accessor: "productName", isSortable: true },
        { header: "Product Type", accessor: "productType", isSortable: true },
        { header: "Price Before Discount", accessor: "priceBeforeDiscount", isSortable: true },
        { header: "Price Before Discount", accessor: "priceAfterDiscount", isSortable: true },
        { header: "Status", accessor: "status", isSortable: false },
    ];

    const rowStates = ["Active", "Inactive", "Archived"];

    if (isLoading) return <Spinner />

    const products = productsApi
        .filter(item => !localStorage.getItem('searchTerm') || Object.values(item).some(value => String(value).toLowerCase().includes(localStorage.getItem('searchTerm').toLowerCase())))

    return (
        <div className="p-12">
            <div className="mb-12">
                <div className="ml-auto w-full flex items-center gap-8 justify-between">
                    <input
                        type="text"
                        value={localStorage.getItem('searchTerm')}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            localStorage.setItem('searchTerm', e.target.value)
                        }}
                        placeholder="Search..."
                        className="w-64 text-2xl border border-gray-300 px-4 py-2 rounded-lg flex-1"
                    />

                    <Modal>
                        <Modal.Open>
                            <Button >Add Product +</Button>
                        </Modal.Open>
                        <Modal.Window position='top'>
                            <AddProductFrom />
                        </Modal.Window>
                    </Modal>
                </div>
            </div>
            <Table
                name={'products'}
                columns={columns}
                data={products}
                rowStates={rowStates}
                rowsPerPage={999999999999999999} // Customize pagination
                view="/products/{id}" // ✅ Pass view URL pattern
            />
        </div >
    )
}
