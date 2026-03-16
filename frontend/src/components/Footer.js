import React from 'react';
import { Facebook, Twitter, Instagram, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-200 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-6">
              <div className="bg-[#108c4b] p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">EcoCloset</span>
            </Link>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-sm">
              Join the sustainable fashion revolution. Swap, sell, and give pre-loved clothing a second chance while reducing fashion waste.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[1.1rem] font-bold text-gray-900 mb-6">Shop</h3>
            <ul className="space-y-4">
              <li><Link to="/browse" className="text-gray-600 hover:text-green-700 transition-colors">Browse All</Link></li>
              <li><Link to="/browse?category=Tops" className="text-gray-600 hover:text-green-700 transition-colors">Tops</Link></li>
              <li><Link to="/browse?category=Bottoms" className="text-gray-600 hover:text-green-700 transition-colors">Bottoms</Link></li>
              <li><Link to="/browse?category=Shoes" className="text-gray-600 hover:text-green-700 transition-colors">Shoes</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-[1.1rem] font-bold text-gray-900 mb-6">Community</h3>
            <ul className="space-y-4">
              <li><Link to="/sell-swap" className="text-gray-600 hover:text-green-700 transition-colors">List an Item</Link></li>
              <li><Link to="/donate" className="text-gray-600 hover:text-green-700 transition-colors">Donate to NGOs</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-green-700 transition-colors">How It Works</Link></li>
              <li><Link to="/sustainability" className="text-gray-600 hover:text-green-700 transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[1.1rem] font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-gray-600 hover:text-green-700 transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-green-700 transition-colors">Safety Tips</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-green-700 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-green-700 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">
            © {new Date().getFullYear()} EcoCloset. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-md transition-all shadow-sm border border-gray-100">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-md transition-all shadow-sm border border-gray-100">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-md transition-all shadow-sm border border-gray-100">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
