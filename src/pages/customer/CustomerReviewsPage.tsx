import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star, MessageSquare, CheckCircle2, Clock, Scissors, User, Building2 } from 'lucide-react';

export const CustomerReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [searchParams] = useSearchParams();

  const userAppointments = user ? db.getAppointmentsByCustomer(user.id) : [];
  const completedAppointments = userAppointments.filter(a => a.status === 'completed');
  const allReviews = user ? db.getReviewsByCustomer(user.id) : [];

  // Determine unreviewed completed appointments
  const unreviewedAppointments = completedAppointments.filter(
    a => !allReviews.some(r => r.appointmentId === a.id)
  );

  const preselectedAptId = searchParams.get('appointmentId') || unreviewedAppointments[0]?.id || '';
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(preselectedAptId);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [serviceFeedback, setServiceFeedback] = useState('Exceeded expectations; hair feels luminous.');
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedApt = completedAppointments.find(a => a.id === selectedAppointmentId);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedApt) {
      addToast('Please select an eligible completed appointment to review.', 'error');
      return;
    }

    const check = db.canReviewAppointment(selectedApt.id, user.id);
    if (!check.eligible) {
      addToast(check.reason || 'You are not eligible to review this appointment.', 'error');
      return;
    }

    try {
      db.createReview({
        id: `rev-${Date.now()}`,
        salonId: selectedApt.salonId,
        appointmentId: selectedApt.id,
        customerId: user.id,
        customerName: user.fullName,
        staffId: selectedApt.staffId,
        staffName: selectedApt.staffName,
        rating,
        comment: `${comment.trim()} • Service feedback: ${serviceFeedback}`,
        createdAt: new Date().toISOString(),
      });

      setComment('');
      addToast('Review published to atelier registry! Thank you.', 'success');
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      addToast(err.message || 'Failed to submit review', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="border-b border-[#E8D8C7]/60 pb-6">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
          Guest Feedback &amp; Ratings
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
          Artisan Reviews &amp; Testimonials
        </h1>
        <p className="font-sans text-sm text-[#806B5C] mt-2 max-w-2xl">
          Share your experience with our master artisans. In accordance with Glamouré standards, only verified completed appointments are eligible for review submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─────────────────────────────────────────────────────────────
            FORM: SUBMIT REVIEW FOR COMPLETED APPOINTMENT (5 cols)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-xl text-[#41332B]">Submit Guest Feedback</h2>

            {unreviewedAppointments.length === 0 ? (
              <div className="p-6 text-center bg-[#F5EFE7]/50 rounded-xl border border-dashed border-[#E8D8C7] space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-serif text-base text-[#41332B]">All Completed Visits Reviewed</p>
                <p className="text-xs text-[#806B5C]">
                  You have reviewed all eligible past sanctuary visits. New completed appointments will appear here automatically.
                </p>
                <Link to="/customer/book">
                  <Button variant="primary" size="sm">Book Next Ritual</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCreateReview} className="space-y-4">
                {/* Select Appointment */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#806B5C]">Eligible Completed Ritual:</label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470]"
                  >
                    {unreviewedAppointments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.serviceName} with {a.staffName} ({a.appointmentDate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#806B5C]">Your Star Rating:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-medium text-[#41332B] ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Service Feedback */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#806B5C]">Service &amp; Atmosphere Quality:</label>
                  <input
                    type="text"
                    value={serviceFeedback}
                    onChange={(e) => setServiceFeedback(e.target.value)}
                    placeholder="e.g. Flawless glossing, soothing aroma scalp wash..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E8D8C7] rounded-xl text-xs text-[#41332B]"
                  />
                </div>

                {/* Written Comment */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#806B5C]">Detailed Testimonial:</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your consultation with the artisan, technical finish, and overall sanctuary ambiance..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470] resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full rounded-full shadow-xs">
                  Publish Verified Review
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            LIST: MY SUBMITTED REVIEWS (7 cols)
        ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8D8C7]/60">
            <h2 className="font-serif text-xl text-[#41332B]">My Published Reviews ({allReviews.length})</h2>
            <span className="text-xs font-mono text-[#806B5C]">Permanent Atelier Dossier</span>
          </div>

          {allReviews.length === 0 ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-dashed border-[#E8D8C7] text-xs text-[#806B5C]">
              You have not published any reviews yet. Complete a sanctuary visit to leave feedback for our master artisans.
            </div>
          ) : (
            allReviews.map(rev => (
              <div key={rev.id} className="bg-white/90 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-semibold text-[#41332B] ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#806B5C]">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#41332B] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-[#E8D8C7]/60 flex items-center justify-between text-xs text-[#806B5C]">
                  <span>Artisan: <strong className="text-[#41332B]">{rev.staffName}</strong></span>
                  <span className="text-[10px] font-mono uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Guest Booking
                  </span>
                </div>

                {rev.reply && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#F5EFE7]/70 border border-[#E8D8C7] text-xs space-y-1">
                    <span className="font-serif font-medium text-[#41332B] block">
                      Atelier Director Response:
                    </span>
                    <p className="text-[#806B5C] italic leading-relaxed">{rev.reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
