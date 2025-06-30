import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Marketplace Frontend</title>
            </Head>
            <section style={{ padding: 40, fontFamily: 'sans-serif' }}>
                <h1>Welcome to the Marketplace Platform</h1>
                <ul>
                    <li>User Service (Golang)</li>
                    <li>Product Service (Golang)</li>
                    <li>Order Service (Laravel)</li>
                    <li>Notification Service (Laravel)</li>
                    <li>Image Optimization Service (Node.js)</li>
                </ul>
                <p>This is the Next.js frontend. Start building your UI here!</p>
            </section>
        </Layout>
    );
}
