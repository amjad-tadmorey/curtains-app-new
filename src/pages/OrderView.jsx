import React, { useEffect, useRef } from "react";
import { useOrderById } from "../features/orders/useOrderById";
import html2pdf from "html2pdf.js";
import { formatDate, formatRails } from "../utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import Card from "../ui/Card";
import { FaUser } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";



export default function OrderView() {
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
    const handlePrint = () => {
        if (!pdfRef.current) return;

        html2pdf()
            .set({
                margin: 5,
                filename: `document.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(pdfRef.current)
            .save();
    };


    const { order, isLoadingOrder } = useOrderById();
    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: [`order-${order?.id}`] })
    }, [order])

    if (isLoadingOrder) return <p>Loading...</p>;

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
    console.log(order);


    return (
        <div dir="rtl" className="flex flex-col items-center p-6">
            {/* 🖨️ Print Button */}
            <button
                onClick={handlePrint}
                className="mb-4 px-4 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            >
                حفظ الطلب 📄
            </button>

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
                className="border rounded-xl shadow-md"
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
                    </div>
                </div>
                <div
                    className="flex gap-4 border-b pb-2 mb-4 justify-between"
                    style={{ borderBottom: "1px solid #ddd" }}
                >
                    <Card>
                        <Card.Header><FaUser style={{ background: "#fff3e0" }} className="p-2 rounded-lg" size={30} /> {order.customer_name}</Card.Header>
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
                                <p className="font-bold">{order.address}</p>
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
                                                                    {product.notes}
                                                                </td>
                                                            }
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
                                            {room?.windows?.map((window, i) => (
                                                <div key={i} className="p-4 border rounded flex w-full">
                                                    <div className="relative w-1/2">
                                                        <p className="absolute left-24 translate-x-1/2 -top-3">{window.width ? `${window.width} ` : "—"}</p>
                                                        <img
                                                            src={window.src || "/default-image.jpg"}
                                                            alt="Window"
                                                            className="w-24 h-24 object-contain mt-4"
                                                            style={{ border: "1px solid #ddd" }}
                                                        />
                                                        <p className="absolute left-10 bottom-1/2 translate-y-1/2">{window.height ? `${window.height} ` : "—"}</p>
                                                    </div>
                                                    <p className="font-bold w-1/2">{window.note || "—"}</p>
                                                    <p>{window.type || "—"}</p>
                                                </div>
                                            ))}
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
        </div>
    );
}