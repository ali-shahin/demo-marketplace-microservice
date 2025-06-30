import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

export default function CartPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderStatus, setOrderStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    // Fetch products for demo add-to-cart (in real app, use context or localStorage for cart)
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('http://localhost:8081/products');
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchProducts();
    }, []);

    function addToCart(product) {
        setCart((prev) => {
            const existing = prev.find((item) => item.product_id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    }

    function removeFromCart(productId) {
        setCart((prev) => prev.filter((item) => item.product_id !== productId));
    }

    async function placeOrder() {
        setOrderStatus(null);
        setError(null);
        try {
            // Demo: hardcoded user_id and payment_provider
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const res = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1,
                    items: cart,
                    total,
                    payment_provider: 'mockpay'
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Order failed');
            setOrderStatus('Order placed successfully! Order ID: ' + data.order.id);
            setCart([]);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <Layout>
            <section style={{ padding: 40, maxWidth: 700, margin: '0 auto' }}>
                <h2>Shopping Cart</h2>
                <div style={{ marginBottom: 32 }}>
                    <h3>Add Products</h3>
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                {product.name} — ${product.price}
                                <button style={{ marginLeft: 16 }} onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Your Cart</h3>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.product_id}>
                                {item.name} x {item.quantity} — ${item.price * item.quantity}
                                <button style={{ marginLeft: 16 }} onClick={() => removeFromCart(item.product_id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    {cart.length === 0 && <p>Your cart is empty.</p>}
                </div>
                <div style={{ marginTop: 24 }}>
                    <button onClick={placeOrder} disabled={cart.length === 0}>
                        Place Order
                    </button>
                </div>
                {orderStatus && <p style={{ color: 'green' }}>{orderStatus}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>
        </Layout>
    );
}
