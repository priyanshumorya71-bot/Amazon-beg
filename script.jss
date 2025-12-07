// E-commerce Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    // Sample products data
    const products = [
        {
            id: 1,
            name: "Safari Pentagon Professional Backpack",
            price: 4699,
            image: "safari-pentagon.jpg",
            category: "bags",
            description: "Waterproof laptop backpack with multiple compartments"
        },
        {
            id: 2,
            name: "Safari Thorium Business Backpack",
            price: 6099,
            image: "safari-thorium.jpg",
            category: "bags",
            description: "Premium business backpack with USB charging port"
        },
        {
            id: 3,
            name: "Wireless Bluetooth Headphones",
            price: 2499,
            image: "headphones.jpg",
            category: "electronics",
            description: "Noise cancelling wireless headphones"
        },
        {
            id: 4,
            name: "Smart Watch Fitness Tracker",
            price: 3999,
            image: "smartwatch.jpg",
            category: "electronics",
            description: "Smart watch with heart rate monitor"
        },
        {
            id: 5,
            name: "Men's Casual Shirt",
            price: 1299,
            image: "shirt.jpg",
            category: "fashion",
            description: "100% cotton casual shirt"
        },
        {
            id: 6,
            name: "Women's Handbag",
            price: 1899,
            image: "handbag.jpg",
            category: "fashion",
            description: "Leather handbag with multiple compartments"
        }
    ];
    
    // Initialize the page
    updateCartCount();
    setupEventListeners();
    
    function setupEventListeners() {
        // Cart toggle
        cartIcon.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', toggleCart);
        
        // Search functionality
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        
        // WhatsApp order button
        whatsappOrderBtn.addEventListener('click', sendWhatsAppOrder);
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                addToCart(productId);
            });
        });
        
        // Buy now buttons
        document.querySelectorAll('.buy-now-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('Proceeding to checkout...');
                // Implement checkout functionality here
            });
        });
    }
    
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        if (cartSidebar.classList.contains('active')) {
            renderCartItems();
        }
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        
        // Show feedback
        const btn = document.querySelector(`[data-id="${productId}"]`);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.style.background = '#28a745';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 1000);
        
        // Save order to admin (simulate)
        saveOrderToAdmin(product);
    }
    
    function saveOrderToAdmin(product) {
        // Get existing orders from localStorage
        const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
        
        // Create new order
        const newOrder = {
            id: 'ORD-' + Date.now(),
            customer: 'Customer',
            phone: '+91 XXXXX XXXXX',
            address: 'Address not provided',
            date: new Date().toISOString().split('T')[0],
            amount: product.price,
            status: 'pending',
            items: [
                {
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }
            ]
        };
        
        // Add to orders
        orders.unshift(newOrder);
        
        // Save to localStorage
        localStorage.setItem('customerOrders', JSON.stringify(orders));
        
        console.log('Order saved to admin:', newOrder);
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartTotal.textContent = '₹0';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = `₹${total.toLocaleString()}`;
    }
    
    // Global functions for cart operations
    window.updateQuantity = function(index, change) {
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    };
    
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    };
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            alert(`Searching for: "${query}"\n\nSearch functionality will show results here.`);
            // Implement actual search here
        }
    }
    
    function sendWhatsAppOrder() {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some products first.');
            return;
        }
        
        // Prepare order details
        let orderDetails = "🛍️ *NEW ORDER - QuickShop*\n\n";
        orderDetails += "*Order Details:*\n";
        
        let totalAmount = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            orderDetails += `• ${item.name} x ${item.quantity} = ₹${itemTotal}\n`;
        });
        
        orderDetails += `\n*Total Amount: ₹${totalAmount}*\n\n`;
        orderDetails += "*Customer Information:*\n";
        orderDetails += "Please provide your details after sending this message.\n\n";
        orderDetails += "---\n";
        orderDetails += "This order will be processed by our admin team.\n";
        orderDetails += "Admin will contact you shortly for confirmation.";
        
        // Encode for WhatsApp URL
        const encodedMessage = encodeURIComponent(orderDetails);
        const phoneNumber = "917643806356"; // Replace with actual admin number
        
        // Open WhatsApp
        window.open(`https://wa.me/${917643806356}?text=${Hello sir}`, '_blank');
        
        // Save order to admin
        saveCompleteOrderToAdmin(totalAmount);
    }
    
    function saveCompleteOrderToAdmin(totalAmount) {
        const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
        
        const completeOrder = {
            id: 'ORD-' + Date.now(),
            customer: 'WhatsApp Customer',
            phone: 'Via WhatsApp',
            address: 'To be confirmed',
            date: new Date().toISOString().split('T')[0],
            amount: totalAmount,
            status: 'pending',
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        };
        
        orders.unshift(completeOrder);
        localStorage.setItem('customerOrders', JSON.stringify(orders));
        
        // Clear cart after order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        
        alert('Order has been sent to admin via WhatsApp! Your cart has been cleared.');
    }
    
    // Auto-save cart changes
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('cart', JSON.stringify(cart));
    });
});
