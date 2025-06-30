import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ background: '#222', color: '#fff', padding: '1rem 2rem' }}>
                <nav style={{ display: 'flex', gap: 20 }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Marketplace</Link>
                    <Link href="/products" style={{ color: '#fff' }}>Products</Link>
                    {user && <Link href="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>}
                    {user && <Link href="/cart" style={{ color: '#fff' }}>Cart</Link>}
                    {user && <Link href="/order-status" style={{ color: '#fff' }}>Order Status</Link>}
                    {!user && <Link href="/login" style={{ color: '#fff' }}>Login</Link>}
                    {!user && <Link href="/register" style={{ color: '#fff' }}>Register</Link>}
                    {user && <button onClick={logout} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>}
                </nav>
            </header>
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{ background: '#eee', color: '#333', padding: '1rem 2rem', textAlign: 'center' }}>
                &copy; {new Date().getFullYear()} Marketplace Platform
            </footer>
        </div>
    );
}
