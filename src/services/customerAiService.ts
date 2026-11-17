import { db } from '../database/db';
import { AvailabilityService } from './availabilityService';
import type { Service } from '../types/salon';
import type { StaffProfile } from '../types/staff';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'book' | 'explore_service' | 'explore_stylist' | 'view_salon';
    label: string;
    payload: Record<string, any>;
  };
}

export class CustomerAiService {
  /**
   * Process customer prompt against actual database and availability
   */
  public static async askConcierge(prompt: string, customerId?: string): Promise<AiChatMessage> {
    const q = prompt.toLowerCase().trim();
    const salons = db.getAllSalons();
    const primarySalon = salons[0];
    const services = db.getAllServices();
    const categories = db.getAllCategories();
    const offers = db.getAllOffers();
    const allStaff = primarySalon ? db.getStaffBySalon(primarySalon.id) : [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // 1. Cancellation Policy Intent
    if (q.includes('cancellation') || q.includes('policy') || q.includes('cancel') || q.includes('reschedule policy')) {
      const noticeHours = primarySalon?.settings?.cancellationNoticeHours || 24;
      const depositPct = primarySalon?.settings?.depositPercentage || 20;
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `At Glamouré Atelier, appointments can be modified or cancelled with at least ${noticeHours} hours advance notice without penalty. Cancellations made within the ${noticeHours}-hour window may forfeit the ${depositPct}% deposit to respect our master artisans' scheduled bays. You can self-reschedule anytime through your Sanctuary Bookings portal.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // 2. Pricing & Offers Intent
    if (q.includes('offer') || q.includes('discount') || q.includes('promo') || q.includes('code')) {
      if (offers.length > 0) {
        const offerList = offers.map(o => `• **${o.code}**: ${o.title} (${o.discountPercent ? `${o.discountPercent}% privilege` : `$${o.discountAmount} off`})`).join('\n');
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Here are the active atelier privileges verified in our registry today:\n\n${offerList}\n\nYou can apply any of these codes directly during checkout.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            type: 'book',
            label: 'Reserve with Privilege',
            payload: { offerCode: offers[0].code },
          },
        };
      }
    }

    // 3. Compare Services Intent
    if (q.includes('compare') || (q.includes('difference between') && q.includes('and'))) {
      const matched = services.filter(s => q.includes(s.name.toLowerCase().split(' ')[0]));
      if (matched.length >= 2) {
        const [a, b] = matched;
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `Here is the architectural comparison between **${a.name}** and **${b.name}**:\n\n• **${a.name}**: ${a.durationMinutes} minutes • $${a.price}\n  *${a.description || 'Signature treatment'}*\n\n• **${b.name}**: ${b.durationMinutes} minutes • $${b.price}\n  *${b.description || 'Signature treatment'}*\n\nBoth rituals use botanical organic backbar infusions and include a personalized consultation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            type: 'book',
            label: `Reserve ${a.name}`,
            payload: { serviceId: a.id },
          },
        };
      }
    }

    // 4. Stylist Inquiries & Availability Intent
    if (q.includes('stylist') || q.includes('artisan') || q.includes('who') || q.includes('aria') || q.includes('julian') || q.includes('marcus') || q.includes('elena')) {
      const matchedStylist = allStaff.find(s => q.includes(s.displayName.toLowerCase().split(' ')[0]));
      if (matchedStylist) {
        const qualifiedServices = services.filter(srv => matchedStylist.servicesOffered.includes(srv.id));
        const serviceNames = qualifiedServices.map(s => s.name).join(', ');
        const slots = AvailabilityService.getAvailableSlots(matchedStylist.id, 60, tomorrowStr);
        const availableTimes = slots.filter(s => s.available).slice(0, 3).map(s => s.time).join(', ');

        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `**${matchedStylist.displayName}** is our ${matchedStylist.title} with a ${matchedStylist.rating.toFixed(2)}/5 rating (${matchedStylist.reviewCount} guest reviews). Specializes in: ${matchedStylist.specialties?.join(', ') || serviceNames}.\n\nTomorrow (${tomorrowStr}), ${matchedStylist.displayName} has available slots at: ${availableTimes || 'Fully committed (Waitlist available)'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: {
            type: 'book',
            label: `Book with ${matchedStylist.displayName}`,
            payload: { staffId: matchedStylist.id, date: tomorrowStr },
          },
        };
      }

      // General stylists list
      const staffList = allStaff.map(s => `• **${s.displayName}** (${s.title}) — ★ ${s.rating.toFixed(2)}`).join('\n');
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Our distinguished team of master artisans at ${primarySalon?.name || 'Glamouré Sanctuary'}:\n\n${staffList}\n\nWould you like me to check available slots for any specific artisan?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // 5. Specific Service Inquiry or Available Slot Search
    const matchingService = services.find(s => 
      q.includes(s.name.toLowerCase()) || 
      q.includes(s.name.toLowerCase().split(' ')[0]) ||
      q.includes(s.slug)
    );

    if (matchingService) {
      const qualified = AvailabilityService.getQualifiedStylists(primarySalon?.id || '', matchingService.id);
      const slots = AvailabilityService.getSlotsForAnyStylist(
        primarySalon?.id || '',
        matchingService.id,
        matchingService.durationMinutes,
        tomorrowStr
      );
      const openSlots = slots.filter(s => s.available).slice(0, 4).map(s => s.time).join(', ');

      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `**${matchingService.name}** is a ${matchingService.durationMinutes}-minute ritual priced at **$${matchingService.price}**.\n\n${matchingService.description || 'Includes scalp evaluation, organic botanical bath, and bespoke finishing.'}\n\nTomorrow (${tomorrowStr}), we have openings at: **${openSlots || 'Check date picker'}** with qualified artisans: ${qualified.map(q => q.displayName).join(', ')}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'book',
          label: `Book ${matchingService.name}`,
          payload: { serviceId: matchingService.id, date: tomorrowStr },
        },
      };
    }

    // 6. Hair/Skin Recommendation Intent
    if (q.includes('recommend') || q.includes('skin') || q.includes('hair') || q.includes('dry') || q.includes('facial') || q.includes('color')) {
      const recService = services.find(s => s.categoryName === 'Hair Artistry' || s.categoryName === 'Clinical Skin') || services[0];
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your request, I recommend the **${recService.name}** ($${recService.price}, ${recService.durationMinutes} mins). It focuses on deep cellular renewal and customized botanical glossing tailored to your texture and scalp condition.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'book',
          label: `Schedule Consultation & Ritual`,
          payload: { serviceId: recService.id },
        },
      };
    }

    // 7. General Fallback
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `Welcome to the Glamouré Sanctuary Concierge. I have live access to our master artisans' floor availability, ritual catalog, and cancellation policies. You can ask me:\n\n• "What is the duration and price of Balayage?"\n• "Do you have slots with Aria tomorrow?"\n• "Compare Japanese Head Spa and Bespoke Facial"\n• "What is your cancellation window?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  public static async handleUserQuery(query: string, context?: any) {
    const res = await this.askConcierge(query, context?.customerId);
    return {
      message: res.text,
      suggestedActions: res.suggestedAction ? [{
        type: 'book_service',
        label: res.suggestedAction.label,
        data: res.suggestedAction.payload,
      }] : [],
    };
  }
}

export const customerAiService = CustomerAiService;
