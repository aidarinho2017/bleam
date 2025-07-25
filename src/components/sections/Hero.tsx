import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Create Your Own{' '}
              <span className="text-gradient">AI Bot</span> for{' '}
              <span className="text-gradient">Telegram & WhatsApp</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Automate customer conversations, boost sales, and stay available 24/7 
              with intelligent chatbots that convert visitors into customers
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/register">
                <Button className="btn-primary text-lg px-8 py-4 glow-effect">
                  Create Your Bot Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button variant="outline" className="btn-secondary text-lg px-8 py-4">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground mb-2">
                Join 10,000+ businesses automating their customer support
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-pulse-slow" 
                       style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-float">
            <div className="relative rounded-2xl overflow-hidden glow-effect">
              <img 
                src={heroImage} 
                alt="AI Bot Interface" 
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 animate-pulse-slow">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-medium">AI Online</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 animate-pulse-slow" 
                   style={{ animationDelay: '1s' }}>
                <div className="text-xs font-medium">24/7 Active</div>
              </div>
            </div>

            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-radial rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;