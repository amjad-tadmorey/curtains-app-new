import React, { useEffect } from 'react'
import { useProductById } from '../features/products/useProductById';
import { useQueryClient } from '@tanstack/react-query';
import Card from '../ui/Card';
import { FaBox, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProductView() {
    const queryClient = useQueryClient()

    const navigate = useNavigate()
    useEffect(() => {
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                navigate('/products')
                // Perform your action here
            }
        });

    }, [])

    const { product, isLoadingProduct } = useProductById();
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: [`product-${product?.id}`] })
    }, [product])

    if (isLoadingProduct) return <p>Loading...</p>;


    console.log(product);

    const {
        id,
        created_at,
        oldID,
        productName,
        inStock,
        productType,
        price,
        status,
        sapID,
    } = product


    return (
        <div className="p-6 bg-white shadow-lg rounded-lg flex items-stretch gap-4">
            {/* General Info Card */}
            <Card>
                <Card.Header>
                    <FaInfoCircle className="text-blue-500" /> General Information
                </Card.Header>
                <Card.Body>
                    <p className='flex flex-col'><strong>ID:</strong> {sapID}</p>
                    <p className='flex flex-col'><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
                </Card.Body>
            </Card>

            {/* Product Details Card */}
            <Card>
                <Card.Header>
                    <FaBox className="text-green-500" /> Product Details
                </Card.Header>
                <Card.Body>
                    <p className='flex flex-col'><strong>Product Name:</strong> {productName}</p>
                    <p className='flex flex-col'><strong>Product Type:</strong> {productType}</p>
                    <p className='flex flex-col'><strong>In Stock:</strong> {inStock}</p>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    <FaDollarSign className="text-yellow-500" /> Status
                </Card.Header>
                <Card.Body>
                    <p className='flex flex-col'><strong>Status:</strong> <span className={status === "active" ? "text-green-600" : "text-red-600"}>{status}</span></p>
                </Card.Body>
            </Card>
        </div>
    );
}
