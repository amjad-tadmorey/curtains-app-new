import * as XLSX from 'xlsx';

export function formatRails(data) {
    const grouped = {};

    data.forEach(item => {
        const product = item.product;
        const quantity = parseFloat(item.quantity);
        const note = item.notes.trim(); // إزالة المسافات الفارغة

        if (!grouped[product]) {
            grouped[product] = { quantities: {}, notes: new Set() };
        }

        // حفظ كميات المنتج وعدد تكراراتها
        if (!grouped[product].quantities[quantity]) {
            grouped[product].quantities[quantity] = 1;
        } else {
            grouped[product].quantities[quantity] += 1;
        }

        // إضافة الملاحظات غير الفارغة فقط
        if (note) {
            grouped[product].notes.add(note);
        }
    });

    return Object.entries(grouped).map(([product, { quantities, notes }]) => {
        const formattedQuantities = Object.entries(quantities)
            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])) // ترتيب تنازلي للكميات
            .map(([quantity, count]) => `${parseFloat(quantity)} → ${count} قطع`)
            .join('\n');

        return {
            productName: product,
            formattedQuantities,
            notes: Array.from(notes).join(' | ') || null
        };
    });
}


export function collectProducts(data) {
    const { cleats, fabrics, accessories } = data;
    return [...cleats, ...fabrics, ...accessories];
}

export function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toISOString().split('T')[0];
    return formattedDate
}


export function compareRoomQuantities(products, rooms, cutoffMaterials = [], precision = 3) {
    const round = (num) => parseFloat(num.toFixed(precision));

    const productQuantities = products.reduce((acc, { product, quantity }) => {
        acc[product] = round(parseFloat(quantity) || 0);
        return acc;
    }, {});

    const usedQuantities = {};

    const addQuantity = (product, quantity) => {
        if (!product) return;
        const qty = round(parseFloat(quantity) || 0);
        usedQuantities[product] = round((usedQuantities[product] || 0) + qty);
    };

    rooms?.forEach(room => {
        Object.values(room).forEach(field => {
            if (Array.isArray(field)) {
                field.forEach(({ product, quantity }) => addQuantity(product, quantity));
            }
        });
    });

    cutoffMaterials.forEach(({ product, quantity }) => addQuantity(product, quantity));

    const errors = Object.keys(productQuantities).map(product => {
        const available = productQuantities[product];
        const used = usedQuantities[product] || 0;

        if (used > available) {
            return `🚨 المنتج "${product.split(" || ")[0]}" تجاوز الكمية المطلوبة (المطلوب: ${available}, المستهلك: ${used}).`;
        } else if (used < available) {
            return `⚠ المنتج "${product.split(" || ")[0]}" لم يُستهلك بالكامل (المتبقي: ${round(available - used)}, المستهلك: ${used}).`;
        }
        return null;
    }).filter(Boolean);

    return {
        isValid: errors.length === 0,
        errors,
    };
}


export function validateProducts(rooms, products) {
    const requiredProduct = "مجر ويفي || 270-10-0003-01-00002 || 418 || rails";

    // Check if any fabric has type "ويفي"
    const hasWeaveFabric = rooms.some(room =>
        room.fabrics.some(fabric => fabric.type === "ويفي")
    );
    const hasWavyRail = rooms.some(room =>
        room.rails?.some(item => item.type?.trim() === "ويفي")
    );
    console.log(hasWavyRail);

    // If there is a "ويفي" fabric, check if the required product exists in products
    if (hasWeaveFabric) {
        return hasWavyRail
    }

    return true;
}


