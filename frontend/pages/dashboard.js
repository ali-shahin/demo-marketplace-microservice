import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

export default function DashboardPage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    // Fetch user profile and orders
    useEffect(() => {
        async function fetchData() {
            if (!token) return;
            setLoadingData(true);
            setError(null);
            try {
                // Fetch user profile (replace endpoint as needed)
                const userRes = await fetch('http://localhost:8080/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!userRes.ok) throw new Error('Failed to fetch user profile');
                const userData = await userRes.json();
                setProfile(userData);

                // Fetch user orders (replace endpoint as needed)
                const ordersRes = await fetch(`http://localhost:8000/api/orders?user_id=${userData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!ordersRes.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingData(false);
            }
        }
        if (user && token) fetchData();
    }, [user, token]);

    if (!user) return null; // or loading spinner
    if (loadingData) return (
        <Layout>
            <main style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
                <p>Loading...</p>
            </main>
        </Layout>
    );

    return (
        <Layout>
            <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
                <section aria-labelledby="dashboard-title" style={{ marginBottom: 32 }}>
                    <h2 id="dashboard-title" tabIndex={-1} style={{ fontSize: '2rem', marginBottom: 16 }}>User Dashboard</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{ marginBottom: 32 }}>
                        <h3>Profile</h3>
                        <p><strong>Email:</strong> {profile?.email || user.email}</p>
                    </div>
                </section>
                <section aria-labelledby="order-history-title">
                    <h3 id="order-history-title">Order History</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ borderBottom: '2px solid #333', textAlign: 'left', background: '#f5f5f5' }}>Order ID</th>
                                    <th scope="col" style={{ borderBottom: '2px solid #333', textAlign: 'left', background: '#f5f5f5' }}>Total</th>
                                    <th scope="col" style={{ borderBottom: '2px solid #333', textAlign: 'left', background: '#f5f5f5' }}>Status</th>
                                    <th scope="col" style={{ borderBottom: '2px solid #333', textAlign: 'left', background: '#f5f5f5' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} tabIndex={0} style={{ outline: 'none' }}>
                                        <td>{order.id}</td>
                                        <td>${order.total}</td>
                                        <td>{order.status}</td>
                                        <td>{order.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {orders.length === 0 && <p>No orders found.</p>}
                </section>
                <style jsx>{`
                    @media (max-width: 600px) {
                        main { padding: 8px; }
                        table { font-size: 0.95rem; }
                        h2 { font-size: 1.3rem; }
                    }
                    tr:focus {
                        outline: 2px solid #0070f3;
                        background: #e6f0fa;
                    }
                `}</style>
            </main>
        </Layout>
    );
}
