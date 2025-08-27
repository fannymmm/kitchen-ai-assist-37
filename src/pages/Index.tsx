import { Star, Truck, Shield, Clock, ChefHat, Utensils, CookingPot, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Chatbot from '@/components/Chatbot';

// Import images
import heroImage from '@/assets/hero-kitchen.jpg';
import productKnives from '@/assets/product-knives.jpg';
import productPots from '@/assets/product-pots.jpg';
import productBoards from '@/assets/product-boards.jpg';
import productUtensils from '@/assets/product-utensils.jpg';

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Professional Chef Knife Set",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.8,
      reviews: 324,
      image: productKnives,
      discount: 25,
      inStock: true,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Copper Cookware Collection",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.9,
      reviews: 186,
      image: productPots,
      discount: 25,
      inStock: true,
    },
    {
      id: 3,
      name: "Bamboo Cutting Board Set",
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.7,
      reviews: 142,
      image: productBoards,
      discount: 23,
      inStock: false,
    },
    {
      id: 4,
      name: "Silicone Utensil Collection",
      price: 29.99,
      rating: 4.6,
      reviews: 98,
      image: productUtensils,
      inStock: true,
      badge: "New"
    }
  ];

  const categories = [
    { name: "Knives & Cutlery", icon: ChefHat, count: 45 },
    { name: "Cookware", icon: CookingPot, count: 78 },
    { name: "Utensils", icon: Utensils, count: 92 },
    { name: "Accessories", icon: Coffee, count: 34 }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing quality! The knife set has transformed my cooking experience. Sharp, durable, and beautiful.",
      location: "New York, NY"
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "Fast shipping and excellent customer service. The copper pots are even better than expected!",
      location: "Seattle, WA"
    },
    {
      name: "Emma Rodriguez",
      rating: 5,
      text: "Love the bamboo cutting boards! Sustainable and perfect for my kitchen aesthetic.",
      location: "Austin, TX"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Premium Kitchen Utensils" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Elevate Your
              <span className="text-warm-orange-light block">Culinary Journey</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover premium kitchen utensils crafted for passionate cooks. From professional-grade knives to elegant cookware.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-warm hover:shadow-glow transition-all duration-300 text-lg px-8">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-forest-green text-lg px-8">
                View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-cream/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Free Shipping</h3>
                <p className="text-muted-foreground text-sm">On orders over $75</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quality Guarantee</h3>
                <p className="text-muted-foreground text-sm">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">2-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked premium kitchen essentials with special discounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">Find exactly what your kitchen needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={category.name} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-card">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.count} products</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <Badge className="bg-accent text-accent-foreground mb-4 text-lg px-4 py-2">
              Limited Time Offer
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Get 30% Off Your First Order</h2>
            <p className="text-xl mb-8 text-gray-100">
              Join thousands of happy customers and transform your cooking experience
            </p>
            <Button size="lg" className="bg-gradient-warm hover:shadow-glow text-lg px-8">
              Claim Your Discount
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">Real reviews from real customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="group hover:shadow-card transition-all duration-300 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-cream/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-card shadow-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest deals and kitchen tips delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none bg-background"
                />
                <Button className="bg-gradient-warm hover:shadow-soft px-8">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-green text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">K</span>
                </div>
                <h3 className="text-xl font-bold">KitchenCraft</h3>
              </div>
              <p className="text-gray-300">
                Premium kitchen utensils for passionate cooks worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Knives</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Cookware</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Utensils</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Accessories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Size Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-warm-orange-light transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sage-green/30 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 KitchenCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;