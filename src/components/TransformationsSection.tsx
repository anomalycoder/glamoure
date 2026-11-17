import React from 'react';
import { MomentsSection } from './MomentsSection';

interface TransformationsSectionProps {
  onOpenBookingFor?: (cat: 'hair' | 'skin' | 'nails' | 'spa') => void;
  onOpenGallery?: () => void;
}

export const TransformationsSection: React.FC<TransformationsSectionProps> = ({
  onOpenBookingFor,
}) => {
  return <MomentsSection onOpenBookingFor={onOpenBookingFor} />;
};

export default TransformationsSection;
