import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Star, 
  Camera, 
  Film, 
  Edit, 
  Palette,
  Users,
  Clock,
  Award,
  Zap,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  addOns: string[];
  popular?: boolean;
  icon: React.ReactNode;
  deliverables: string[];
  timeline: string;
  included: {
    preProduction: string[];
    production: string[];
    postProduction: string[];
  };
}

const servicePackages: ServicePackage[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Perfect for startups and small businesses',
    price: '$2,500',
    duration: '1-2 weeks',
    description: 'Professional video production with all the essentials to get your message across effectively.',
    icon: <Camera className="w-8 h-8" />,
    features: [
      'Single camera setup',
      '1 location shoot',
      'Basic color correction',
      'Royalty-free music',
      '2 rounds of revisions',
      'HD 1080p delivery'
    ],
    addOns: [
      'Additional location (+$500)',
      'Drone footage (+$750)',
      'Professional actor (+$1,200)',
      'Rush delivery (+$800)'
    ],
    deliverables: [
      'Final video (1-3 minutes)',
      'Raw footage backup',
      'Social media cuts',
      'Basic analytics report'
    ],
    timeline: '5-10 business days',
    included: {
      preProduction: ['Concept development', 'Shot list creation', 'Location scouting'],
      production: ['1-day filming', 'Professional lighting', 'High-quality audio'],
      postProduction: ['Video editing', 'Color correction', 'Audio mixing', 'Graphics']
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Comprehensive production for growing brands',
    price: '$5,000',
    duration: '2-3 weeks',
    description: 'Elevated production value with multi-camera setups and advanced post-production techniques.',
    icon: <Film className="w-8 h-8" />,
    popular: true,
    features: [
      'Multi-camera setup',
      'Up to 3 locations',
      'Advanced color grading',
      'Custom music scoring',
      '4 rounds of revisions',
      '4K delivery + HD formats',
      'Drone footage included',
      'Professional actors'
    ],
    addOns: [
      'Additional shooting day (+$1,500)',
      'Motion graphics package (+$2,000)',
      'VR/360° footage (+$3,000)',
      'International crew (+$2,500)'
    ],
    deliverables: [
      'Final video (3-8 minutes)',
      'Extended director\'s cut',
      'Social media package',
      'Behind-the-scenes content',
      'Detailed analytics report'
    ],
    timeline: '10-15 business days',
    included: {
      preProduction: ['Creative brief', 'Storyboarding', 'Casting', 'Location management'],
      production: ['2-day filming', 'Professional crew', 'Equipment rental', 'Catering'],
      postProduction: ['Advanced editing', 'Color grading', 'Sound design', 'Motion graphics']
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Cinematic excellence for luxury brands',
    price: '$10,000+',
    duration: '4-6 weeks',
    description: 'Cinematic-quality production with cutting-edge technology and award-winning creative direction.',
    icon: <Award className="w-8 h-8" />,
    features: [
      'Cinema camera setup',
      'Unlimited locations',
      'Hollywood-grade post',
      'Original composition',
      'Unlimited revisions',
      '8K RAW delivery',
      'Helicopter/drone crew',
      'A-list talent booking',
      'International production',
      'Red carpet premiere'
    ],
    addOns: [
      'Documentary extension (+$15,000)',
      'International distribution (+$5,000)',
      'Award submission campaign (+$3,000)',
      'Celebrity endorsement (+$25,000)'
    ],
    deliverables: [
      'Cinematic masterpiece',
      'Director\'s commentary',
      'Complete social campaign',
      'Making-of documentary',
      'Awards submission package',
      'International distribution'
    ],
    timeline: '20-30 business days',
    included: {
      preProduction: ['Creative development', 'Full storyboarding', 'Celebrity casting', 'International logistics'],
      production: ['Multi-day filming', 'Hollywood crew', 'Premium equipment', 'Full catering service'],
      postProduction: ['Cinema-grade editing', 'Professional color grading', 'Original score', 'VFX integration']
    }
  }
];

const BookingForm: React.FC<{ selectedPackage?: ServicePackage }> = ({ selectedPackage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: selectedPackage?.id || '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Start Your Project
        </CardTitle>
        <p className="text-white/70">
          Tell us about your vision and we'll create something extraordinary together.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Company</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Service Package</label>
              <Select value={formData.projectType} onValueChange={(value) => setFormData({...formData, projectType: value})}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {servicePackages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Budget Range</label>
              <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-plus">$50,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Project Timeline</label>
            <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="When do you need this completed?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">ASAP</SelectItem>
                <SelectItem value="1-month">Within 1 month</SelectItem>
                <SelectItem value="2-months">Within 2 months</SelectItem>
                <SelectItem value="3-months">Within 3 months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Project Details</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="bg-white/5 border-white/20 text-white min-h-[120px]"
              placeholder="Tell us about your project, goals, and any specific requirements..."
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 py-3"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Consultation
          </Button>
        </form>

        <div className="border-t border-white/10 pt-6">
          <div className="text-center text-white/60 text-sm mb-4">
            Or contact us directly
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex items-center justify-center text-white/80">
              <Phone className="w-4 h-4 mr-2" />
              +1 (555) 123-4567
            </div>
            <div className="flex items-center justify-center text-white/80">
              <Mail className="w-4 h-4 mr-2" />
              hello@finessedigital.studio
            </div>
            <div className="flex items-center justify-center text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              Los Angeles, CA
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Services() {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | undefined>();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="min-h-screen pt-16">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text text-transparent mb-6">
              Production Services
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Professional video production packages designed to meet your unique needs and budget. 
              From concept to delivery, we handle everything.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${pkg.popular ? 'ring-2 ring-gold-500/50 bg-white/10' : 'bg-white/5'} border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group`}>
                  <CardHeader className="text-center pb-4">
                    <div className="text-gold-400 mb-4 flex justify-center">
                      {pkg.icon}
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{pkg.name}</CardTitle>
                    <p className="text-white/60 text-sm mb-4">{pkg.tagline}</p>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gold-400">{pkg.price}</div>
                      <div className="text-white/60 text-sm flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-white/70 text-center">{pkg.description}</p>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start text-white/80 text-sm">
                            <CheckCircle className="w-4 h-4 text-gold-400 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Add-ons Available:</h4>
                      <ul className="space-y-1">
                        {pkg.addOns.slice(0, 3).map((addon) => (
                          <li key={addon} className="text-white/60 text-sm">
                            + {addon}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowBooking(true);
                      }}
                      className={`w-full font-semibold ${
                        pkg.popular 
                          ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-600 hover:to-gold-700' 
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      } group-hover:scale-105 transition-transform duration-200`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Booking Form */}
          {showBooking && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <BookingForm selectedPackage={selectedPackage} />
            </motion.div>
          )}

          {!showBooking && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Button 
                onClick={() => setShowBooking(true)}
                size="lg"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold hover:from-gold-600 hover:to-gold-700 px-8 py-4"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
              <p className="text-white/60 text-sm mt-4">
                Not sure which package is right for you? Let's discuss your project.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}