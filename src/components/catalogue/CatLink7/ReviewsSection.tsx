
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface ReviewsSectionProps {
  // We can add props like actual reviews data if needed later
}

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">5.0</span>
          <div className="flex ml-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Based on 24 reviews</p>
      </div>
      
      <Separator />
      
      {/* Sample Reviews */}
      <div className="space-y-5">
        {[
          { name: "Sarah J.", date: "3 weeks ago", text: "Excellent service! Very professional and attentive to details." },
          { name: "Michael R.", date: "1 month ago", text: "Highly recommend! The consultation was very informative and helpful." }
        ].map((review, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.text}</p>
            {idx !== 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
