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
            src={record.imageUrl || 'https://via.placeholder.com/80'}
            alt={name}
            className="w-20 h-20 object-cover rounded"
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
      render: (price) => (
        <span className="font-semibold">
          Rp {price.toLocaleString('id-ID')}
        </span>
      ),
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
      render: (_, record) => (
        <span className="font-bold text-blue-600">
          Rp {(record.price * record.quantity).toLocaleString('id-ID')}
        </span>
      ),
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-lg text-gray-500">
              Keranjang Anda kosong
            </span>
          }
        >
          <Link to="/products">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Mulai Belanja
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

      <Table
        columns={columns}
        dataSource={cart}
        rowKey="_id"
        pagination={false}
        scroll={{ x: 800 }}
      />

      {/* Summary */}
      <div className="mt-8 flex justify-end">
        <div className="bg-gray-50 p-6 rounded-lg w-full md:w-96">
          <div className="flex justify-between mb-4">
            <span className="text-lg">Total Items:</span>
            <span className="font-semibold">{cart.length} produk</span>
          </div>
          
          <div className="flex justify-between mb-6 pb-4 border-b">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              Rp {getCartTotal().toLocaleString('id-ID')}
            </span>
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full"
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

