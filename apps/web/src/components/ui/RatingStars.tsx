import React from 'react';

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  showNumeric = true,
  className = '',
}) => {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className="flex text-amber-400 text-sm">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starNum = index + 1;
          const isFilled = starNum <= Math.floor(rating);
          const isHalf = !isFilled && starNum - 0.5 <= rating;

          return (
            <span key={index}>
              {isFilled ? '★' : isHalf ? '½' : '☆'}
            </span>
          );
        })}
      </div>
      {showNumeric && (
        <span className="text-xs font-semibold text-gray-500 ml-1">
          {roundedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
