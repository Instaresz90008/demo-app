import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Zap, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Professional Booking Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and share your professional services with ease. 
            Let clients book directly with you through beautiful, customizable booking pages.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Easy Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set your availability and let clients book appointments that work for both of you.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep track of your clients, their preferences, and booking history all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Instant Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get your professional booking page live in minutes with our guided setup process.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Trusted by Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "This platform transformed how I manage my consulting business. 
                  Clients love the seamless booking experience."
                </p>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Business Consultant</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Setup was incredibly easy. I had my booking page ready in under 10 minutes."
                </p>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-muted-foreground">Life Coach</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The professional appearance of my booking page has impressed all my clients."
                </p>
                <p className="font-semibold">Emily Rodriguez</p>
                <p className="text-sm text-muted-foreground">Design Consultant</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our platform for their booking needs.
          </p>
          <Button size="lg" className="text-lg px-8">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;