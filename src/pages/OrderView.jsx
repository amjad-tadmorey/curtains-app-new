import React, { useRef } from "react";
import { useOrderById } from "../features/orders/useOrderById";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function OrderView() {
    const { order, isLoadingOrder } = useOrderById();
    const pdfRef = useRef();

    if (isLoadingOrder) return <p>Loading...</p>;

    // 🖨️ Function to Generate PDF
    const handlePrint = async () => {
        const element = pdfRef.current;

        if (!element) return;

        const canvas = await html2canvas(element, {
            backgroundColor: "#ffffff", // ✅ Force white background
            useCORS: true, // ✅ Handle external images
            scale: 2, // ✅ Higher resolution
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`order-${order.id}.pdf`);
    };

    return (
        <div dir="rtl" className="flex flex-col items-center p-6">
            {/* 🖨️ Print Button */}
            <button
                onClick={handlePrint}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            >
                طباعة الطلب 📄
            </button>

            {/* 📜 Order Content (PDF Target) */}
            <div
                ref={pdfRef}
                style={{ backgroundColor: "#ffffff", color: "#000", padding: "20px" }}
                className="border rounded-xl shadow-md w-[75vw] mx-auto"
            >
                <div
                    className="grid grid-cols-2 gap-4 border-b pb-4 mb-4"
                    style={{ borderBottom: "1px solid #ddd" }}
                >
                    <div>
                        <h2 className="text-lg font-semibold" style={{ color: "#333" }}>
                            بيانات العميل
                        </h2>
                        <p><strong>الاسم:</strong> {order.customer_name}</p>
                        <p><strong>رقم الهاتف:</strong> {order.phone_number}</p>
                        <p><strong>رقم الهاتف 2:</strong> {order.phone_number_2}</p>
                        <p><strong>العنوان:</strong> {order.address}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold" style={{ color: "#333" }}>
                            تفاصيل الطلب
                        </h2>
                        <p><strong>المعرض:</strong> {order.show_room}</p>
                        <p><strong>مندوب المبيعات:</strong> {order.sales_man}</p>
                        <p><strong>نوع الطلب:</strong> {order.order_type}</p>
                        <p><strong>نوع التوصيل:</strong> {order.delivery_type}</p>
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                    المنتجات
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

                {/* 🏠 Rooms Section */}
                {order.rooms.map((room, index) => (
                    <div key={index} className="mt-6 border-t pt-4" style={{ borderTop: "1px solid #ddd" }}>
                        <h2 className="text-lg font-semibold mb-2" style={{ color: "#333" }}>
                            الغرفة {index + 1}
                        </h2>

                        <div className="flex items-stretch justify-between gap-4">
                            <div className="w-1/2">
                                <table className="w-full border-collapse border mb-4" style={{ borderColor: "#ddd" }}>
                                    <thead>
                                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                                            <th className="border p-2" style={{ borderColor: "#ddd" }}>المنتج</th>
                                            <th className="border p-2" style={{ borderColor: "#ddd" }}>الكمية</th>
                                            <th className="border p-2" style={{ borderColor: "#ddd" }}>نوع التنفيذ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {room.fabrics.map((fabric, i) => (
                                            <tr key={i}>
                                                <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                    {fabric.product}
                                                </td>
                                                <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                    {fabric.quantity}
                                                </td>
                                                <td className="border p-2" style={{ borderColor: "#ddd" }}>
                                                    {fabric.type}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 🖼️ Room Images */}
                            <div className="bg-gray-100 w-1/2 p-4 rounded-lg" style={{ backgroundColor: "#f3f4f6" }}>
                                <div className="flex items-center justify-center gap-4">
                                    {room.windows.map((window, i) => (
                                        <div key={i} className="p-2 border rounded">
                                            <img
                                                src={window.src}
                                                alt="Window"
                                                className="w-24 h-24 object-contain"
                                                style={{ border: "1px solid #ddd" }}
                                            />
                                            <p>العرض: {window.width} م</p>
                                            <p>الارتفاع: {window.height} م</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
