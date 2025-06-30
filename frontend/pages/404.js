import Layout from '../components/Layout';

export default function NotFoundPage() {
    return (
        <Layout>
            <section style={{ padding: 40, textAlign: 'center' }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
            </section>
        </Layout>
    );
}
