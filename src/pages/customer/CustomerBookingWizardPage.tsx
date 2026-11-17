import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../database/db';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AppointmentService } from '../../services/appointmentService';
import { AvailabilityService } from '../../services/availabilityService';
import { PaymentService } from '../../services/paymentService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { 
  Building2, 
  MapPin, 
  Scissors, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Check,
  AlertCircle,
  Receipt
} from 'lucide-react';

export const CustomerBookingWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const allSalons = db.getAllSalons();
  const allServices = db.getAllServices();
  const allCategories = db.getAllCategories();

  // Wizard Step (1: Atelier & Ritual, 2: Stylist & Schedule, 3: Review & Payment, 4: Confirmed)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedSalonId, setSelectedSalonId] = useState<string>(searchParams.get('salonId') || allSalons[0]?.id || '');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(searchParams.get('serviceId') || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(searchParams.get('staffId') || 'any');
  
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('date') || tomorrowStr);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Offer & Payment
  const [offerCodeInput, setOfferCodeInput] = useState<string>(searchParams.get('offerCode') || '');
  const [appliedOfferCode, setAppliedOfferCode] = useState<string>(searchParams.get('offerCode') || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'pay_at_salon'>('card');
  const [guestNotes, setGuestNotes] = useState<string>('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);

  // Selected entities
  const selectedSalon = db.getSalonById(selectedSalonId);
  const salonBranches = selectedSalonId ? db.getBranchesBySalon(selectedSalonId) : [];
  const selectedService = selectedServiceId ? db.getServiceById(selectedServiceId) : null;
  const qualifiedStaff = (selectedSalonId && selectedServiceId)
    ? AvailabilityService.getQualifiedStylists(selectedSalonId, selectedServiceId)
    : (selectedSalonId ? db.getStaffBySalon(selectedSalonId) : []);

  // Initialize main branch
  useEffect(() => {
    if (salonBranches.length > 0 && !selectedBranchId) {
      const main = salonBranches.find(b => b.isMainBranch) || salonBranches[0];
      setSelectedBranchId(main.id);
    }
  }, [salonBranches, selectedBranchId]);

  // Recalculate Available Slots when service, stylist, or date changes
  useEffect(() => {
    if (!selectedSalonId || !selectedService || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    if (selectedStaffId === 'any') {
      const multiSlots = AvailabilityService.getSlotsForAnyStylist(
        selectedSalonId,
        selectedService.id,
        selectedService.durationMinutes,
        selectedDate
      );
      setAvailableSlots(multiSlots);
    } else {
      const singleSlots = AvailabilityService.getAvailableSlots(
        selectedStaffId,
        selectedService.durationMinutes,
        selectedDate
      );
      setAvailableSlots(singleSlots);
    }
  }, [selectedSalonId, selectedServiceId, selectedStaffId, selectedDate]);

  // Price calculation
  const pricing = PaymentService.calculatePricing(
    selectedService?.price || 0,
    appliedOfferCode,
    selectedSalonId
  );

  const handleApplyOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCodeInput.trim()) return;
    const calc = PaymentService.calculatePricing(selectedService?.price || 0, offerCodeInput, selectedSalonId);
    if (calc.appliedOffer) {
      setAppliedOfferCode(offerCodeInput.trim().toUpperCase());
      addToast(`Privilege offer ${calc.appliedOffer.code} applied successfully!`, 'success');
    } else {
      addToast('Invalid or expired privilege voucher code.', 'error');
    }
  };

  const handleProceedToStep2 = () => {
    if (!selectedService) {
      addToast('Please select a sanctuary ritual to continue.', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    if (!selectedTime) {
      addToast('Please choose an available appointment slot time.', 'error');
      return;
    }

    // Preserve authentication check
    if (!user) {
      // Preserve booking params in session/URL
      addToast('Please sign in or create an account to finalize your reservation.', 'info');
      const params = new URLSearchParams({
        redirect: '/customer/book',
        salonId: selectedSalonId,
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        date: selectedDate,
      });
      navigate(`/login?${params.toString()}`);
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReservation = async () => {
    if (!user || !selectedService || !selectedSalon) return;

    setIsSubmitting(true);
    try {
      // 1. Initiate Payment Session
      const paymentInit = PaymentService.initiatePayment({
        appointmentId: `temp-${Date.now()}`,
        amount: pricing.totalAmount,
        method: paymentMethod,
      });

      // 2. Commit Appointment to Shared Backend Engine with re-validation
      const appointment = AppointmentService.bookAppointment({
        salonId: selectedSalonId,
        branchId: selectedBranchId || salonBranches[0]?.id,
        customerId: user.id,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        staffId: selectedStaffId,
        staffName: selectedStaffId === 'any' ? 'First Available Master Artisan' : (db.getStaffById(selectedStaffId)?.displayName || 'Artisan'),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        durationMinutes: selectedService.durationMinutes,
        price: pricing.totalAmount,
        depositAmount: selectedSalon.settings.requireDeposit ? Math.round(pricing.totalAmount * (selectedSalon.settings.depositPercentage / 100)) : 0,
        notes: guestNotes,
        bookedBy: user,
      });

      // 3. Complete and verify payment
      PaymentService.verifyAndProcessPayment({
        salonId: selectedSalonId,
        appointmentId: appointment.id,
        customerId: user.id,
        amount: pricing.totalAmount,
        method: paymentMethod,
        verificationToken: paymentInit.verificationToken,
        user,
        notes: `Reservation confirmed for ${selectedService.name}`,
      });

      setConfirmedBooking(appointment);
      setCurrentStep(4);
      addToast('Sanctuary reservation confirmed! Receipt issued.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      addToast(err.message || 'Booking commitment failed. The slot may have just been reserved.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      {/* ─────────────────────────────────────────────────────────────
          WIZARD PROGRESS INDICATOR
      ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E8D8C7]/80 pb-6">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#806B5C] font-semibold">
          Step {currentStep} of 4
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light mt-1">
          {currentStep === 1 && 'Select Sanctuary Atelier & Ritual'}
          {currentStep === 2 && 'Artisan & Schedule Selection'}
          {currentStep === 3 && 'Review, Privilege Code & Payment'}
          {currentStep === 4 && 'Reservation Confirmed'}
        </h1>

        {/* Progress track */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= currentStep ? 'bg-[#B99470]' : 'bg-[#E8D8C7]/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: ATELIER, BRANCH & SERVICE
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="space-y-8">
          {/* Atelier Selection */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8D8C7]/60">
              <Building2 className="w-5 h-5 text-[#B99470]" />
              <h2 className="font-serif text-xl text-[#41332B]">Select Atelier Location</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allSalons.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSalonId(s.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedSalonId === s.id
                      ? 'border-[#B99470] bg-[#F5EFE7] shadow-xs'
                      : 'border-[#E8D8C7] bg-white hover:border-[#B99470]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-medium text-[#41332B]">{s.name}</h3>
                      {selectedSalonId === s.id && <Check className="w-4 h-4 text-[#B99470]" />}
                    </div>
                    <p className="text-xs text-[#806B5C] mt-1">{s.address}, {s.city}</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 mt-2 block">
                    ★ 4.98 Verified Rating
                  </span>
                </div>
              ))}
            </div>

            {/* Branch selector if multiple branches */}
            {salonBranches.length > 1 && (
              <div className="pt-3 border-t border-[#E8D8C7]/60 space-y-2">
                <label className="text-xs font-mono uppercase text-[#806B5C]">Select Suite / Branch:</label>
                <div className="flex flex-wrap gap-2">
                  {salonBranches.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                        selectedBranchId === b.id
                          ? 'border-[#B99470] bg-[#41332B] text-white'
                          : 'border-[#E8D8C7] bg-[#F5EFE7] text-[#41332B]'
                      }`}
                    >
                      {b.name} ({b.city})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Service Discipline Tabs & List */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D8C7]/60">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#B99470]" />
                <h2 className="font-serif text-xl text-[#41332B]">Select Sanctuary Ritual</h2>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategoryId('all')}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                    selectedCategoryId === 'all'
                      ? 'bg-[#41332B] text-white font-medium'
                      : 'bg-[#F5EFE7] text-[#806B5C] hover:bg-[#E8D8C7]'
                  }`}
                >
                  All
                </button>
                {allCategories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryId(c.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      selectedCategoryId === c.id
                        ? 'bg-[#41332B] text-white font-medium'
                        : 'bg-[#F5EFE7] text-[#806B5C] hover:bg-[#E8D8C7]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {allServices
                .filter(s => (selectedSalonId ? s.salonId === selectedSalonId : true))
                .filter(s => (selectedCategoryId === 'all' ? true : s.categoryId === selectedCategoryId))
                .map(srv => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#B99470] bg-[#F5EFE7] shadow-xs'
                          : 'border-[#E8D8C7] bg-white hover:border-[#B99470]/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-medium text-[#41332B]">{srv.name}</span>
                          <span className="text-[10px] font-mono text-[#806B5C] bg-white px-2 py-0.5 rounded border border-[#E8D8C7]">
                            {srv.categoryName}
                          </span>
                        </div>
                        <p className="text-xs text-[#806B5C] line-clamp-1">{srv.description || 'Full hair/skin evaluation, bath & organic blowout.'}</p>
                        <span className="text-xs font-mono text-[#806B5C] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#B99470]" /> Duration: {srv.durationMinutes} minutes
                        </span>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="font-serif text-xl font-semibold text-[#41332B]">${srv.price}</span>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#B99470] bg-[#B99470] text-white' : 'border-[#E8D8C7]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleProceedToStep2}
              className="rounded-full shadow-md"
            >
              Continue to Artisan &amp; Time <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: STYLIST SELECTION & REAL-TIME AVAILABILITY
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-8">
          {/* Stylist Selector */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7]/60">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#B99470]" />
                <h2 className="font-serif text-xl text-[#41332B]">Select Preferred Artisan</h2>
              </div>
              <span className="text-xs text-[#806B5C]">
                {qualifiedStaff.length} Qualified for {selectedService?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Option: Any Available Stylist */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStaffId === 'any'
                    ? 'border-[#B99470] bg-[#F5EFE7] shadow-xs'
                    : 'border-[#E8D8C7] bg-white hover:border-[#B99470]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B99470] text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-medium text-[#41332B]">Any Master Artisan</h3>
                    <p className="text-[11px] text-[#806B5C]">First available qualified chair</p>
                  </div>
                </div>
                {selectedStaffId === 'any' && <Check className="w-4 h-4 text-[#B99470]" />}
              </div>

              {/* Qualified Stylists List */}
              {qualifiedStaff.map(st => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStaffId(st.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStaffId === st.id
                      ? 'border-[#B99470] bg-[#F5EFE7] shadow-xs'
                      : 'border-[#E8D8C7] bg-white hover:border-[#B99470]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#41332B] text-[#F5EFE7] flex items-center justify-center font-serif text-sm">
                      {st.displayName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-medium text-[#41332B]">{st.displayName}</h3>
                      <p className="text-[11px] text-[#806B5C]">{st.title}</p>
                      <span className="text-[10px] text-amber-600 font-medium">★ {st.rating.toFixed(2)}</span>
                    </div>
                  </div>
                  {selectedStaffId === st.id && <Check className="w-4 h-4 text-[#B99470]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/60">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#B99470]" />
                <h2 className="font-serif text-xl text-[#41332B]">Select Date &amp; Available Slot</h2>
              </div>

              {/* Date Input */}
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="px-4 py-2 bg-white border border-[#E8D8C7] rounded-xl text-xs font-mono text-[#41332B] focus:outline-none focus:border-[#B99470] cursor-pointer"
              />
            </div>

            {/* Slots Grid */}
            <div className="space-y-3">
              <p className="text-xs text-[#806B5C]">
                Displaying real-time open stations for <span className="font-medium text-[#41332B]">{selectedDate}</span> (Ritual duration: {selectedService?.durationMinutes} mins):
              </p>

              {availableSlots.length === 0 ? (
                <div className="p-8 text-center bg-[#F5EFE7]/50 rounded-xl border border-dashed border-[#E8D8C7]">
                  <p className="text-xs text-[#806B5C]">No available slots for this date or stylist is off-duty. Please select another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-3 px-2 rounded-xl text-xs font-mono transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-40 line-through'
                          : selectedTime === slot.time
                          ? 'bg-[#41332B] text-white border border-[#41332B] shadow-xs font-bold scale-102'
                          : 'bg-white text-[#41332B] border border-[#E8D8C7] hover:border-[#B99470]'
                      }`}
                    >
                      <span className="text-xs">{slot.time}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-75">
                        {slot.available ? 'Open' : 'Booked'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)} className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rituals
            </Button>
            <Button variant="primary" size="lg" onClick={handleProceedToStep3} className="rounded-full shadow-md">
              Review &amp; Pay <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: REVIEW, PRIVILEGE CODE & PAYMENT
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="space-y-8">
          {/* Reservation Summary Card */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E8D8C7]/60">
              <Sparkles className="w-5 h-5 text-[#B99470]" />
              <h2 className="font-serif text-xl text-[#41332B]">Reservation Summary</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#806B5C] font-mono uppercase text-[10px]">Atelier:</span>
                <p className="font-serif text-base text-[#41332B] font-medium">{selectedSalon?.name}</p>
                <p className="text-[#806B5C]">{selectedSalon?.address}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#806B5C] font-mono uppercase text-[10px]">Ritual Service:</span>
                <p className="font-serif text-base text-[#41332B] font-medium">{selectedService?.name}</p>
                <p className="text-[#806B5C]">Duration: {selectedService?.durationMinutes} mins • {selectedDate} at {selectedTime}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#806B5C] font-mono uppercase text-[10px]">Assigned Artisan:</span>
                <p className="font-serif text-base text-[#41332B] font-medium">
                  {selectedStaffId === 'any' ? 'First Available Master Artisan' : (db.getStaffById(selectedStaffId)?.displayName || 'Master Stylist')}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[#806B5C] font-mono uppercase text-[10px]">Guest Information:</span>
                <p className="font-serif text-base text-[#41332B] font-medium">{user?.fullName}</p>
                <p className="text-[#806B5C]">{user?.email}</p>
              </div>
            </div>

            {/* Special Requests */}
            <div className="pt-3 border-t border-[#E8D8C7]/60 space-y-1.5">
              <label className="text-xs text-[#806B5C] block font-medium">
                Sanctuary Notes &amp; Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Silent appointment, cold beverage, scalp sensitivity..."
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                className="w-full px-4 py-2 bg-[#F5EFE7]/40 border border-[#E8D8C7] rounded-xl text-xs text-[#41332B] focus:outline-none focus:border-[#B99470] resize-none"
              />
            </div>
          </div>

          {/* Privilege Offer Code Voucher */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#41332B]">Privilege Voucher Code</h3>
            <form onSubmit={handleApplyOffer} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo voucher (e.g. GLAMOUR15)"
                value={offerCodeInput}
                onChange={(e) => setOfferCodeInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#F5EFE7]/50 border border-[#E8D8C7] rounded-xl text-xs font-mono uppercase text-[#41332B] focus:outline-none focus:border-[#B99470]"
              />
              <Button type="submit" variant="outline" size="sm" className="whitespace-nowrap">
                Apply Code
              </Button>
            </form>
            {pricing.appliedOffer && (
              <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Applied {pricing.appliedOffer.title} (-${pricing.discountAmount})
              </p>
            )}
          </div>

          {/* Pricing & Fiscal Ledger Breakdown */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-lg text-[#41332B]">Investment Breakdown</h3>
            <div className="space-y-2 text-xs text-[#806B5C]">
              <div className="flex justify-between">
                <span>Ritual Subtotal:</span>
                <span className="font-mono text-[#41332B] font-medium">${pricing.basePrice}</span>
              </div>
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount ({pricing.appliedOffer?.code}):</span>
                  <span className="font-mono font-medium">-${pricing.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Applicable GST / VAT Tax (18%):</span>
                <span className="font-mono text-[#41332B] font-medium">${pricing.taxAmount}</span>
              </div>
              <div className="pt-2 border-t border-[#E8D8C7]/60 flex justify-between text-sm text-[#41332B] font-semibold">
                <span>Total Amount Due:</span>
                <span className="font-serif text-2xl text-[#41332B]">${pricing.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white/80 rounded-2xl border border-[#E8D8C7] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#41332B]">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'card' ? 'border-[#B99470] bg-[#F5EFE7]' : 'border-[#E8D8C7] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-[#B99470]" />
                  <span className="text-xs font-medium text-[#41332B]">Credit / Debit Card</span>
                </div>
                {paymentMethod === 'card' && <Check className="w-3.5 h-3.5 text-[#B99470]" />}
              </label>

              <label 
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-[#B99470] bg-[#F5EFE7]' : 'border-[#E8D8C7] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#B99470]" />
                  <span className="text-xs font-medium text-[#41332B]">Instant UPI / QR</span>
                </div>
                {paymentMethod === 'upi' && <Check className="w-3.5 h-3.5 text-[#B99470]" />}
              </label>

              <label 
                onClick={() => setPaymentMethod('pay_at_salon')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'pay_at_salon' ? 'border-[#B99470] bg-[#F5EFE7]' : 'border-[#E8D8C7] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#B99470]" />
                  <span className="text-xs font-medium text-[#41332B]">Pay at Atelier Desk</span>
                </div>
                {paymentMethod === 'pay_at_salon' && <Check className="w-3.5 h-3.5 text-[#B99470]" />}
              </label>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="lg" onClick={() => setCurrentStep(2)} className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleConfirmReservation}
              disabled={isSubmitting}
              className="rounded-full shadow-md"
            >
              {isSubmitting ? 'Securing Bay & Slot...' : `Authorize & Reserve ($${pricing.totalAmount})`}
            </Button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: CONFIRMATION & RECEIPT DOSSIER
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 4 && confirmedBooking && (
        <div className="bg-white rounded-3xl border border-[#E8D8C7] p-8 sm:p-12 shadow-lg space-y-8 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B99470] font-bold">
              RESERVATION GUARANTEED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#41332B] font-light">
              Your Sanctuary Ritual is Prepared
            </h2>
            <p className="text-xs text-[#806B5C] max-w-md mx-auto">
              Confirmation token <span className="font-mono font-semibold text-[#41332B]">{confirmedBooking.id}</span> has been dispatched to your email.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#F5EFE7]/80 border border-[#E8D8C7] space-y-4 text-left">
            <div className="flex justify-between items-start pb-3 border-b border-[#E8D8C7]/60">
              <div>
                <span className="font-serif text-lg font-medium text-[#41332B] block">{confirmedBooking.serviceName}</span>
                <span className="text-xs text-[#806B5C]">{selectedSalon?.name}</span>
              </div>
              <Badge variant="confirmed" label="Confirmed" />
            </div>

            <div className="space-y-2 text-xs text-[#806B5C]">
              <div className="flex justify-between">
                <span>Date &amp; Arrival:</span>
                <span className="font-mono font-medium text-[#41332B]">{confirmedBooking.appointmentDate} at {confirmedBooking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Master Artisan:</span>
                <span className="font-medium text-[#41332B]">{confirmedBooking.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Paid:</span>
                <span className="font-mono font-semibold text-[#41332B]">${confirmedBooking.price}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const receipt = PaymentService.generateReceiptData(confirmedBooking.id);
                window.print();
              }}
              className="rounded-full w-full sm:w-auto"
            >
              <Receipt className="w-4 h-4 mr-2" /> Print Statement Receipt
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/customer/bookings')}
              className="rounded-full w-full sm:w-auto shadow-md"
            >
              Go to My Sanctuary Bookings &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
