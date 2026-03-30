import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(gamesData.map(g => g.category))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-purple-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Popular</a>
            <a href="#" className="hover:text-white transition-colors">New</a>
            <a href="#" className="hover:text-white transition-colors">Random</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold uppercase tracking-wider bg-purple-600 px-2 py-1 rounded">Play Now</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">{game.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      {game.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No games found</h2>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      {/* Game Player Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video bg-[#111] rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/10 overflow-hidden flex flex-col"
            >
              {/* Player Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
                    {selectedGame.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(selectedGame.url, '_blank')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Player Footer */}
              <div className="px-6 py-4 bg-white/5 flex items-center justify-between text-sm text-gray-400">
                <p>{selectedGame.description}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" /> Fullscreen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold tracking-tight">UNBLOCKEDGAMES</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-sm text-gray-600">
            © 2026 Unblocked Games Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
