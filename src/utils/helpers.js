export function formatRails(data) {
    const grouped = {};

    // Group by product and count occurrences of each quantity
    data.forEach(item => {
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

    // Format each product's quantities for readability
    return Object.entries(grouped).map(([product, quantities]) => {
        const formattedQuantities = Object.entries(quantities)
            .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])) // Sort by quantity descending
            .map(([quantity, count]) => `${parseFloat(quantity)} → ${count} قطع`)
            .join('\n');

        return { productName: product, formattedQuantities };
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

    // If there is a "ويفي" fabric, check if the required product exists in products
    if (hasWeaveFabric) {
        return products.some(product => product.product === requiredProduct);
    }

    return true;
}
