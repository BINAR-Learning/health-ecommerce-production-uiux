import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Image, message, Spin } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import apiClient from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data.data;
    },
  });

  const handleAddToCart = () => {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        Kembali
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Product'}
            alt={product.name}
            className="rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>

          <Descriptions bordered column={1} className="mb-6">
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
            className="w-full md:w-auto"
          >
            {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;

