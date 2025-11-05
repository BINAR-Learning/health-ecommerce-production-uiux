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
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Platform Terpercaya untuk Produk Kesehatan
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Toko online produk kesehatan terpercaya dengan AI recommendation & payment gateway
          </p>
          <Link to="/products">
            <Button 
              type="primary" 
              size="large" 
              className="!bg-white !text-blue-600 hover:!bg-gray-100 !h-auto !py-3 !px-6 sm:!px-8 !text-sm sm:!text-base md:!text-lg !font-semibold !border-0"
            >
              Mulai Belanja Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
              Kami berkomitmen memberikan pengalaman terbaik dalam berbelanja produk kesehatan
            </p>
          </div>
          
          <Row gutter={[20, 20]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className="text-center h-full hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-400 hover:-translate-y-2 rounded-xl bg-white"
                  bodyStyle={{ padding: '28px 24px' }}
                >
                  <div className="mb-5 flex justify-center transform transition-transform hover:scale-110 duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">
            Siap Untuk Hidup Lebih Sehat?
          </h2>
          <p className="text-sm xs:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Jelajahi katalog produk kesehatan kami dan temukan yang sesuai dengan kebutuhan Anda
          </p>
          <Link to="/products">
            <Button 
              type="primary" 
              size="large"
              className="!h-auto !py-3 !px-6 sm:!px-8 !text-sm sm:!text-base md:!text-lg !font-semibold"
            >
              Lihat Katalog Produk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

