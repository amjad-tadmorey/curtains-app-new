import React, { useEffect, useRef } from "react";
import { useOrderById } from "../features/orders/useOrderById";
import html2pdf from "html2pdf.js";
import { formatRails } from "../utils/helpers";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderView() {
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


    return (
        <div dir="rtl" className="flex flex-col items-center p-6">
            {/* 🖨️ Print Button */}
            <button
                onClick={handlePrint}
                className="mb-4 px-4 py-1 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            >
                طباعة الطلب 📄
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
                <img src="/Logo.png" alt="" className="w-56 p-2 mx-auto mb-4" />
                <div
                    className="grid grid-cols-2 gap-4 border-b pb-2 mb-4"
                    style={{ borderBottom: "1px solid #ddd" }}
                >
                    <div style={{ borderLeft: "1px solid #D1D5DB", padding: "4px" }}>
                        <h2 className="text-lg font-semibold" style={{ color: "#333" }}>
                            بيانات العميل
                        </h2>
                        <p><strong>الاسم:</strong> {order.customer_name}</p>
                        <p><strong>رقم الهاتف:</strong> {order.phone_number}</p>
                        {order.phone_number_2 && <p><strong>رقم الهاتف 2:</strong> {order.phone_number_2}</p>}
                        <p><strong>العنوان:</strong> {order.address}</p>
                        <p><strong>تاريخ التسليم :</strong> {order.delivery_date}</p>
                    </div>
                    <div style={{ borderLeft: "1px solid #D1D5DB", padding: "4px" }}>
                        <h2 className="text-lg font-semibold" style={{ color: "#333" }}>
                            تفاصيل الطلب
                        </h2>
                        <p><strong>المعرض:</strong> {order.show_room}</p>
                        <p><strong>مندوب المبيعات:</strong> {order.sales_man}</p>
                        <p><strong>نوع الطلب:</strong> {order.order_type}</p>
                        <p><strong>نوع التوصيل:</strong> {order.delivery_type}</p>
                        <p><strong> اسم الفني :</strong> {order.technical}</p>
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                    المنتجات :
                </h2>
                <table className="w-full border-collapse border" style={{ borderColor: "#ddd" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                            <th className="border p-2" style={{ borderColor: "#ddd" }}>المنتج</th>
                            <th className="border p-2" style={{ borderColor: "#ddd" }}>الكمية</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((product, index) => (
                            <tr key={index}>
                                <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                    {product.product}
                                </td>
                                <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                    {product.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* divisions */}
                {
                    formatRailsQuantities(order.rooms).length > 0 && <div className="mt-2 border-t pt-2" style={{ borderTop: "1px solid #ddd" }}>
                        <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                            التقسيمات :
                        </h2>
                        {
                            formatRailsQuantities(order.rooms).map(div => <div className="p-2 flex items-center gap-6 border-b pb-4" style={{ backgroundColor: "#f3f4f6" }}>
                                <h1>{div.product}</h1>
                                <div className="flex items-center">
                                    {div.details.map((det) => <p className="mx-4 text-sm">--<span>{det.quantity} </span>  <span className="border pb-2 px-1">ع{det.count}</span>--</p>)}
                                </div>
                            </div>)
                        }
                    </div>
                }
                {/* 🏠 Rooms Section */}
                {order?.rooms?.map((room, index) => (
                    <>
                        {/* <div className="page-break"></div> */}
                        <div className="room-container">
                            <div key={index} className="mt-6 border-t pt-4" style={{ borderTop: "1px solid #ddd" }}>
                                <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                                    الغرفة {room.room_name}
                                </h2>

                                <div className="flex items-stretch justify-between gap-4">
                                    <div className="w-1/2">
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
                                                    {room.fabrics.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                قماش
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product}
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
                                                    {room.cleats.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                مرابط
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product}
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
                                                    {room.accessories.map((product, i) => (
                                                        <tr className="grid grid-cols-[5rem_1fr_8rem_4rem]" key={i} style={{ border: "1px solid #797878" }}>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                إكسسوار
                                                            </td>
                                                            <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                                {product.product}
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
                                                                {rail.productName}
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
                                    <div className=" w-1/2 p-4 rounded-lg" style={{ backgroundColor: "#f3f4f6" }}>
                                        <div className="flex items-center justify-center flex-wrap gap-4">
                                            {room?.windows?.map((window, i) => (
                                                <div key={i} className="p-2 border rounded relative">
                                                    <div className="flex items-center gap-4">
                                                        <p>{window.width ? `${window.width} م` : "—"}</p>
                                                        <p className="font-bold">{window.note || "—"}</p>
                                                    </div>
                                                    <img
                                                        src={window.src || "/default-image.jpg"}
                                                        alt="Window"
                                                        className="w-24 h-24 object-contain m-[0.4rem] mx-[1.4rem]"
                                                        style={{ border: "1px solid #ddd" }}
                                                    />
                                                    <p className="absolute left-2 bottom-2">{window.height ? `${window.height} م` : "—"}</p>
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
                    </>
                ))}
            </div>
        </div>
    );
}