import { Link } from 'react-router-dom';
import { Button, Card, Row, Col } from 'antd';
import {
  ShoppingOutlined,
  SafetyOutlined,
  RocketOutlined,
  HeartOutlined,
} from '@ant-design/icons';

function HomePage() {
  const features = [
    {
      icon: <SafetyOutlined className="text-4xl text-blue-500" />,
      title: 'Produk Berkualitas',
      description: 'Semua produk kesehatan tersertifikasi dan terjamin kualitasnya.',
    },
    {
      icon: <RocketOutlined className="text-4xl text-green-500" />,
      title: 'Pengiriman Cepat',
      description: 'Pengiriman ke seluruh Indonesia dengan jaminan aman dan cepat.',
    },
    {
      icon: <HeartOutlined className="text-4xl text-red-500" />,
      title: 'Konsultasi Gratis',
      description: 'Chat dengan AI assistant untuk rekomendasi produk kesehatan.',
    },
    {
      icon: <ShoppingOutlined className="text-4xl text-purple-500" />,
      title: 'Belanja Mudah',
      description: 'Pembayaran aman dengan berbagai metode payment.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🏥 Health E-Commerce
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Toko online produk kesehatan terpercaya dengan AI recommendation & payment gateway
          </p>
          <Link to="/products">
            <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100">
              Mulai Belanja Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Kenapa Memilih Kami?
          </h2>
          
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Untuk Hidup Lebih Sehat?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Jelajahi katalog produk kesehatan kami dan temukan yang sesuai dengan kebutuhan Anda
          </p>
          <Link to="/products">
            <Button type="primary" size="large">
              Lihat Katalog Produk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

