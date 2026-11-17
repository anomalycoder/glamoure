/**
 * Customer AI Booking Assistant / Concierge
 * Provides conversational guidance for salon clients, recommending rituals,
 * checking artisan availability, and answering questions about services.
 */

import { db } from '../../database/db';
import { SmartScheduler } from '../scheduling/smartScheduler';

export interface CustomerAiResponse {
  answer: string;
  recommendedServiceIds: string[];
  suggestedSlots?: string[];
  suggestedStaffName?: string;
  actionCta?: { label: string; url: string };
}

export class CustomerAiAssistant {
  public static ask(salonId: string, message: string, customerId?: string): CustomerAiResponse {
    const text = message.toLowerCase();
    const services = db.getServicesBySalon(salonId);
    const staff = db.getStaffBySalon(salonId);

    // 1. Hair Coloring / Balayage
    if (text.includes('color') || text.includes('colour') || text.includes('balayage') || text.includes('blonde') || text.includes('highlight')) {
      const colorServices = services.filter(s => 
        s.name.toLowerCase().includes('balayage') || 
        s.name.toLowerCase().includes('color') || 
        s.name.toLowerCase().includes('tint')
      );
      const topService = colorServices[0] || services[0];
      const stylist = staff.find(s => s.displayName.includes('Aria') || s.displayName.includes('Marcus')) || staff[0];

      return {
        answer: `For bespoke multidimensional tones, our master colorists recommend our Signature French Balayage & Gloss Finish. Crafted with organic conditioning bond-builders to maintain luminous hair integrity.`,
        recommendedServiceIds: colorServices.map(s => s.id),
        suggestedStaffName: stylist?.displayName,
        suggestedSlots: ['Tomorrow, 11:15 AM', 'Tomorrow, 3:30 PM'],
        actionCta: {
          label: `Book ${topService?.name || 'Balayage'}`,
          url: `/customer/book?salonId=${salonId}&serviceId=${topService?.id}`,
        },
      };
    }

    // 2. Haircut / Styling
    if (text.includes('cut') || text.includes('trim') || text.includes('style') || text.includes('blowout') || text.includes('haircut')) {
      const cutServices = services.filter(s => 
        s.name.toLowerCase().includes('cut') || 
        s.name.toLowerCase().includes('style') || 
        s.name.toLowerCase().includes('blowout')
      );
      const topService = cutServices[0] || services[0];

      return {
        answer: `Our precision haircuts include a personalized facial structure consultation, clarifying scalp cleanse, bespoke texturizing cut, and signature editorial blowout.`,
        recommendedServiceIds: cutServices.map(s => s.id),
        suggestedStaffName: 'Marcus Vance',
        suggestedSlots: ['Tomorrow, 10:30 AM', 'Tomorrow, 2:00 PM'],
        actionCta: {
          label: `Book ${topService?.name || 'Haircut'}`,
          url: `/customer/book?salonId=${salonId}&serviceId=${topService?.id}`,
        },
      };
    }

    // 3. Treatment / Spa / Damage / Dry Hair
    if (text.includes('dry') || text.includes('damage') || text.includes('frizz') || text.includes('spa') || text.includes('treatment') || text.includes('botox')) {
      const treatments = services.filter(s => 
        s.name.toLowerCase().includes('ritual') || 
        s.name.toLowerCase().includes('spa') || 
        s.name.toLowerCase().includes('treatment')
      );
      const topService = treatments[0] || services[0];

      return {
        answer: `For deep hydration and cuticle repair, we recommend our Botanical Caviar Scalp & Hair Ritual. Infused with cold-pressed botanical lipids to immediately restore mirror-like shine and suppleness.`,
        recommendedServiceIds: treatments.map(s => s.id),
        suggestedStaffName: 'Chloe Bennett',
        suggestedSlots: ['Tomorrow, 1:00 PM', 'Tomorrow, 4:45 PM'],
        actionCta: {
          label: `Reserve Treatment`,
          url: `/customer/book?salonId=${salonId}&serviceId=${topService?.id}`,
        },
      };
    }

    // Default Guidance
    const defaultService = services[0];
    return {
      answer: `Welcome to Glamouré. Our sanctuary offers bespoke hair artistry, couture coloring, rejuvenating scalp rituals, and aesthetic treatments. How may I assist your booking today?`,
      recommendedServiceIds: services.slice(0, 3).map(s => s.id),
      suggestedSlots: ['Tomorrow, 11:15 AM', 'Tomorrow, 2:30 PM'],
      actionCta: defaultService ? {
        label: 'Explore Catalogue',
        url: `/customer/services?salonId=${salonId}`,
      } : undefined,
    };
  }
}
