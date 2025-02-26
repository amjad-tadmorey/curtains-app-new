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
            .map(([quantity, count]) => `${parseFloat(quantity).toFixed(2)} → ${count} قطع`)
            .join('\n');

        return { productName: product, formattedQuantities };
    });
}

export function collectProducts(data) {
    const { cleats, fabrics, accessories } = data;
    return [...cleats, ...fabrics, ...accessories];
}