import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

const POSTS = [
  {
    id: 1,
    title: 'Top 10 Wedding Trends for 2027: What to Expect',
    excerpt: 'From sustainable decor to tech-integrated experiences, discover how the wedding landscape is evolving this year.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    category: 'Wedding Planning',
    date: 'Oct 12, 2026',
    author: 'Sarah Jenkins',
    featured: true
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Caterer',
    excerpt: 'A comprehensive guide to tasting menus, dietary requirements, and negotiating catering contracts.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80',
    category: 'Vendor Tips',
    date: 'Oct 05, 2026',
    author: 'Michael Chen'
  },
  {
    id: 3,
    title: 'Corporate Events: Maximizing ROI',
    excerpt: 'Learn how to measure the success of your corporate gatherings and ensure your budget is well spent.',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&q=80',
    category: 'Corporate',
    date: 'Sep 28, 2026',
    author: 'David Wright'
  },
  {
    id: 4,
    title: 'Lighting 101: Setting the Mood',
    excerpt: 'Why uplighting, pin spotting, and custom gobos can completely transform your event space.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
    category: 'Design & Decor',
    date: 'Sep 15, 2026',
    author: 'Elena Rossi'
  }
];

export const Blog = () => {
  const featuredPost = POSTS[0];
  const regularPosts = POSTS.slice(1);

  return (
    <div className="pt-40 pb-20 min-h-screen bg-background relative">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            The Nexora <span className="text-gradient">Journal</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Expert advice, event inspiration, and industry news curated by top professionals.
          </motion.p>
        </div>

        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="group relative rounded-3xl overflow-hidden glass-card border border-white/10 flex flex-col md:flex-row cursor-pointer hover:border-primary/50 transition-colors">
            <div className="md:w-3/5 h-64 md:h-96 relative overflow-hidden">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-primary font-semibold text-sm mb-4 uppercase tracking-wider">{featuredPost.category}</span>
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight">{featuredPost.title}</h2>
              <p className="text-white/60 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {featuredPost.date}</span>
                  <span className="flex items-center gap-1"><User className="w-4 h-4"/> {featuredPost.author}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regularPosts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden bg-surface border border-white/5 aspect-[4/3] mb-4 relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-white/40">{post.date}</span>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-4 h-4" /></span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="outline" size="lg">Load More Articles</Button>
        </div>

      </div>
    </div>
  );
};
