import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Button, Drawer, Dropdown, Avatar, message } from 'antd';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

function Navbar() {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn, logout } = useAuth();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    message.success('Logout berhasil');
    navigate('/');
  };

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'Riwayat Pesanan',
      onClick: () => navigate('/orders'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'cart',
      icon: (
        <Badge count={cartItemCount} offset={[10, 0]}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: <Link to="/cart">Cart</Link>,
    },
    ...(isLoggedIn ? [{
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link to="/orders">Riwayat Pesanan</Link>,
    }] : []),
  ];

  return (
    <Header className="!flex items-center justify-between !px-4 md:!px-6 lg:!px-8 !bg-white !shadow-lg !sticky !top-0 !z-50 !h-16 !leading-none border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors no-underline">
          <span className="text-xl sm:text-2xl"></span>
          <span className="hidden sm:inline">Health E-Commerce</span>
          <span className="sm:hidden">Health</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <Menu
          mode="horizontal"
          items={menuItems}
          className="border-0 bg-transparent flex-1 min-w-0"
          selectedKeys={[]}
          style={{ lineHeight: '64px' }}
        />
        
        <Button
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          type="text"
          className="!flex items-center justify-center"
          size="middle"
        />

        {/* User Menu atau Login Button */}
        {isLoggedIn ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" className="!flex items-center gap-2">
              <Avatar size="small" icon={<UserOutlined />} className="bg-blue-500" />
              <span className="hidden lg:inline">{user?.name}</span>
            </Button>
          </Dropdown>
        ) : (
          <Button 
            type="primary" 
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-2">
        <Button
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          type="text"
        />
        
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          type="text"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={() => setDrawerVisible(false)}
        />

        {/* User Section in Mobile Drawer */}
        {isLoggedIn ? (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg mb-3">
              <Avatar icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <div className="font-semibold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <Menu
              mode="vertical"
              items={userMenuItems}
              onClick={() => setDrawerVisible(false)}
            />
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t px-4">
            <Button 
              type="primary" 
              icon={<LoginOutlined />}
              onClick={() => {
                setDrawerVisible(false);
                navigate('/login');
              }}
              block
            >
              Login
            </Button>
          </div>
        )}
      </Drawer>
    </Header>
  );
}

export default Navbar;

