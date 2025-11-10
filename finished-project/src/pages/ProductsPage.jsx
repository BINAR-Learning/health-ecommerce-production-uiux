import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Select, Input, Button, message, Tag, Pagination } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, LoginOutlined } from '@ant-design/icons';
import apiClient from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductSkeleton from '../components/ProductSkeleton';

const { Search } = Input;
const { Meta } = Card;

function ProductsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const itemsPerPage = 12;

  // Fetch products dengan React Query dan pagination
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['products', category, searchTerm, currentPage, sortBy],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
      };
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;

      const response = await apiClient.get('/api/products', { params });
      return response.data;
    },
  });

  const data = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const totalProducts = response?.total || 0;

  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      message.warning({
        content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang',
        duration: 3,
        icon: <LoginOutlined />,
        onClick: () => navigate('/login')
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
      }, 1500);
      return;
    }

    addToCart(product);
    message.success(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800">Katalog Produk Kesehatan</h1>

      {/* Filters & Sort */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select
            placeholder="Filter by Category"
            className="w-full sm:w-64"
            value={category || undefined}
            onChange={(value) => {
              setCategory(value);
              setCurrentPage(1);
            }}
            allowClear
            size="large"
          >
            <Select.Option value="Vitamin">Vitamin</Select.Option>
            <Select.Option value="Supplement">Supplement</Select.Option>
            <Select.Option value="Medical Equipment">Medical Equipment</Select.Option>
            <Select.Option value="Medicine">Medicine</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>

          <Select
            placeholder="Sort by"
            className="w-full sm:w-48"
            value={sortBy}
            onChange={setSortBy}
            size="large"
          >
            <Select.Option value="newest">Terbaru</Select.Option>
            <Select.Option value="price-asc">Harga: Rendah ke Tinggi</Select.Option>
            <Select.Option value="price-desc">Harga: Tinggi ke Rendah</Select.Option>
            <Select.Option value="name-asc">Nama: A-Z</Select.Option>
            <Select.Option value="name-desc">Nama: Z-A</Select.Option>
          </Select>

          <Search
            placeholder="Cari produk..."
            enterButton={<SearchOutlined />}
            size="large"
            className="w-full sm:flex-1 sm:max-w-md"
            onSearch={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            allowClear
          />
        </div>

        {/* Results Info */}
        {!isLoading && !error && (
          <div className="text-sm text-gray-600">
            Menampilkan {data.length} dari {totalProducts} produk
            {category && ` • Category: ${category}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </div>
        )}
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
                          src={product.image || '/placeholder.webp'}
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

      {/* Pagination */}
      {!isLoading && !error && data.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={itemsPerPage}
            onChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} dari ${total} produk`}
            responsive
          />
        </div>
      )}
    </div>
  );
}

export default ProductsPage;

