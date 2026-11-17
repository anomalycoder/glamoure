import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MetricCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Brain, Zap, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { IntelligenceApi } from '../../intelligence/api/intelligenceApi';
import { db } from '../../database/db';

export const OwnerAiSchedulingPage: React.FC = () => {
  const { currentSalonId } = useAuth();
  const { showToast } = useNotification();
  const salonId = currentSalonId || 'salon-glamoure-jubilee';
  const [isOptimizing, setIsOptimizing] = useState(false);

  const services = useMemo(() => db.getServicesBySalon(salonId), [salonId]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-18');

  // Compute live smart slots
  const smartSchedule = useMemo(() => {
    if (!selectedServiceId) return null;
    return IntelligenceApi.getSmartSlots({
      salonId,
      serviceId: selectedServiceId,
      date: selectedDate,
    });
  }, [salonId, selectedServiceId, selectedDate, isOptimizing]);

  const handleApplyRecommendation = (title: string) => {
    showToast('AI Recommendation Applied', `"${title}" activated in booking engine`, 'success');
  };

  const handleRunFullOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      showToast('Optimization Complete', 'AI Yield Engine recalculated atelier schedules and optimized 6 gap slots.', 'success');
    }, 1200);
  };

  const smartRecommendations = [
    {
      id: 'rec-1',
      title: 'Fill Tuesday Midday Gap (11:15 AM - 12:45 PM)',
      target: 'Aria Chen (Balayage Station 2)',
      impact: '+$340 potential revenue',
      confidence: '96% confidence',
      actionText: 'Publish AI Recommended Slot',
      description: 'Historically low foot-traffic window identified. Suggest deploying "Midweek Glow Ritual" with automated 10% booking incentive to VIP waitlist.',
    },
    {
      id: 'rec-2',
      title: 'Automated 6-Week Touch-Up Invitations',
      target: '14 High-Value Regulars',
      impact: '+$2,800 anticipated bookings',
      confidence: '91% confidence',
      actionText: 'Send Concierge Prompts',
      description: 'Identified 14 guests whose hair color or skin cycle hits 42 days next week. Ready to dispatch personalized concierge rebooking prompts.',
    },
    {
      id: 'rec-3',
      title: 'Buffer Time Optimization for Julian Silva',
      target: 'Saturday Afternoon Peak',
      impact: '+1 Available Slot per weekend',
      confidence: '88% confidence',
      actionText: 'Apply Smart Buffer Adjustments',
      description: 'Julian averages 42 minutes on haircut rituals (configured for 60 min). Trimming buffer by 15 mins unlocks an additional prime weekend booking slot.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] dark:text-[#a89582] font-semibold">
              Yield &amp; Demand Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B99470]/20 text-[#41332B] dark:text-[#efc9a5] font-semibold border border-[#B99470]/40">
              <Sparkles className="w-2.5 h-2.5 text-[#B99470]" /> AI ACTIVE
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#41332B] dark:text-[#f5eee6] font-light mt-1">
            AI-Powered Schedule &amp; Yield Optimization
          </h1>
          <p className="font-sans text-sm text-[#806B5C] dark:text-[#a89582] mt-2">
            Predictive chair occupancy, idle gap monetization, and automated algorithmic slot recommendations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleRunFullOptimization}
            disabled={isOptimizing}
          >
            <Brain className="w-3.5 h-3.5 mr-2" />
            {isOptimizing ? 'Analyzing Patterns...' : 'Recalculate AI Schedule'}
          </Button>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Predictive Bay Occupancy"
          value="94.2%"
          change={{ value: "+8.3% projected with AI slots", isPositive: true }}
          icon={<TrendingUp className="w-5 h-5 text-[#B99470]" />}
        />
        <MetricCard
          title="Violations Avoided"
          value={`${smartSchedule?.constraintViolationsAvoided ?? 4} avoided`}
          subtitle="Hard constraint protection active"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          title="Projected Yield Uplift"
          value="+$3,850"
          subtitle="Estimated additional monthly GMV"
          icon={<Zap className="w-5 h-5 text-[#B99470]" />}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LIVE SMART SCHEDULING EVALUATOR (3-TIER ENGINE)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#201511] rounded-2xl border border-[#E8D8C7] dark:border-[#38271e] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B99470]" />
              <h2 className="font-serif text-xl text-[#41332B] dark:text-[#f5eee6]">
                Live Smart Slot Simulator (3-Tier Engine)
              </h2>
            </div>
            <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-1">
              Tests Tier 1 (Hard Constraints), Tier 2 (Workload Balancing), and Tier 3 (Learned Ranking).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#E8D8C7] dark:border-[#4a3429] bg-[#FAF6F0] dark:bg-[#2a1a15] text-[#41332B] dark:text-[#f5eee6] font-medium focus:outline-none"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes}m)</option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-[#E8D8C7] dark:border-[#4a3429] bg-[#FAF6F0] dark:bg-[#2a1a15] text-[#41332B] dark:text-[#f5eee6] font-medium focus:outline-none"
            />
          </div>
        </div>

        {smartSchedule && (
          <div className="space-y-4">
            {smartSchedule.primaryRecommendation ? (
              <div className="bg-[#FAF6F0] dark:bg-[#2a1a15] rounded-2xl border border-[#B99470]/60 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#41332B] text-[#F5EFE7] text-[10px] font-mono uppercase font-semibold">
                      ★ AI Optimal Recommendation
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                      Score: {smartSchedule.primaryRecommendation.overallScore}/100
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#806B5C] dark:text-[#a89582]">
                    Zero Wait Guaranteed (0-5 mins)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[#41332B] dark:text-[#f5eee6]">
                  <div>
                    <span className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] block">Recommended Window</span>
                    <span className="font-serif font-medium text-base">
                      {smartSchedule.primaryRecommendation.startTime} – {smartSchedule.primaryRecommendation.endTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] block">Master Stylist</span>
                    <span className="font-serif font-medium text-base">
                      {smartSchedule.primaryRecommendation.staffName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#806B5C] dark:text-[#a89582] block">Service</span>
                    <span className="font-serif font-medium text-base">
                      {smartSchedule.primaryRecommendation.serviceName}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5c473b] dark:text-[#c2b3a3] font-sans leading-relaxed pt-1 border-t border-[#E8D8C7]/60 dark:border-[#38271e]">
                  {smartSchedule.primaryRecommendation.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#806B5C] dark:text-[#a89582] italic">No available slots meeting all hard constraints for this date.</p>
            )}

            {/* Alternative Slots */}
            {smartSchedule.alternativeSlots.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#806B5C] dark:text-[#a89582]">Alternative Ranked Slots</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {smartSchedule.alternativeSlots.map((slot, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-[#E8D8C7] dark:border-[#38271e] bg-white dark:bg-[#201511] text-xs space-y-1 hover:border-[#B99470] transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-semibold text-[#41332B] dark:text-[#f5eee6]">{slot.startTime}</span>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                          {slot.overallScore} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-[#806B5C] dark:text-[#a89582] truncate">{slot.staffName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommended Algorithmic Actions */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl text-[#41332B] dark:text-[#f5eee6]">Algorithmic Yield Recommendations</h2>
        <div className="space-y-4">
          {smartRecommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="bg-white dark:bg-[#201511] rounded-2xl border border-[#E8D8C7] dark:border-[#38271e] p-6 shadow-sm hover:border-[#B99470] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/60 dark:border-[#38271e]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#B99470]"></span>
                    <h3 className="font-serif text-lg font-medium text-[#41332B] dark:text-[#f5eee6]">{rec.title}</h3>
                  </div>
                  <p className="text-xs text-[#806B5C] dark:text-[#a89582]">Target: <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{rec.target}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                    {rec.impact}
                  </span>
                  <span className="text-[11px] font-mono text-[#806B5C] dark:text-[#a89582] bg-[#F5EFE7] dark:bg-[#2a1a15] px-2 py-1 rounded-full">
                    {rec.confidence}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#806B5C] dark:text-[#a89582] my-4 leading-relaxed font-sans">
                {rec.description}
              </p>

              <div className="flex justify-end pt-2">
                <Button 
                  size="sm" 
                  variant="primary" 
                  onClick={() => handleApplyRecommendation(rec.title)}
                  className="text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  {rec.actionText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
