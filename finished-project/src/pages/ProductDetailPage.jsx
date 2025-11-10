import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Image, message, Spin } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, LoginOutlined } from '@ant-design/icons';
import apiClient from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data.data;
    },
  });

  const handleAddToCart = () => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 text-lg mb-4">
          ❌ Produk tidak ditemukan
        </p>
        <Button onClick={() => navigate('/products')}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        className="mb-4 sm:mb-6"
        size="middle"
      >
        Kembali
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image || '/placeholder.webp'}
            alt={product.name}
            className="rounded-lg"
            fallback="/placeholder.webp"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{product.name}</h1>
          
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{product.description}</p>

          <div className="mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>

          <Descriptions bordered column={1} className="mb-4 sm:mb-6 text-sm sm:text-base">
            <Descriptions.Item label="Kategori">
              {product.category}
            </Descriptions.Item>
            <Descriptions.Item label="Stock">
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} tersedia</span>
              ) : (
                <span className="text-red-600">Habis</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Manufacturer">
              {product.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {product.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-gray-600">Inactive</span>
              )}
            </Descriptions.Item>
          </Descriptions>

          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full sm:w-auto !h-auto !py-3 !px-6"
          >
            {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

