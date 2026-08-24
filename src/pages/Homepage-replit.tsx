import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Scene3D } from '@/components/3d/Scene3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, 
  Award, 
  Users, 
  Zap,
  ArrowDown,
  Star,
  CheckCircle
} from 'lucide-react';

const Hero3D: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Suspense fallback={
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl">Loading 3D Experience...</div>
          </div>
        }>
          <Scene3D />
        </Suspense>
      </div>

      {/* Hero Overlay Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              FINESSE
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/80 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Digital Studio
            </motion.p>
          </div>

          <motion.p 
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Crafting premium video experiences that captivate audiences and elevate brands 
            through cutting-edge technology and artistic vision.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 px-8 py-4 text-lg shadow-2xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Project
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              View Portfolio
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 cursor-pointer hover:text-white/80 transition-colors"
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Projects Completed', icon: <Award className="w-8 h-8" /> },
    { number: '98%', label: 'Client Satisfaction', icon: <Star className="w-8 h-8" /> },
    { number: '50+', label: 'Industry Awards', icon: <CheckCircle className="w-8 h-8" /> },
    { number: '24/7', label: 'Creative Support', icon: <Zap className="w-8 h-8" /> },
  ];

  return (
    <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Numbers That Speak
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Our track record of excellence in digital video production
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="text-gold-400 mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm md:text-base">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesPreview: React.FC = () => {
  const services = [
    {
      title: 'Commercial Production',
      description: 'High-impact video content that drives results for your brand',
      price: 'From $5,000',
      features: ['4K Production', 'Creative Direction', 'Post-Production', 'Color Grading']
    },
    {
      title: 'Documentary Films',
      description: 'Compelling storytelling that captures authentic moments',
      price: 'From $10,000',
      features: ['Cinematic Quality', 'Sound Design', 'Advanced Editing', 'Distribution Support']
    },
    {
      title: 'Digital Content',
      description: 'Social media ready content optimized for engagement',
      price: 'From $2,500',
      features: ['Multi-Platform', 'Quick Turnaround', 'Analytics Ready', 'Brand Optimized']
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Production Services
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Professional video production tailored to your vision and budget
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-white/70 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-gold-400">{service.price}</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-white/80">
                        <CheckCircle className="w-5 h-5 text-gold-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 group-hover:scale-105 transition-transform duration-200"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Homepage() {
  return (
    <div className="min-h-screen">
      <Hero3D />
      <StatsSection />
      <ServicesPreview />
    </div>
  );
}