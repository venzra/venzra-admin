let days = 31;

const addresses = [
    { addressee: 'Mr Charlie P Morton', street: '79 Ballifeary Road', building: '', city: 'BALMORE', county: 'East Dunbartonshire', postalCode: 'IV126YW', country: 'GB' },
    { addressee: 'Ms Mia B Hammond', street: '96 East Street', building: '', city: 'MARDEN', county: 'Tyne And Wear', postalCode: 'NE308RY', country: 'GB' },
    { addressee: 'Mr Adam T Thomas', street: '15 Princes Street', building: '', city: 'ROLSTON', county: 'Yorkshire and the Humber', postalCode: 'HU182XU', country: 'GB' },
    { addressee: 'Mr Dylan A Bird', street: '87 Gordon Terrace', building: '', city: 'BAUNTON', county: 'Gloucestershire', postalCode: 'GL70PX', country: 'GB' },
    { addressee: 'Ms Poppy D Hunt', street: '79 Seafield Place', building: '', city: 'FOXEARTH', county: 'Suffolk', postalCode: 'CO109ZT', country: 'GB' },
    { addressee: 'Ms Isabella E Saunders', street: '9 Coast Rd', building: '', city: 'KIRKBY MALHAM', county: 'North Yorkshire', postalCode: 'BD230TB', country: 'GB' },
    { addressee: 'Ms Amelie R Bell', street: '18 Broomfield Place', building: '', city: 'STONEBRIDGE', county: 'East Sussex', postalCode: 'TN229JR', country: 'GB' },
    { addressee: 'Mr Oliver E Reeves', street: '84 Ponsmere Road', building: '', city: 'ZELAH', county: 'Truro', postalCode: 'TR48TJ', country: 'GB' },
    { addressee: 'Mrs Natasha L Arnold', street: '78 Newgate Street', building: '', city: 'IWADE', county: 'Kent', postalCode: 'ME96UL', country: 'GB' },
    { addressee: 'Mr Kian H John', street: '34 East Street', building: '', city: 'MARGATE', county: 'Kent', postalCode: 'CT97AS', country: 'GB' }
];

const statuses = ['AUTHORISED', 'AUTHORISED', 'PROCESSING', 'AUTHORISED', 'PROCESSING', 'DISPATCHED', 'DISPATCHED', 'DISPATCHED', 'DISPATCHED', 'DISPATCHED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED'];

for (let i = 0; i < days; i++) {
    for (let j = 0; j < 7 + Math.ceil(Math.random() * 3); j++) {

        const entry = {
            products: [
                { quantity: Math.ceil(Math.random() * 5), price: 200 + Math.ceil(Math.random() * 500) },
                { quantity: Math.ceil(Math.random() * 3), price: 500 + Math.ceil(Math.random() * 500) },
                { quantity: Math.ceil(Math.random() * 3), price: 300 + Math.ceil(Math.random() * 500) }
            ],
            reference: Math.floor((Math.random() * 0.9 + 0.1) * Math.pow(10, 10)),
            created: new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate() - i), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))
        };

        const totalValue = entry.products.reduce((total, current) => total + (current.quantity * current.price), 0);

        db.orders.insert([
            {
                items: [
                    { product: ObjectId('5a67d6db5722512e4e107b4c'), quantity: entry.products[0].quantity, price: entry.products[0].price },
                    { product: ObjectId('5a5c6e96b75604930a112231'), quantity: entry.products[1].quantity, price: entry.products[1].price },
                    { product: ObjectId('5a6a629d6ad8d159c5a1958d'), quantity: entry.products[2].quantity, price: entry.products[2].price }
                ],
                subscription: ObjectId('5a54f9d9590142401150ac56'),
                customer: '5a551592c222e246d8bdb465',
                reference: entry.reference,
                shipping: { reference: entry.reference.toString(16), name: 'Free shipping', price: 0 },
                destination: addresses[Math.floor(Math.random() * addresses.length)],
                billing: addresses[Math.floor(Math.random() * addresses.length)],
                payment: {
                    reference: 'ch_xxxxxxxxxxxxxxxxxxxxxxxx', 'transaction': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx', 'name': 'TEST',
                    card: '4242',
                    brand: 'Visa',
                    fee: {
                        venzra: { amount: 10 + (totalValue * 0.046), currency: 'gbp' },
                        gateway: { amount: 20 + (totalValue * 0.014), currency: 'gbp' },
                        total: 30 + (totalValue * 0.06)
                    },
                    value: totalValue
                },
                status: statuses[Math.floor(Math.random() * statuses.length)],
                created: entry.created,
                updated: entry.created
            }
        ]);
    }

}
