import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined, HomeOutlined, AppstoreOutlined, ShoppingCartOutlined, RobotOutlined, CreditCardOutlined, ApiOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <AntFooter className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-auto border-t-2 border-blue-500 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl"></span>
              <h3 className="text-xl font-bold text-white">Health E-Commerce</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-md">
              Platform terpercaya untuk produk kesehatan berkualitas dengan teknologi AI canggih dan sistem pembayaran yang aman. Kami berkomitmen memberikan pelayanan terbaik untuk kesehatan Anda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-sm">Privacy Policy</span>
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="text-sm">Terms of Service</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HomeOutlined className="text-blue-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <HomeOutlined className="text-xs group-hover:text-blue-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <AppstoreOutlined className="text-xs group-hover:text-blue-400" />
                  <span>Products</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ShoppingCartOutlined className="text-xs group-hover:text-blue-400" />
                  <span>Cart</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ApiOutlined className="text-blue-400" />
              Technology
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <RobotOutlined className="text-blue-400" />
                <span>Google Gemini AI</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <CreditCardOutlined className="text-green-400" />
                <span>Midtrans Payment</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-blue-400"></span>
                <span>Kemenkes API</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-xs md:text-sm text-gray-400">
                © {currentYear} Health E-Commerce. All rights reserved.
              </p>
              <span className="hidden md:inline text-gray-600">|</span>
              <p className="text-xs md:text-sm text-gray-400">
                Made with <HeartOutlined className="text-red-500 mx-1" /> in Indonesia
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <span className="text-xs font-semibold text-blue-400">MERN Stack</span>
            </div>
          </div>
        </div>
      </div>
    </AntFooter>
  );
}

export default Footer;

