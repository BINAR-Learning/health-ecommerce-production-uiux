import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Select, Input, Button, message, Tag } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import apiClient from '../services/api';
import { useCart } from '../context/CartContext';
import ProductSkeleton from '../components/ProductSkeleton';

const { Search } = Input;
const { Meta } = Card;

function ProductsPage() {
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  // Fetch products dengan React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', category, searchTerm],
    queryFn: async () => {
      const params = {};
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;

      const response = await apiClient.get('/api/products', { params });
      return response.data.data;
    },
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    message.success(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800">Katalog Produk Kesehatan</h1>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Select
          placeholder="Filter by Category"
          className="w-full sm:w-64"
          value={category || undefined}
          onChange={setCategory}
          allowClear
          size="large"
        >
          <Select.Option value="Vitamin">Vitamin</Select.Option>
          <Select.Option value="Supplement">Supplement</Select.Option>
          <Select.Option value="Medical Equipment">Medical Equipment</Select.Option>
          <Select.Option value="Medicine">Medicine</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>

        <Search
          placeholder="Cari produk..."
          enterButton={<SearchOutlined />}
          size="large"
          className="w-full sm:flex-1 sm:max-w-md"
          onSearch={setSearchTerm}
          allowClear
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">
            ❌ Gagal memuat produk. Pastikan backend berjalan di http://localhost:5000
          </p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Row gutter={[12, 12]} className="sm:gutter-[16, 16]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <ProductSkeleton />
            </Col>
          ))}
        </Row>
      )}

      {/* Products Grid */}
      {!isLoading && !error && data && (
        <Row gutter={[12, 12]} className="sm:gutter-[16, 16]">
          {data.length === 0 && (
            <Col span={24}>
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">
                  Tidak ada produk ditemukan. Coba filter lain!
                </p>
              </div>
            </Col>
          )}

          {data.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                className="h-full flex flex-col overflow-hidden"
                bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' }}
                cover={
                  <Link to={`/products/${product._id}`} className="block overflow-hidden">
                    <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-50 overflow-hidden border-b border-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                          alt={product.name}
                          src={product.imageUrl || '/placeholder.webp'}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.webp';
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                }
                actions={[
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                    key="cart"
                    className="!text-xs sm:!text-sm"
                  >
                    <span className="hidden xs:inline">Add to Cart</span>
                    <span className="xs:hidden">Add</span>
                  </Button>,
                ]}
              >
                <Meta
                  title={
                    <Link to={`/products/${product._id}`} className="text-gray-800 hover:text-blue-600 text-sm sm:text-base md:text-lg font-semibold line-clamp-2 block mb-2">
                      {product.name}
                    </Link>
                  }
                  description={
                    <div className="space-y-2">
                      <Tag color="blue" className="text-xs">{product.category}</Tag>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-1">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Stock: <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{product.stock}</span>
                      </p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ProductsPage;

