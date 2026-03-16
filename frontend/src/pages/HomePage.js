import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Recycle,
  Gift,
  ArrowRight,
  Search,
  Plus,
  Heart,
  ShoppingCart,
  Leaf
} from 'lucide-react';

const HomePage = () => {
  const { addToCart } = useCart();

  const featuredData = [
    {
      id: 1,
      title: 'Cozy Wool Sweater',
      price: 4575,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
      category: 'Outerwear',
      condition: 'New',
      size: 'L',
      type: 'swap',
      seller: 'Olivia T.',
    },
    {
      id: 2,
      title: 'Brown Leather Boots',
      price: 6600,
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80',
      category: 'Shoes',
      condition: 'Good',
      size: 'L',
      type: 'sell',
      seller: 'Michael R.',
    },
    {
      id: 3,
      title: 'Black Cotton T-Shirt',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
      category: 'Tops',
      condition: 'Good',
      size: 'M',
      type: 'swap_only',
      seller: 'Sarah M.',
    },
    {
      id: 4,
      title: 'Floral Summer Dress',
      price: 2900,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
      category: 'Dresses',
      condition: 'Good',
      size: 'S',
      type: 'swap',
      seller: 'Emma L.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative">
      {/* Hero Section */}
      <section className="bg-[#108c4b] text-white py-32 px-4 relative overflow-hidden">
        {/* Background Patterns (Simulated) */}
        <div className="absolute top-10 left-10 opacity-20 transform -rotate-12">
           <Leaf className="w-48 h-48" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 transform rotate-12">
           <Recycle className="w-48 h-48" />
        </div>

        <div className="max-w-[1400px] mx-auto text-center relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-[5rem] font-extrabold mb-8 tracking-tight leading-tight max-w-4xl">
            Reduce Waste <br/> Reimagine fashion
          </h1>
          <p className="text-xl md:text-2xl text-green-50 mb-12 font-light max-w-2xl">
            Buy, sell, and swap pre-loved fashion. Sustainable style made simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/browse"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm"
            >
              Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/sell-swap"
              className="border-2 border-white/80 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 flex items-center justify-center transition-all bg-transparent"
            >
              List Your Items
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16 text-center">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-[#e6f6eb] rounded-full flex items-center justify-center mb-8">
                <ShoppingBag className="h-10 w-10 text-[#108c4b]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse & Buy</h3>
              <p className="text-gray-600 leading-relaxed text-[1.1rem]">
                Discover unique pre-loved fashion from our community. Filter by size, style, and condition.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-[#fff4e5] rounded-full flex items-center justify-center mb-8">
                <Recycle className="h-10 w-10 text-[#d97c23]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Swap Items</h3>
              <p className="text-gray-600 leading-relaxed text-[1.1rem]">
                Trade your clothes with others. Find the perfect match and refresh your wardrobe for free.
              </p>
            </div>
            
             {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-[#e5f8f5] rounded-full flex items-center justify-center mb-8">
                <Gift className="h-10 w-10 text-[#0f8c85]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sell & Earn</h3>
              <p className="text-gray-600 leading-relaxed text-[1.1rem]">
                List items you no longer wear. Set your price and connect with buyers instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
            Featured Items
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredData.map((item) => (
              <Link to={`/items/${item.id}`} key={item.id} className="block group">
                <div className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 focus:outline-none">
                      <span className={`px-4 py-2 text-sm font-bold rounded-lg shadow-sm backdrop-blur-md ${
                        item.type === 'sell' ? 'bg-white/90 text-gray-900' :
                        item.type === 'swap_only' ? 'bg-indigo-600/90 text-white' :
                        'bg-green-600/90 text-white'
                      }`}>
                        {item.type === 'sell' ? 'For Sale' : item.type === 'swap_only' ? 'Swap Only' : 'Sale or Swap'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-green-700 transition-colors">{item.title}</h3>
                    <div className="mb-4 text-sm">
                      <span className="text-[#3b82f6] font-medium">{item.condition}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-500">Size {item.size}</span>
                    </div>
                    
                    <div className="flex items-end justify-between mt-6">
                      <span className="text-[1.75rem] font-bold text-[#108c4b]">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-sm font-medium text-gray-400 mb-1">by {item.seller}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Quick Actions Menu */}
      <div className="fixed bottom-8 right-8 z-50">
         <div className="bg-white p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2 w-48">
            <Link to="/browse" className="flex items-center gap-3 w-full py-3 px-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-semibold shadow-sm">
               <Search className="h-5 w-5" /> Browse Items
            </Link>
            <Link to="/sell-swap" className="flex items-center gap-3 w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-semibold shadow-sm">
               <Plus className="h-5 w-5" /> Add Listing
            </Link>
            <Link to="/donate" className="flex items-center gap-3 w-full py-3 px-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-semibold shadow-sm">
               <Heart className="h-5 w-5" /> Donate
            </Link>
            <Link to="/cart" className="flex items-center gap-3 w-full py-3 px-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors font-semibold shadow-sm">
               <ShoppingCart className="h-5 w-5" /> My Cart
            </Link>
         </div>
      </div>

    </div>
  );
};

export default HomePage;
