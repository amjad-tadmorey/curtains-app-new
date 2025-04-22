import React, { useEffect } from 'react'
import { useProductById } from '../features/products/useProductById';
import { useQueryClient } from '@tanstack/react-query';
import Card from '../ui/Card';
import { FaBox, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdToll } from 'react-icons/md';
import EditDivision from '../features/products/EditDivision';
import { GrStatusInfo } from "react-icons/gr";
import { FaBoxes } from 'react-icons/fa';

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

    const {
        id,
        created_at,
        oldID,
        productName,
        inStock,
        productType,
        status,
        sapID,
        productDivisions,
        damagedProductDivisions,
        priceBeforeDiscount,
        priceAfterDiscount
    } = product

    const productDivisionsQuantity = productDivisions.reduce((acc, curr) => acc + curr, 0)
    const damagedProductDivisionsQuantity = damagedProductDivisions.reduce((acc, curr) => acc + curr, 0)

    return (
        <div dir='rtl' className="p-6 bg-white shadow-lg rounded-lg flex md:grid grid-cols-3 items-stretch gap-4 md:flex-row flex-col text-[150%] md:text-[100%]">
            {/* General Info Card */}
            <Card>
                <Card.Header>
                    <FaInfoCircle className="text-blue-500" /> المعلومات العامة
                </Card.Header>
                <Card.Body cols='2'>
                    <p className='flex flex-col'><strong>كود الساب:</strong> {sapID}</p>
                    <p className='flex flex-col'><strong>كود الاداري:</strong> {oldID}</p>
                    <p className='flex flex-col'><strong>الحالة :</strong> <span className={status === "active" ? "text-green-600" : "text-red-600"}>{status}</span></p>
                </Card.Body>
            </Card>

            {/* Product Details Card */}
            <Card>
                <Card.Header>
                    <FaBox className="text-green-500" /> تفاصيل المنتج
                </Card.Header>
                <Card.Body>
                    <p className='flex flex-col'><strong>الإسم :</strong> {productName}</p>
                    <p className='flex flex-col'><strong>قبل الخصم :</strong> {priceBeforeDiscount}</p>
                    <p className='flex flex-col'><strong>بعد الخصم :</strong> {priceAfterDiscount}</p>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    <FaBoxes className="text-yellow-500" /> الكمية :
                </Card.Header>
                <Card.Body>
                    <p className='flex flex-col'><strong>  الصالحة : </strong> {productDivisionsQuantity}</p>
                    <p className='flex flex-col'><strong>  التالفة : </strong> {damagedProductDivisionsQuantity}</p>
                    <p className='flex flex-col'><strong> الإجمالية : </strong> {productDivisionsQuantity + damagedProductDivisionsQuantity}</p>
                </Card.Body>
            </Card>
            <Card className={'col-span-3'}>
                <Card.Header>
                    <MdToll className="text-red-500" /> التقسيمات
                </Card.Header>
                {/* <Card.Body> */}
                <p className='flex flex-col mb-2'>
                    <strong>كمية صالحة:</strong>
                    <ul className="space-y-2 mt-2 md:flex flex-wrap grid grid-cols-3">
                        {productDivisions.map((value, index) => (
                            <span className="text-blue-500 bg-gray-100 mx-2 px-2 py-1 text-2xl rounded-lg h-12 md:w-36 text-center">م {value} </span>
                        ))}
                    </ul>
                </p>
                <p className='flex flex-col mb-2'>
                    <strong>كمية تالفة:</strong>
                    <ul className="space-y-2 mt-2 md:flex flex-wrap grid grid-cols-3">
                        {damagedProductDivisions.map((value, index) => (
                            <span className="text-blue-500 bg-gray-100 mx-2 px-2 py-1 text-2xl rounded-lg h-12 md:w-36 text-center">م {value} </span>
                        ))}
                    </ul>
                </p>
                {/* </Card.Body> */}
            </Card>
            <EditDivision initialProductDivisions={productDivisions} id={id} type={'productDivisions'} name={'تقسيمة الكمية الصالحة'} />
            <EditDivision initialProductDivisions={damagedProductDivisions} id={id} type={'damagedProductDivisions'} name={'تقسيمة الكمية التالفة'} />
        </div>
    );
}
