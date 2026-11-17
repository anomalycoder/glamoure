import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Review } from '../../types/common';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star, MessageSquare, Flag, Trash2, Reply, Search, CheckCircle2, AlertTriangle } from 'lucide-react';

export const OwnerReviewsPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [reviews, setReviews] = useState<Review[]>(() => db.getReviewsBySalon(currentSalonId));
  const [staffList] = useState(() => db.getStaffBySalon(currentSalonId));
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Reply modal
  const [activeReplyReview, setActiveReplyReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const stats = db.getReviewsStats(currentSalonId);

  const refreshReviews = () => {
    setReviews(db.getReviewsBySalon(currentSalonId));
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyReview || !replyText.trim()) return;

    db.addReviewReply(activeReplyReview.id, replyText.trim());
    showToast('Proprietor response published to client review.', 'success');
    setActiveReplyReview(null);
    setReplyText('');
    refreshReviews();
  };

  const handleReport = (reviewId: string) => {
    const reason = prompt('Please specify reason for reporting this review to moderation:');
    if (reason && reason.trim()) {
      db.reportReview(reviewId, reason.trim());
      showToast('Review submitted to moderation committee.', 'info');
    }
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('Permanently remove this review from salon public record?')) {
      db.deleteReview(reviewId);
      showToast('Review deleted.', 'success');
      refreshReviews();
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesRating = ratingFilter === 'all' || Math.round(r.rating) === Number(ratingFilter);
    const matchesStaff = staffFilter === 'all' || r.staffId === staffFilter;
    const matchesSearch = searchTerm === '' || 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesStaff && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#2B2118] dark:text-[#f5eee6]">
            Client Reviews & Reputation
          </h1>
          <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-1">
            Verified feedback from completed appointments. Respond with high-touch hospitality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm">{stats.averageRating}</span>
            <span className="text-[11px] text-[#7A6658] dark:text-[#a89582]">/ 5.0 ({stats.totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Rating Card */}
        <Card className="p-5 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] flex flex-col justify-center items-center text-center shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Reputation Score</p>
          <p className="font-['Montserrat'] text-4xl text-[#2B2118] dark:text-[#efc9a5] font-light mt-2">{stats.averageRating}</p>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(stats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`}
              />
            ))}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">98% Verified Guest Satisfaction</p>
        </Card>

        {/* Rating Distribution */}
        <Card className="p-5 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] md:col-span-2 space-y-2 shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold mb-3">Star Distribution</p>
          {[5, 4, 3, 2, 1].map(stars => {
            const count = stats.distribution[stars] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#2B2118] dark:text-[#efc9a5] font-medium flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-transparent overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B99470] to-[#E8D8C7] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#7A6658] dark:text-[#a89582] font-mono">{count}</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Filters & Reviews Stream */}
      <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A6658] dark:text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 rounded-xl text-[#2B2118] dark:text-[#f5eee6] placeholder-[#7A6658] dark:placeholder-[#a89582] focus:outline-none focus:border-[#B99470]"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 rounded-xl text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>

          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#2a1a15] border border-[#E8DFD5] dark:border-white/10 rounded-xl text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
          >
            <option value="all">All Stylists & Specialists</option>
            {staffList.map(s => (
              <option key={s.id} value={s.id}>{s.displayName} ({s.title})</option>
            ))}
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pt-2">
          {filteredReviews.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-[#FAF8F5] dark:bg-white/[0.01] border border-dashed border-[#E8DFD5] dark:border-white/5">
              <MessageSquare className="w-8 h-8 text-[#7A6658] dark:text-[#a89582] mx-auto mb-2 opacity-40" />
              <p className="text-xs text-[#7A6658] dark:text-[#a89582]">No customer reviews match your filter parameters.</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div
                key={review.id}
                className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E8DFD5] dark:border-[#3a2820] hover:border-[#B99470] transition-all space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#41332b] text-[#2B2118] dark:text-[#efc9a5] font-semibold text-xs flex items-center justify-center border border-[#E8DFD5] dark:border-[#b99470]/30">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2B2118] dark:text-[#f5eee6]">{review.customerName}</h4>
                      <p className="text-[11px] text-[#7A6658] dark:text-[#a89582]">
                        Stylist: <span className="text-[#B99470] dark:text-[#efc9a5] font-medium">{review.staffName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7A6658] dark:text-[#a89582]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#2B2118] dark:text-[#c2b3a3] leading-relaxed pl-11">
                  "{review.comment}"
                </p>

                {/* Owner Reply if exists */}
                {review.reply && (
                  <div className="ml-11 p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#41332b]/40 border-l-2 border-[#B99470] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#B99470] dark:text-[#efc9a5]">
                      <Reply className="w-3 h-3 rotate-180" />
                      <span>Proprietor Response</span>
                    </div>
                    <p className="text-xs text-[#2B2118] dark:text-[#d8c3a8] italic">"{review.reply}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFD5] dark:border-white/5">
                  {!review.reply && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveReplyReview(review);
                        setReplyText('');
                      }}
                      className="text-[11px] px-2.5 py-1 flex items-center gap-1.5 border-[#E8DFD5] text-[#2B2118] dark:text-[#efc9a5] hover:bg-[#FAF8F5]"
                    >
                      <Reply className="w-3 h-3 text-[#B99470]" />
                      <span>Respond to Guest</span>
                    </Button>
                  )}

                  <button
                    onClick={() => handleReport(review.id)}
                    className="p-1.5 rounded-lg text-[#7A6658] hover:text-amber-600 dark:text-[#a89582] dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                    title="Report inappropriate review"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 rounded-lg text-[#7A6658] hover:text-rose-600 dark:text-[#a89582] dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Reply Modal */}
      {activeReplyReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5] dark:border-white/10">
              <h3 className="font-['Montserrat'] text-base text-[#2B2118] dark:text-[#f5eee6]">
                Respond to {activeReplyReview.customerName}
              </h3>
              <button
                onClick={() => setActiveReplyReview(null)}
                className="text-[#7A6658] dark:text-[#a89582] hover:text-[#2B2118] dark:hover:text-[#f5eee6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-transparent text-xs text-[#2B2118] dark:text-[#c2b3a3] italic">
              "{activeReplyReview.comment}"
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <div>
                <label className="block text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] font-bold mb-1">
                  Hospitality Response
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Thank you for gracing our sanctuary..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-xs text-[#2B2118] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveReplyReview(null)}
                  className="text-xs px-3 py-1.5 border-[#E8DFD5] text-[#2B2118]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-4 py-1.5 rounded-xl shadow-xs"
                >
                  Post Public Response
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
