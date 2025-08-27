import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  inStock: boolean;
  badge?: string;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  discount,
  inStock,
  badge
}: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-border/50">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount && (
              <Badge className="bg-accent text-accent-foreground font-semibold">
                -{discount}%
              </Badge>
            )}
            {badge && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {badge}
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-muted-foreground hover:text-accent transition-colors"
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Stock indicator */}
          {!inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({reviews})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button 
            className="w-full bg-gradient-warm hover:shadow-glow transition-all duration-300" 
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {inStock ? 'Add to Cart' : 'Notify When Available'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;