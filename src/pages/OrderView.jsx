import React, { useEffect } from 'react'
import Spinner from '../ui/Spinner';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderById } from '../features/orders/useOrderById';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Table';
import { FiFileText } from 'react-icons/fi';
import { FaPrint, FaUser } from 'react-icons/fa';

const columns = [
    { header: "Product Name", accessor: "product", isSortable: true },
    { header: "Qty", accessor: "quantity", isSortable: true },
];

export default function OrderView() {
    const navigate = useNavigate()
    useEffect(() => {
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                navigate('/orders')
            }
        });

    }, [])

    const queryClient = useQueryClient()
    const { order, isLoadingOrder } = useOrderById();

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: [`order-${order?.id}`] })
    }, [order])
    if (isLoadingOrder) return <Spinner />;
    console.log(order);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md" dir='rtl'>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                الطلب #{order.id}
                <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(`/orders/print/${order.id}`)}>
                    <FaPrint />
                </button>
            </h2>

            <div className='flex items-center gap-4'>
                <div className="mb-4 p-4 bg-white rounded-lg shadow flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-3"> <FaUser style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> معلومات العميل  </h3>
                    <div className='grid grid-cols-3 gap-4'>
                        <p><strong>الاسم:</strong> {order.customer_name}</p>
                        <p><strong>رقم الهاتف 1:</strong> {order.phone_number}</p>
                        <p><strong>رقم الهاتف 2:</strong> {order.phone_number_2 || 'غير متوفر'}</p>
                        <p><strong>العنوان:</strong> {order.address}</p>
                        <p><strong>المعرض:</strong> {order.show_room}</p>
                        <p><strong>المندوب:</strong> {order.sales_man}</p>
                    </div>
                </div>

                <div className="mb-4 p-4 bg-white rounded-lg shadow flex-1">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-3"> <FiFileText style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> تفاصيل الطلب</h3>
                    <div className='grid grid-cols-3 gap-4'>
                        <p><strong>نوع الطلب:</strong> {order.order_type}</p>
                        <p><strong>نوع التوصيل:</strong> {order.delivery_type}</p>
                        <p><strong>تاريخ التسليم:</strong> {order.delivery_date}</p>
                        <p><strong>الحالة:</strong> {order.status}</p>
                        <p><strong>المنطقة:</strong> {order.area}</p>
                        <p><strong>الفرع:</strong> {order.branch}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">المنتجات</h3>
                <Table
                    name={`order-${order.id}`}
                    columns={columns}
                    data={order.products}
                    actions={false}
                />
            </div>

            {order.rooms.map((room, index) => (
                <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">الغرفة: {room.room_name}</h3>

                    <h4 className="font-semibold my-4">النوافذ:</h4>
                    <ul className="list-disc pl-5 flex justify-center items-center gap-32">
                        {room.windows.map((window, i) => (
                            <div>
                                <img src={window.src} alt="" />
                                <li key={i}>العرض: {window.width} م، الارتفاع: {window.height} م</li>
                            </div>
                        ))}
                    </ul>
                    <p className='mt-12'><strong>الملاحظات:</strong> {room.remarks}</p>
                </div>
            ))}
        </div>
    )
}
