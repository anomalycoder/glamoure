import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5EFE7] flex items-center justify-center p-6 selection:bg-[#B99470]/30 selection:text-[#41332B]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#E8D8C7] flex items-center justify-center mx-auto text-[#41332B]">
          <Sparkles className="w-8 h-8 text-[#B99470]" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">404 Exception</span>
          <h1 className="font-serif text-4xl text-[#41332B] font-light">Ritual Not Found</h1>
          <p className="font-sans text-sm text-[#806B5C] leading-relaxed">
            The atelier page or reservation corridor you are seeking has been moved or does not exist in our registry.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Sanctuary
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">
              Atelier Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
