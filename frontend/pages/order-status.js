import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

export default function OrderStatusPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchOrderStatus(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setOrder(null);
        try {
            // Replace with your actual order-service API endpoint
            const res = await fetch(`http://localhost:8000/api/orders/${orderId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Order not found');
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Protect route
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [user, authLoading, router]);

    return (
        <Layout>
            <section style={{ padding: 40, maxWidth: 500, margin: '0 auto' }}>
                <h2>Order Status Tracking</h2>
                <form onSubmit={fetchOrderStatus} style={{ marginBottom: 24 }}>
                    <label>Order ID<br />
                        <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} required style={{ width: '100%' }} />
                    </label>
                    <button type="submit" disabled={loading || !orderId} style={{ marginTop: 12, width: '100%' }}>
                        {loading ? 'Checking...' : 'Check Status'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {order && (
                    <div style={{ background: '#f8f8f8', padding: 20, borderRadius: 8 }}>
                        <h3>Order #{order.id}</h3>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total:</strong> ${order.total}</p>
                        <p><strong>Created:</strong> {order.created_at}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.items && Array.isArray(order.items) ? order.items.map((item, idx) => (
                                <li key={idx}>{item.name} x {item.quantity} — ${item.price * item.quantity}</li>
                            )) : <li>No items found.</li>}
                        </ul>
                    </div>
                )}
            </section>
        </Layout>
    );
}
