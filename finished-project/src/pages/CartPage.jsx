import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, InputNumber, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (productId, value) => {
    if (value < 1) return;
    updateQuantity(productId, value);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    message.success(`${productName} dihapus dari keranjang`);
  };

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center gap-4">
          <img
            src={record.imageUrl || '/placeholder.webp'}
            alt={name}
            className="w-20 h-20 object-cover rounded bg-gray-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.webp';
            }}
          />
          <div>
            <Link
              to={`/products/${record._id}`}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              {name}
            </Link>
            <p className="text-sm text-gray-500">{record.category}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        const safePrice = price || 0;
        return (
          <span className="font-semibold">
            Rp {Number(safePrice).toLocaleString('id-ID')}
          </span>
        );
      },
    },
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={quantity}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => {
        const price = record.price || 0;
        const quantity = record.quantity || 1;
        const subtotal = price * quantity;
        return (
          <span className="font-bold text-blue-600">
            Rp {Number(subtotal).toLocaleString('id-ID')}
          </span>
        );
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record._id, record.name)}
        >
          Hapus
        </Button>
      ),
    },
  ];

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-base sm:text-lg text-gray-500">
              Keranjang Anda kosong
            </span>
          }
        >
          <Link to="/products">
            <Button type="primary" icon={<ShoppingOutlined />} size="large">
              Mulai Belanja
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800">Keranjang Belanja</h1>

      <Table
        columns={columns}
        dataSource={cart}
        rowKey="_id"
        pagination={false}
        scroll={{ x: 800 }}
        className="[&_.ant-table]:text-sm sm:[&_.ant-table]:text-base"
      />

      {/* Summary */}
      <div className="mt-6 sm:mt-8 flex justify-end">
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg w-full md:w-96">
          <div className="flex justify-between mb-3 sm:mb-4">
            <span className="text-base sm:text-lg">Total Items:</span>
            <span className="font-semibold text-sm sm:text-base">{cart.length} produk</span>
          </div>
          
          <div className="flex justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
            <span className="text-lg sm:text-xl font-bold">Total:</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600">
              Rp {Number(getCartTotal() || 0).toLocaleString('id-ID')}
            </span>
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full !h-auto !py-3"
            onClick={() => navigate('/checkout')}
          >
            Lanjut ke Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

