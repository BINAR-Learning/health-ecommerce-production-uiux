import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Select, Input, Button, message } from 'antd';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Katalog Produk Kesehatan</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Select
          placeholder="Filter by Category"
          className="w-full md:w-64"
          value={category || undefined}
          onChange={setCategory}
          allowClear
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
          className="w-full md:w-96"
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
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <ProductSkeleton />
            </Col>
          ))}
        </Row>
      )}

      {/* Products Grid */}
      {!isLoading && !error && data && (
        <Row gutter={[16, 16]}>
          {data.length === 0 && (
            <Col span={24}>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Tidak ada produk ditemukan. Coba filter lain!
                </p>
              </div>
            </Col>
          )}

          {data.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={
                  <Link to={`/products/${product._id}`}>
                    <img
                      alt={product.name}
                      src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'}
                      className="h-48 w-full object-cover"
                    />
                  </Link>
                }
                actions={[
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                    key="cart"
                  >
                    Add to Cart
                  </Button>,
                ]}
              >
                <Meta
                  title={
                    <Link to={`/products/${product._id}`} className="text-gray-800 hover:text-blue-600">
                      {product.name}
                    </Link>
                  }
                  description={
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="text-xl font-bold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Stock: {product.stock}
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

