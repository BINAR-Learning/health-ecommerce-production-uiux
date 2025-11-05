import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Badge, Button, Drawer } from 'antd';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;

function Navbar() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
  ];

  return (
    <Header className="!flex items-center justify-between !px-4 md:!px-6 lg:!px-8 !bg-white !shadow-lg !sticky !top-0 !z-50 !h-16 !leading-none border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-base sm:text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors no-underline">
          <span className="text-xl sm:text-2xl">🏥</span>
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
      </Drawer>
    </Header>
  );
}

export default Navbar;

