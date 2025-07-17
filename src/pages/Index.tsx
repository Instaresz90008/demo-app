
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to JusBook Platform
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your services, bookings, and templates with global PPP pricing
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={() => navigate('/smart-templates')}>
            Smart Templates Generator
          </Button>
          <Button variant="outline" onClick={() => navigate('/smart-service')}>
            Smart Service Creator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
