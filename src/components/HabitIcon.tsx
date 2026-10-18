import React from 'react';
import {
  Droplet,
  BookOpen,
  Dumbbell,
  Moon,
  Apple,
  Footprints,
  Brain,
  Heart,
  Flame,
  CheckCircle2,
  Coffee,
  Sparkles,
  LucideProps,
} from 'lucide-react';

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Droplet':
      return <Droplet {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Dumbbell':
      return <Dumbbell {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'Apple':
      return <Apple {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Brain':
      return <Brain {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'CheckCircle2':
    default:
      return <CheckCircle2 {...props} />;
  }
};
