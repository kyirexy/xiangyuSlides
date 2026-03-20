import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MousePointer2, MapPin, Image as ImageIcon, Hash, Square, 
  Pencil, Type, Sparkles, Share, ArrowRightToLine, Paperclip, 
  Lightbulb, Globe, Box, ArrowUp, PlusSquare, Circle, Layers, Minus, Plus
} from 'lucide-react';

export default function Editor() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-[#f9fafb] overflow-hidden font-sans">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Nav */}
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm relative">
              L
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border border-white rounded-full"></div>
            </div>
            <span className="font-medium text-gray-900">Untitled</span>
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
              <span className="text-gray-400">⚡</span> 80
            </div>
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
              X
            </div>
          </div>
        </header>

        {/* Canvas Content */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            输入你的想法开始创作，或按 <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono shadow-sm">C</kbd> 开始对话
          </p>
        </div>

        {/* Bottom Toolbar */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
          {/* Zoom controls */}
          <div className="bg-white rounded-full shadow-sm border border-gray-200 flex items-center px-2 py-1.5 h-12 pointer-events-auto">
            <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Circle className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Layers className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-500 px-1">100%</span>
            <button className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Main Tools */}
          <div className="bg-white rounded-full shadow-sm border border-gray-200 flex items-center px-2 py-1.5 h-12 gap-1 pointer-events-auto absolute left-1/2 -translate-x-1/2">
            <button className="p-2 bg-gray-900 text-white rounded-full">
              <MousePointer2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Hash className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Square className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Type className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Sparkles className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <ArrowRightToLine className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-12 h-12"></div> {/* Spacer for right alignment */}
        </div>
      </div>

      {/* Right Sidebar (Chat) */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4">
          <h2 className="font-medium text-gray-900 truncate pr-4 text-sm">设计一个可口可乐的海报</h2>
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100">
              <PlusSquare className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100">
              <Share className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100">
              <ArrowRightToLine className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-[#f8f9fa] border border-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
              设计一个可口可乐的海报
            </div>
          </div>

          {/* Agent Message */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Mar 20, 2026</span>
            <div className="text-gray-900 text-sm leading-relaxed">
              我来为您设计一个可口可乐的海报。首先让我搜索一些可口可乐的视觉元素作为参考。
            </div>
          </div>

          {/* Agent Status */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold relative">
              L
              <div className="absolute top-1 right-1 w-1 h-1 border border-white rounded-full"></div>
            </div>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              思考中<span className="animate-pulse">...</span>
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
            <textarea 
              placeholder='Start with an idea, or type "@" to mention'
              className="w-full h-12 resize-none outline-none text-sm text-gray-900 placeholder-gray-300"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-gray-200">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 text-blue-500 text-xs font-medium hover:bg-blue-50">
                  <Sparkles className="w-3 h-3" /> Agent
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-transparent">
                  <Lightbulb className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-transparent">
                  <Sparkles className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 border border-transparent">
                  <Globe className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full border border-blue-200">
                  <Box className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center ml-1 hover:bg-gray-800">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