export function exportProductsAsTotals(products) {
    const rows = [];

    // Define header
    const header = {
        'Old ID': 'Old ID',
        'SAP ID': 'SAP ID',
        'Product Name': 'Product Name',
        Status: 'Status',
        'Qty': 'Qty'
    };

    rows.push(header);

    // Add product rows
    products.forEach((product) => {
        const totalMorder =
            (product.productDivisions?.reduce((a, b) => a + b, 0) || 0) +
            (product.damagedProductDivisions?.reduce((a, b) => a + b, 0) || 0);

        rows.push({
            'Old ID': product.oldID ?? '',
            'SAP ID': product.sapID ?? '',
            'Product Name': product.productName ?? '',
            Status: product.status ?? '',
            'Qty': totalMorder
        });
    });

    // Create worksheet from rows
    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

    // Optional: Make header row bold
    const headerKeys = Object.keys(header);
    headerKeys.forEach((_, colIndex) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        if (worksheet[cell]) {
            worksheet[cell].s = {
                font: { bold: true }
            };
        }
    });

    // Optional: Add borders to all cells
    rows.forEach((_, rowIndex) => {
        headerKeys.forEach((_, colIndex) => {
            const cell = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
            if (worksheet[cell]) {
                worksheet[cell].s = {
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                };
            }
        });
    });

    // Freeze the header row
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Optional: Set column widths for better readability
    worksheet['!cols'] = [
        { wch: 10 },  // Old ID
        { wch: 10 },  // SAP ID
        { wch: 30 },  // Product Name
        { wch: 15 },  // Status
        { wch: 15 }   // Total Morder
    ];

    // Create and save the workbook
    const workbook = XLSX.utils.book_new();
    workbook.SheetNames.push('Products');
    workbook.Sheets['Products'] = worksheet;

    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    XLSX.writeFile(workbook, `سحب جرد لتاريخ (${dateStr}).xlsx`);
}
export function exportProductsAsCounting(products) {
    const rows = [];

    // Define header
    const header = {
        'Old ID': 'Old ID',
        'SAP ID': 'SAP ID',
        'Product Name': 'Product Name',
        Status: 'Status',
        Division: 'Division',
        'Damaged Division': 'Damaged Division',
    };

    rows.push(header);

    let rowIndex = 1;

    // Add product rows to the sheet
    products.forEach((product, index) => {
        const maxLength = Math.max(
            product.productDivisions.length,
            product.damagedProductDivisions.length
        );

        // Add a row divider between products (optional)
        if (index > 0) {
            rows.push({ 'Product Separator': '' }); // Add label for empty row
        }

        // Add rows for the current product
        for (let i = 0; i < maxLength; i++) {
            rows.push({
                'Old ID': product.oldID ?? '',
                'SAP ID': product.sapID,
                'Product Name': product.productName,
                Status: product.status,
                Division: product.productDivisions[i] ?? '',
                'Damaged Division': product.damagedProductDivisions[i] ?? ''
            });
        }
    });

    // Create the worksheet from rows
    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

    // Apply styling to differentiate each product
    let rowIndexForStyle = 1; // start from the second row
    products.forEach((product, index) => {
        const maxLength = Math.max(
            product.productDivisions.length,
            product.damagedProductDivisions.length
        );

        // Bold the first row of each product (product name)
        const firstRowIndex = rowIndexForStyle;
        const firstRow = XLSX.utils.encode_cell({ r: firstRowIndex, c: 2 }); // column 2 = Product Name
        if (worksheet[firstRow]) {
            worksheet[firstRow].s = {
                font: { bold: true },
            };
        }

        // Apply borders to the entire block for the current product
        for (let i = 0; i < maxLength; i++) {
            const rowIdx = rowIndexForStyle + i;
            const colCount = Object.keys(header).length;

            for (let col = 0; col < colCount; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: col });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }
            }
        }

        // Move the rowIndex to the next product block
        rowIndexForStyle += maxLength;
    });

    // Style the empty rows (product separators) with thicker borders
    const emptyRowStartIndex = rowIndexForStyle;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i]['Product Separator']) {
            const emptyRowIdx = i + 1; // Skip the header row
            const emptyRowCell = XLSX.utils.encode_cell({ r: emptyRowIdx, c: 0 });

            if (worksheet[emptyRowCell]) {
                worksheet[emptyRowCell].s = {
                    fill: {
                        patternType: 'solid',
                        fgColor: { rgb: 'FFDDDDDD' } // Light grey color for empty row
                    },
                    border: {
                        top: { style: 'medium' },  // Thick border for top
                        left: { style: 'medium' }, // Thick border for left
                        bottom: { style: 'medium' }, // Thick border for bottom
                        right: { style: 'medium' } // Thick border for right
                    }
                };
            }
        }
    }

    // Freeze the header row for better navigation
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Create the workbook
    const workbook = XLSX.utils.book_new();
    workbook.Sheets['Products'] = worksheet;
    workbook.SheetNames.push('Products');

    // Write the Excel file
    XLSX.writeFile(workbook, `سحب جرد لتاريخ (${new Date(Date.now()).toLocaleDateString('en-GB')}).xlsx`);
}
export function exportProductsAsPrices(products) {
    const rows = [];

    // Define header
    const header = {
        'Old ID': 'Old ID',
        'SAP ID': 'SAP ID',
        'Product Name': 'Product Name',
        'Product Type': 'Product Type',
        'Price Before Discount': 'Price Before Discount',
        'Price After Discount': 'Price After Discount',
        Status: 'Status',
    };

    rows.push(header);

    let rowIndex = 1;

    // Add product rows to the sheet
    products.forEach((product, index) => {
        const maxLength = Math.max(
            product.productDivisions.length,
            product.damagedProductDivisions.length
        );

        // Add rows for the current product
        for (let i = 0; i < maxLength; i++) {
            rows.push({
                'Old ID': product.oldID ?? '',
                'SAP ID': product.sapID,
                'Product Name': product.productName,
                'Product Type': product.productType,
                'Price Before Discount': product.priceBeforeDiscount ?? '',
                'Price After Discount': product.priceAfterDiscount ?? '',
                Status: product.status,
            });
        }
    });

    // Create the worksheet from rows
    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

    // Apply styling to differentiate each product
    let rowIndexForStyle = 1; // start from the second row
    products.forEach((product, index) => {
        const maxLength = Math.max(
            product.productDivisions.length,
            product.damagedProductDivisions.length
        );

        // Bold the first row of each product (product name)
        const firstRowIndex = rowIndexForStyle;
        const firstRow = XLSX.utils.encode_cell({ r: firstRowIndex, c: 2 }); // column 2 = Product Name
        if (worksheet[firstRow]) {
            worksheet[firstRow].s = {
                font: { bold: true },
            };
        }

        // Apply borders to the entire block for the current product
        for (let i = 0; i < maxLength; i++) {
            const rowIdx = rowIndexForStyle + i;
            const colCount = Object.keys(header).length;

            for (let col = 0; col < colCount; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: col });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }
            }
        }

        // Move the rowIndex to the next product block
        rowIndexForStyle += maxLength;
    });

    // Freeze the header row for better navigation
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Create the workbook
    const workbook = XLSX.utils.book_new();
    workbook.Sheets['Products'] = worksheet;
    workbook.SheetNames.push('Products');

    // Write the Excel file
    XLSX.writeFile(workbook, `سحب أسعار (${new Date(Date.now()).toLocaleDateString('en-GB')}).xlsx`);
}
export function exportOrders(orders) {
    const rows = [];

    // Define header
    const header = {
        'Order ID': 'Order ID',
        'Customer Name': 'Customer Name',
        'Phone Number': 'Phone Number',
        'Phone Number 2': 'Phone Number 2',
        'Address': 'Address',
        'Show Room': 'Show Room',
        'Sales Man': 'Sales Man',
        'Order Type': 'Order Type',
        'Delivery Type': 'Delivery Type',
        'Delivery Date': 'Delivery Date',
        'Status': 'Status',
        'Area': 'Area',
        'Branch': 'Branch',
        'VIP': 'VIP'
    };

    rows.push(header);

    let rowIndex = 1;

    // Add order rows to the sheet
    orders.forEach((order) => {
        const ordersData = order.products; // Using "orders" to refer to products
        const rooms = order.rooms;

        // If the order has orders (products)
        if (ordersData && ordersData.length > 0) {
            ordersData.forEach((orderItem) => {
                rows.push({
                    'Order ID': order.id,
                    'Customer Name': order.customer_name,
                    'Phone Number': order.phone_number,
                    'Phone Number 2': order.phone_number_2,
                    'Address': order.address,
                    'Show Room': order.show_room,
                    'Sales Man': order.sales_man,
                    'Order Type': order.order_type,
                    'Delivery Type': order.delivery_type,
                    'Delivery Date': order.delivery_date,
                    'Status': order.status,
                    'Area': order.area,
                    'Branch': order.branch,
                    'VIP': order.vip ? 'Yes' : 'No'
                });
            });
        }
    });

    // Create the worksheet from rows
    const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true });

    // Apply styling to differentiate each order
    let rowIndexForStyle = 1; // start from the second row
    orders.forEach((order) => {
        const ordersData = order.products; // Using "orders" to refer to products
        const rooms = order.rooms;
        const maxLength = Math.max(ordersData.length, rooms ? rooms.length : 0);

        // Apply styles to rows
        for (let i = 0; i < maxLength; i++) {
            const rowIdx = rowIndexForStyle + i;
            const colCount = Object.keys(header).length;

            // Apply border styles to cells in the row
            for (let col = 0; col < colCount; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: col });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        border: {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        }
                    };
                }
            }
        }

        // Move the rowIndex to the next order block
        rowIndexForStyle += maxLength;
    });

    // Freeze the header row for better navigation
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Create the workbook
    const workbook = XLSX.utils.book_new();
    workbook.Sheets['orders'] = worksheet;
    workbook.SheetNames.push('orders');

    // Write the Excel file
    XLSX.writeFile(workbook, `Orders_${new Date(Date.now()).toLocaleDateString('en-GB')}.xlsx`);
}


export function getOrderCapacity(rooms) {
    // نحسب مجموع النوافذ
    const totalWindows = rooms.reduce((sum, room) => {
        return sum + (room.windows?.length || 0);
    }, 0);

    // نحسب الرقم على حسب المجموع: كل 6 نوافذ = مستوى واحد
    const groupNumber = Math.ceil(totalWindows / 6);

    return groupNumber;
}
