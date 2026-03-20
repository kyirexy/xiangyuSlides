import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, Plus, Home, Folder, User, Info, 
  Paperclip, Lightbulb, Sparkles, Globe, Box, ArrowUp,
  Image as ImageIcon, Star, Palette, Monitor, Video
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold relative">
            L
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border border-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold tracking-tight">Lovart</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            简体中文 <ChevronDown className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            升级 <span className="text-yellow-400">⚡</span> 80
          </button>
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
            X
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        <button 
          onClick={() => navigate('/editor')}
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
        <div className="bg-white border border-gray-200 rounded-full py-4 flex flex-col gap-4 shadow-sm items-center w-12">
          <button className="p-2 bg-gray-100 rounded-full text-gray-900">
            <Home className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900">
            <Folder className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-12 pb-24 px-8">
        {/* Banner */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#fff7ed] text-orange-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs">NEW</span>
            Nano Banana 2 震撼发布，最高立省 50%！
            <a href="#" className="text-orange-500 hover:underline flex items-center gap-1 ml-1">
              立即升级 <ArrowUp className="w-3 h-3 rotate-45" />
            </a>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl relative">
              L
              <div className="absolute top-2 right-2 w-2 h-2 border-2 border-white rounded-full"></div>
            </div>
            Lovart 让设计更简单
          </h1>
          <p className="text-gray-400 text-lg">懂你的设计代理，帮你搞定一切</p>
        </div>

        {/* Search/Input */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 transition-shadow focus-within:shadow-md focus-within:border-gray-300">
          <textarea 
            placeholder="让 Lovart"
            className="w-full h-24 resize-none outline-none text-gray-900 placeholder-gray-300 text-lg"
          />
          <div className="flex items-center justify-between mt-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
                <Lightbulb className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
                <Sparkles className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
                <Globe className="w-4 h-4" />
              </button>
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full border border-blue-200">
                <Box className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-200 text-white rounded-full ml-2 cursor-not-allowed">
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button className="px-4 py-1.5 rounded-full border border-orange-400 text-orange-500 text-sm font-medium flex items-center gap-1.5 hover:bg-orange-50">
            <span className="text-lg leading-none">🍌</span> Nano Banana Pro
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50">
            <ImageIcon className="w-4 h-4" /> Design
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50">
            <Star className="w-4 h-4" /> Branding
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50">
            <Palette className="w-4 h-4" /> Illustration
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50">
            <Monitor className="w-4 h-4" /> E-Commerce
          </button>
          <button className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50">
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        {/* Recent Projects */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-medium mb-6">最近项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/editor')}
              className="aspect-[4/3] bg-[#f8f9fa] rounded-2xl border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-900 mb-2" />
              <span className="text-gray-900 font-medium">新建项目</span>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3 border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop" 
                  alt="Coffee" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-gray-900">Untitled</h3>
              <p className="text-xs text-gray-400 mt-1">更新于 2026-03-19</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#f8f9fa] rounded-2xl overflow-hidden mb-3 border border-gray-100">
              </div>
              <h3 className="font-medium text-gray-900">Untitled</h3>
              <p className="text-xs text-gray-400 mt-1">更新于 2026-03-19</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
