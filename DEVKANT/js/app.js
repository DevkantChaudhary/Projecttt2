// Common utility functions

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
    return Date.now().toString();
}

// Initialize some sample data if not exists
if (!localStorage.getItem('products')) {
    const sampleProducts = [
        { id: '1', name: 'Product 1', price: 10.99, description: 'Description 1' },
        { id: '2', name: 'Product 2', price: 20.99, description: 'Description 2' }
    ];
    saveToStorage('products', sampleProducts);
}

if (!localStorage.getItem('users')) {
    const sampleUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com', role: 'customer' },
        { id: '2', name: 'Admin', email: 'admin@example.com', role: 'admin' }
    ];
    saveToStorage('users', sampleUsers);
}

if (!localStorage.getItem('feedbacks')) {
    const sampleFeedbacks = [];
    saveToStorage('feedbacks', sampleFeedbacks);
}

if (!localStorage.getItem('cart')) {
    saveToStorage('cart', []);
}

if (!localStorage.getItem('orders')) {
    const sampleOrders = [
        { id: '1', userId: '1', products: [{ id: '1', quantity: 2 }], status: 'pending', total: 21.98, paymentStatus: 'Pending' }
    ];
    saveToStorage('orders', sampleOrders);
}