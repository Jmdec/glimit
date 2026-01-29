"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Newspaper, Calendar, Clock, Sparkles, AlertCircle, ChevronRight } from "lucide-react";
import FloatingParticles from "@/components/animated-golden-particles";
import useSWR from "swr";

interface NewsImage {
  id: number;
  image_path: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  images: NewsImage[];
  created_at: string;
  updated_at: string;
}

const API_IMG = process.env.NEXT_PUBLIC_API_IMG;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function News() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Fetch news items
  const { data, error, isLoading } = useSWR<{
    data: NewsItem[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }>("/api/news?per_page=100", fetcher);

  const newsItems = data?.data || [];

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_IMG}/${cleanPath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gold particles background */}
      <FloatingParticles count={40} />

      {/* Hero Section with Film Strip Effect */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Animated film perforations - gold */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black border-b-2 border-amber-500 flex items-center overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [0, -200] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-7 bg-linear-to-b from-amber-500 to-amber-600 mx-3 rounded-sm shadow-lg shadow-amber-500/30"
              />
            ))}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto text-center pt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Camera viewfinder decoration */}
            <div className="inline-block relative mb-8">
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 border-l-3 border-t-3 border-amber-500"
                initial={{ opacity: 0, x: -10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <div className="absolute top-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 border-r-3 border-t-3 border-amber-500"
                initial={{ opacity: 0, x: 10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-12 h-12 border-l-3 border-b-3 border-amber-500"
                initial={{ opacity: 0, x: -10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-12 h-12 border-r-3 border-b-3 border-amber-500"
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 rounded-full" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white px-12 py-6">
                Latest{" "}
                <span className="bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 bg-clip-text text-transparent font-bold">
                  News
                </span>
              </h1>
            </div>

            {/* Sparkle decorations */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
              <p className="text-lg text-gray-300 max-w-2xl">
                {isLoading
                  ? "Loading news..."
                  : `Stay updated with our latest announcements and updates.`}
              </p>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-1 w-40 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-500 mb-1">Failed to load news</h3>
              <p className="text-sm text-red-400">Please check your API configuration</p>
            </div>
          </div>
        </section>
      )}

      {/* News Grid with Enhanced Hover Effects */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">Loading news items...</p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">No news articles found</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {newsItems.map((news, index) => (
                  <motion.div
                    key={news.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                    transition={{ delay: index * 0.08, duration: 0.6, type: "spring" }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedNews(news)}
                    onMouseEnter={() => setHoveredId(news.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    whileHover={{ y: -10 }}
                  >
                    {/* Gold frame with shadow */}
                    <div className="bg-linear-to-br from-amber-500/20 to-amber-600/20 p-1 rounded-lg hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-amber-500/30">
                      <div className="bg-black rounded-lg relative overflow-hidden h-full flex flex-col">
                        {/* Image Section */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-black">
                          <Image
                            src={news.images && news.images.length > 0 
                              ? getImageUrl(news.images[0].image_path) 
                              : "/placeholder.png"}
                            alt={news.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-contain transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                          />

                          {/* Gold overlay gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                          {/* Date badge */}
                          <motion.div
                            className="absolute top-4 right-4 bg-linear-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.date)}
                          </motion.div>

                          {/* Image count indicator */}
                          {news.images && news.images.length > 1 && (
                            <motion.div
                              className="absolute bottom-4 left-4 bg-black/80 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="flex gap-1">
                                {news.images.slice(0, 3).map((_, idx) => (
                                  <div key={idx} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                ))}
                              </div>
                              {news.images.length} photos
                            </motion.div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex-1 flex flex-col">
                          <motion.h3
                            className="font-serif text-2xl text-white mb-3 line-clamp-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {news.title}
                          </motion.h3>
                          
                          <motion.p
                            className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {news.description}
                          </motion.p>

                          {/* Read more button */}
                          <motion.div
                            className="flex items-center gap-2 text-amber-500 font-bold text-sm group-hover:gap-3 transition-all duration-300"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            Read More
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </div>

                        {/* Corner glow effects */}
                        <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-amber-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-black border-2 border-amber-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-amber-500 hover:bg-amber-600 text-black rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Images Gallery */}
              {selectedNews.images && selectedNews.images.length > 0 && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-black">
                  <Image
                    src={getImageUrl(selectedNews.images[0].image_path)}
                    alt={selectedNews.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                </div>
              )}

              {/* Additional images */}
              {selectedNews.images && selectedNews.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {selectedNews.images.slice(1).map((image, idx) => (
                    <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg border border-amber-500/30 bg-black">
                      <Image
                        src={getImageUrl(image.image_path)}
                        alt={`${selectedNews.title} - Image ${idx + 2}`}
                        fill
                        sizes="(max-width: 1024px) 25vw, 200px"
                        className="object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-amber-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedNews.date)}
                  </div>
                  {selectedNews.images && selectedNews.images.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4" />
                      {selectedNews.images.length} {selectedNews.images.length === 1 ? 'photo' : 'photos'}
                    </div>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  {selectedNews.title}
                </h2>

                <div className="prose prose-invert prose-amber max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedNews.description}
                  </p>
                </div>

                {/* Meta info */}
                <div className="mt-8 pt-8 border-t border-amber-500/30 flex items-center justify-between text-sm text-gray-500">
                  <div>
                    Published on {formatDate(selectedNews.created_at)}
                  </div>
                  {selectedNews.updated_at !== selectedNews.created_at && (
                    <div>
                      Updated on {formatDate(selectedNews.updated_at)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}