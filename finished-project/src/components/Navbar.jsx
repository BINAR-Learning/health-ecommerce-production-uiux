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
    <Header className="flex items-center justify-between px-4 md:px-8 bg-white shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🏥 Health E-Commerce
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Menu
          mode="horizontal"
          items={menuItems}
          className="border-0 bg-transparent"
          selectedKeys={[]}
        />
        
        <Button
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          type="text"
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

