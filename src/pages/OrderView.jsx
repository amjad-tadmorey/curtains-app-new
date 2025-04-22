import React, { useEffect, useRef } from "react";
import { useOrderById } from "../features/orders/useOrderById";
import html2pdf from "html2pdf.js";
import { formatDate, formatRails } from "../utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../ui/Card";
import { FaUser } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { FaOrcid } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { RiVipLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import Table from "../ui/Table";



export default function OrderView() {
    const columns = [
        { header: "Product Name", accessor: "product", isSortable: true },
        { header: "Qty", accessor: "quantity", isSortable: true },
    ];


    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                navigate('/orders')
                // Perform your action here
            }
        });

    }, [])

    const queryClient = useQueryClient()
    const pdfRef = useRef();
    const { order, isLoadingOrder } = useOrderById();


    const handlePrint = () => {

        // window.location.reload()

        if (!pdfRef.current) return;

        html2pdf()
            .set({
                margin: 5,
                filename: `${order.customer_name}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(pdfRef.current)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);

                    // Add pagination at the bottom center
                    pdf.setFontSize(10);
                    pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: "center" });
                }
            })
            .save();
    };



    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: [`order-${order?.id}`] })
    }, [order])

    if (isLoadingOrder || isLoading) return <Spinner />;

    function formatRailsQuantities(orderData) {
        const grouped = {};

        // Iterate over all rooms in the order
        orderData?.forEach(room => {
            room.rails?.forEach(item => {
                const product = item.product;
                const quantity = parseFloat(item.quantity);

                if (!grouped[product]) {
                    grouped[product] = {};
                }

                if (!grouped[product][quantity]) {
                    grouped[product][quantity] = 1;
                } else {
                    grouped[product][quantity] += 1;
                }
            });
        });

        // Convert grouped data into an array of objects
        return Object.entries(grouped).map(([product, quantities]) => ({
            product,
            details: Object.entries(quantities)
                .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])) // Sort by quantity descending
                .map(([quantity, count]) => ({
                    quantity: parseFloat(quantity).toFixed(2),
                    count
                }))
        }));
    }


    return (
        <div dir="rtl" className="flex flex-col items-center p-6">


            <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full" dir='rtl'>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    الطلب #{order.id}

                    {/* 🖨️ Print Button */}
                    <button
                        onClick={() => {
                            if (order.status !== 'قيد الانتظار' && user.user_metadata.role !== 'admin') {
                                alert(`لا يمكن حفظ الاوردر بعد تحويله من قيد الانتظار ل ${order.status} !`)
                            } else {
                                handlePrint()
                            }
                        }}
                        className={`px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md `}
                    >
                        حفظ الطلب 📄
                    </button>
                </h2>

                <div className='flex items-center gap-4'>
                    <div className="mb-4 p-4 bg-white rounded-lg shadow flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-3"> <FaUser style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> معلومات العميل  </h3>
                        <div className='grid grid-cols-3 gap-4'>
                            <p className="flex flex-col"><strong>الاسم:</strong> {order.customer_name}</p>
                            <p className="flex flex-col"><strong>رقم الهاتف 1:</strong> {order.phone_number}</p>
                            <p className="flex flex-col"><strong>رقم الهاتف 2:</strong> {order.phone_number_2 || 'غير متوفر'}</p>
                            <p className="flex flex-col"><strong>العنوان:</strong> {order.address}</p>
                            <p className="flex flex-col"><strong>المعرض:</strong> {order.show_room}</p>
                            <p className="flex flex-col"><strong>المندوب:</strong> {order.sales_man}</p>
                        </div>
                    </div>

                    <div className="mb-4 p-4 bg-white rounded-lg shadow flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-3"> <FiFileText style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> تفاصيل الطلب</h3>
                        <div className='grid grid-cols-3 gap-4'>
                            <p className="flex flex-col"><strong>نوع الطلب:</strong> {order.order_type}</p>
                            <p className="flex flex-col"><strong>نوع التوصيل:</strong> {order.delivery_type}</p>
                            <p className="flex flex-col"><strong>تاريخ التسليم:</strong> {order.delivery_date}</p>
                            <p className="flex flex-col"><strong>الحالة:</strong> {order.status}</p>
                            <p className="flex flex-col"><strong>المنطقة:</strong> {order.area}</p>
                            <p className="flex flex-col"><strong>الفرع:</strong> {order.branch}</p>
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
                        <div className="flex items-center gap-4">
                            <div className="w-1/2 border-l pl-4">
                                <h4 className="font-semibold my-4">الاقمشة:</h4>
                                <div className="page-break">
                                    <table className="w-full border-collapse border mb-4 " style={{ borderColor: "#ddd" }}>
                                        <thead>
                                            <tr className="grid grid-cols-[5rem_1fr_8rem_6rem]" style={{ backgroundColor: "#f3f4f6" }}>
                                                <th className="border p-2" style={{ borderColor: "#ddd" }}>*</th>
                                                <th className="border p-2" style={{ borderColor: "#ddd" }}>المنتج</th>
                                                <th className="border p-2" style={{ borderColor: "#ddd" }}>الكمية</th>
                                                <th className="border p-2" style={{ borderColor: "#ddd" }}>نوع</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {room?.fabrics?.map((product, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_6rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        قماش
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.product.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.quantity}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.type}
                                                    </td>
                                                    {
                                                        product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            ملاحظات{product.notes}
                                                        </td>
                                                    }
                                                    <td className="p-2 col-span-4">
                                                        {product?.extra_fabrics === 'نعم' ? 'قص القماش الزائد' : product?.extra_fabrics === 'لا' ? 'عدم قص القماش الزائد' : ''}
                                                    </td>
                                                </tr>
                                            ))}
                                            {room?.cleats?.map((product, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        مرابط
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.product.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.quantity}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.type}
                                                    </td>
                                                    {
                                                        product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            {product.notes}
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                            {room?.accessories?.map((product, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        إكسسوار
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.product.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.quantity}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.type}
                                                    </td>
                                                    {
                                                        product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            {product.notes}
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                            {room?.roll?.map((product, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        رول
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.product.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.quantity}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.type}
                                                    </td>
                                                    {
                                                        product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            {product.notes}
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                            {room?.oima?.map((product, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        أويمة
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.product.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.quantity}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {product.type}
                                                    </td>
                                                    {
                                                        product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            {product.notes}
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                            {formatRails(room.rails).map((rail, i) => (
                                                <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        سكك
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {rail.productName.split("||")[0]}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {rail.formattedQuantities}
                                                    </td>
                                                    <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                        {rail.type}
                                                    </td>
                                                    {
                                                        rail.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                            {rail.notes}
                                                        </td>
                                                    }
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold my-4">النوافذ:</h4>
                                <ul className="list-disc pl-5 flex justify-center items-center gap-32">
                                    {room.windows.map((window, i) => (
                                        <div>
                                            <img src={window.src} alt="" />
                                            <li key={i}>العرض: {window.width} م، الارتفاع: {window.height} م</li>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <p className='mt-12'><strong>الملاحظات:</strong> {room.remarks}</p>
                    </div>
                ))}
            </div>

            {/* 📜 Order Content (PDF Target) */}
            <div
                dir="rtl"
                ref={pdfRef}
                style={{
                    backgroundColor: "#ffffff",
                    color: "#000",
                    padding: "20px",
                    width: "700px",  /* Adjust based on A4 size */
                    margin: "0 auto"
                }}
                className="border rounded-xl shadow-md relative -z-10"
            >
                <div className="flex items-center justify-between mb-2 pb-2" style={{ borderBottom: "1px solid #ddd" }}>
                    <img src="/Logo.png" alt="" className="w-56 p-2 mb-4" />
                    {/* <h1 className="text-4xl font-bold flex-1 mr-16" style={{ color: "#333232" }}>
                        طلب قماش + خياطة
                    </h1> */}

                    <div className="flex items-center gap-4">
                        <div>
                            <div><CiCalendarDate style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /></div>
                            <div>
                                <div className="flex flex-col">
                                    <p> تاريخ التعاقد</p>
                                    <p className="font-bold">{formatDate(order.created_at)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-r pr-8">
                            <div><CiCalendarDate style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /></div>
                            <div>
                                <div className="flex flex-col">
                                    <p> تاريخ التسليم</p>
                                    <p className="font-bold">{order.delivery_date}</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-r pr-8">
                            <div><FaOrcid style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /></div>
                            <div>
                                <div className="flex flex-col">
                                    <p>رقم الأوردر</p>
                                    <p className="font-bold">{order.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="flex gap-4 border-b pb-2 mb-4 justify-between"
                    style={{ borderBottom: "1px solid #ddd" }}
                >
                    <Card>
                        <Card.Header><FaUser style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> {order.customer_name} {order.vip && <RiVipLine size={30} />}</Card.Header>
                        <Card.Body>
                            <div className="flex flex-col">
                                <p>رقم الهاتف</p>
                                <p className="font-bold">{order.phone_number}</p>
                            </div>

                            {order.phone_number_2 && <div className="flex flex-col">
                                <p> رقم الهاتف - 2</p>
                                <p className="font-bold">{order.phone_number_2}</p>
                            </div>}
                            {order.phone_number_3 && <div className="flex flex-col">
                                <p> رقم الهاتف - 2</p>
                                <p className="font-bold">{order.phone_number_3}</p>
                            </div>}
                            <hr className="col-span-3" />
                            <div className="flex flex-col col-span-3">
                                <p>العنوان</p>
                                <p className="font-bold">{order.area} / {order.address}</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header><FiFileText style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> تفاصيل الطلب</Card.Header>
                        <Card.Body>
                            <div className="flex flex-col">
                                <p>إسم الصالة</p>
                                <p className="font-bold">{order.show_room}</p>
                            </div>
                            <div className="flex flex-col">
                                <p>إسم البائع</p>
                                <p className="font-bold">{order.sales_man}</p>
                            </div>
                            <div className="flex flex-col">
                                <p>إسم الفني</p>
                                <p className="font-bold">{order.technical}</p>
                            </div>
                            <hr className="col-span-3" />
                            <div className="flex flex-col col">
                                <p>نوع الأوردر</p>
                                <p className="font-bold">{order.order_type}</p>
                            </div>
                            <div className="flex flex-col">
                                <p>نوع التوصيل</p>
                                <p className="font-bold">{order.delivery_type}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <h2 className="text-lg font-semibold mb-2 text-center" style={{ color: "#333" }}>
                    طلب القماش
                </h2>
                <thead className="flex flex-col justify-between w-full mb-2">
                    <tr className="border-y flex justify-between" style={{ borderColor: "#ddd" }}>
                        <th className="p-2 text-start w-1/3">الكود</th>
                        <th className="p-2 text-center w-1/3">المنتج</th>
                        <th className="p-2 text-end w-1/3">الكمية</th>
                    </tr>
                </thead>
                <tbody className="flex flex-col justify-between w-full">
                    {order.products.map((product, index) => (
                        <tr key={index} className="border rounded-lg my-1 flex justify-between" style={{ borderColor: "#ddd" }}>
                            <td className="p-2 text-start w-1/3">
                                {product.product.split("||")[1]}
                            </td>
                            <td className="p-2 text-center w-1/3">
                                {product.product.split("||")[0]}
                            </td>
                            <td className="p-2 text-end w-1/3">
                                {product.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>

                {/* divisions */}
                {
                    formatRailsQuantities(order.rooms).length > 0 && <div className="mt-2 border-t pt-2" style={{ borderTop: "1px solid #ddd" }}>
                        <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                            التقسيمات :
                        </h2>
                        {
                            formatRailsQuantities(order.rooms).map((div, i) => <div key={i} className="p-2 flex items-center gap-6 border-b pb-4" style={{ backgroundColor: "#f3f4f6" }}>
                                <h1 className="w-32">{div.product.split("||")[0]}</h1>
                                <div className="flex items-center">
                                    {div.details.map((det, i) => <p key={i} className="mx-4 text-sm">--<span>{det.quantity} </span>  <span className="border pb-2 px-1">ع{det.count}</span>--</p>)}
                                </div>
                            </div>)
                        }
                    </div>
                }
                {/* 🏠 Rooms Section */}

                {order?.rooms?.map((room, index) => (
                    <>
                        <div className="room-container">
                            <div key={index} className="mt-6 border-t pt-4" style={{ borderTop: "1px solid #ddd" }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                                        الغرفة : {room.room_name}
                                    </h2>
                                    <h2 className="text-xl font-semibold mb-2 my-4 text-center" style={{ color: "#333" }}>
                                        طلب خياطة
                                    </h2>
                                    <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>العميل : {order.customer_name}</h2>
                                </div>

                                <div className="flex items-stretch justify-between border-y py-2">
                                    <div className="w-1/2 border-l pl-4">
                                        <div className="page-break">
                                            <table className="w-full border-collapse border mb-4 " style={{ borderColor: "#ddd" }}>
                                                <thead>
                                                    <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" style={{ backgroundColor: "#f3f4f6" }}>
                                                        <th className="border p-2" style={{ borderColor: "#ddd" }}>*</th>
                                                        <th className="border p-2" style={{ borderColor: "#ddd" }}>المنتج</th>
                                                        <th className="border p-2" style={{ borderColor: "#ddd" }}>الكمية</th>
                                                        <th className="border p-2" style={{ borderColor: "#ddd" }}>نوع</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {room?.fabrics?.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                قماش
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.type}
                                                            </td>
                                                            {
                                                                product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    ملاحظات{product.notes}
                                                                </td>
                                                            }
                                                            <td className="p-2 col-span-4">
                                                                {product?.extra_fabrics === 'نعم' ? 'قص القماش الزائد' : product?.extra_fabrics === 'لا' ? 'عدم قص القماش الزائد' : ''}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {room?.cleats?.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                مرابط
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.type}
                                                            </td>
                                                            {
                                                                product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    {product.notes}
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                    {room?.accessories?.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                إكسسوار
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.type}
                                                            </td>
                                                            {
                                                                product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    {product.notes}
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                    {room?.roll?.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                رول
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.type}
                                                            </td>
                                                            {
                                                                product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    {product.notes}
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                    {room?.oima?.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                أويمة
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.quantity}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.type}
                                                            </td>
                                                            {
                                                                product.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    {product.notes}
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                    {formatRails(room.rails).map((rail, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                سكك
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {rail.productName.split("||")[0]}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {rail.formattedQuantities}
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {rail.type}
                                                            </td>
                                                            {
                                                                rail.notes && <td className="p-2 col-span-4" style={{ background: "#ddd" }}>
                                                                    {rail.notes}
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* 🖼️ Room Images */}
                                    <div className=" w-1/2 p-4 rounded-lg">
                                        <div className="flex items-center justify-start flex-wrap gap-4">
                                            {room?.windows?.map((window, i) => {
                                                let widthCount = 0;

                                                if (window["width"]) widthCount++;
                                                if (window["width-2"]) widthCount++;
                                                if (window["width-3"]) widthCount++;

                                                console.log(`Window ${i + 1} has ${widthCount} width(s).`);
                                                return <div key={i} className="p-4 border rounded flex w-full">
                                                    <div className="relative w-1/2">
                                                        {
                                                            widthCount === 1 ?
                                                                <>
                                                                    <p className="absolute left-1/2 translate-x-1/2 -top-3">{window.width ? `${window['width']}` : ""}</p>
                                                                </>
                                                                : widthCount === 2 ?
                                                                    <>
                                                                        <p className="absolute left-2/3 translate-x-1/2 -top-3">{window.width ? `${window['width']}` : ""}</p>
                                                                        <p className="absolute left-12 top-2">{window['width-2'] ? `${window['width-2']}` : ""}</p>
                                                                    </>
                                                                    : widthCount === 3 ?
                                                                        <> <p className="absolute left-1/2 translate-x-1/2 -top-3">{window.width ? `${window['width']}` : ""}</p>
                                                                            <p className="absolute left-12">{window['width-2'] ? `${window['width-2']}` : ""}</p>
                                                                            <p className="absolute left-40">{window['width-3'] ? `${window['width-3']}` : ""}</p>
                                                                        </>
                                                                        : null
                                                        }

                                                        <img
                                                            src={window.src || "/default-image.jpg"}
                                                            alt="Window"
                                                            className="w-32 h-32 object-contain mt-4"
                                                            style={{ border: "1px solid #ddd" }}
                                                        />
                                                        <p className="absolute left-4 bottom-1/2 translate-y-1/2">{window.height ? `${window.height}` : ""}</p>
                                                        <p className=" absolute -left-22 bottom-1">نوع التفصيل : <b>{window.type || ""}</b></p>
                                                    </div>
                                                    <p className="font-bold w-1/2">{window.note || ""}</p>
                                                </div>
                                            }


                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {room.remarks}
                            </div>
                        </div>

                        <h1 className=" text-xl font-semibold mt-2">{index === order?.rooms?.length - 1 ? "" : "يتبع..."}</h1>
                    </>
                ))}
                <h1 className="text-center text-2xl font-bold mt-12">انتهى الاوردر</h1>
            </div>
        </div >
    );
}