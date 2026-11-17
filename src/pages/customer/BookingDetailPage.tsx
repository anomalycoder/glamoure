import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { AppointmentService } from '../../services/appointmentService';
import { PaymentService } from '../../services/paymentService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  History, 
  CreditCard, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [cancelReason, setCancelReason] = useState('');
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const appointment = id ? db.getAppointmentById(id) : undefined;
  const history = id ? db.getAppointmentHistory(id) : [];

  if (!appointment) {
    return (
      <div className="py-20 text-center space-y-3">
        <h3 className="font-['Montserrat'] text-xl text-[#41332B]">Appointment Not Found</h3>
        <p className="text-xs text-[#806B5C]">The requested booking could not be retrieved.</p>
        <Link to="/customer/bookings">
          <Button variant="secondary" size="sm">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  const handleCancel = () => {
    if (!user) return;
    if (!cancelReason.trim()) {
      showToast('Reason Required', 'Please provide a reason for cancelling this appointment.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      AppointmentService.updateStatus(appointment.id, 'cancelled', user, cancelReason);
      showToast('Appointment Cancelled', 'Your booking has been cancelled and salon notified.', 'info');
      setShowCancelBox(false);
    } catch (e: any) {
      showToast('Cancellation Failed', e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayRemaining = () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      PaymentService.processPayment({
        salonId: appointment.salonId,
        appointmentId: appointment.id,
        customerId: user.id,
        amount: appointment.price - appointment.depositAmount,
        method: 'card',
        user,
        notes: 'Settled remaining balance',
      });
      showToast('Payment Successful', 'Balance settled in full.', 'success');
    } catch (e: any) {
      showToast('Payment Failed', e.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/customer/dashboard' },
          { label: 'My Bookings', path: '/customer/bookings' },
          { label: appointment.serviceName },
        ]}
      />

      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-['Montserrat'] text-2xl font-light text-[#41332B]">
              Booking #{appointment.id.substring(0, 10)}
            </h2>
            <Badge status={appointment.status} />
          </div>
          <p className="text-xs text-[#806B5C] mt-1">
            Created on {new Date(appointment.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && !showCancelBox && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelBox(true)}
              className="text-rose-700 border-rose-300 hover:bg-rose-50"
            >
              Cancel Reservation
            </Button>
          )}

          {appointment.paymentStatus !== 'paid' && appointment.status !== 'cancelled' && (
            <Button size="sm" onClick={handlePayRemaining} isLoading={isProcessing}>
              Pay Balance (₹{(appointment.price - appointment.depositAmount).toLocaleString()})
            </Button>
          )}
        </div>
      </div>

      {/* Cancellation Prompt */}
      {showCancelBox && (
        <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Confirm Appointment Cancellation</span>
          </div>
          <p className="text-xs text-rose-700">
            Per sanctuary policy, cancellations made with 24 hours notice release your reservation slot with zero penalty.
          </p>
          <input
            type="text"
            placeholder="Please specify a brief reason for cancellation..."
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-rose-300 text-xs text-[#241812] focus:outline-none"
          />
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              isLoading={isProcessing}
            >
              Confirm Cancellation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancelBox(false)}
            >
              Keep Appointment
            </Button>
          </div>
        </div>
      )}

      {/* Grid: Details + Audit Lifecycle Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Appointment Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card>
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#806B5C] mb-4">
              Service &amp; Stylist Overview
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-[#806B5C] uppercase tracking-wider block">Bespoke Service</span>
                <h4 className="font-['Montserrat'] text-lg font-medium text-[#41332B] mt-0.5">
                  {appointment.serviceName}
                </h4>
                <span className="text-xs text-[#806B5C]">{appointment.durationMinutes} minutes dedicated chair session</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#41332B]/5">
                <div>
                  <span className="text-[11px] text-[#806B5C] uppercase tracking-wider block">Master Stylist</span>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-[#41332B]">
                    <User className="w-4 h-4 text-[#806B5C]" />
                    <span>{appointment.staffName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#806B5C] uppercase tracking-wider block">Date &amp; Time</span>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-[#41332B]">
                    <Clock className="w-4 h-4 text-[#806B5C]" />
                    <span>{appointment.appointmentDate} · {appointment.startTime} - {appointment.endTime}</span>
                  </div>
                </div>
              </div>

              {appointment.notes && (
                <div className="pt-2 border-t border-[#41332B]/5">
                  <span className="text-[11px] text-[#806B5C] uppercase tracking-wider block">Client Notes</span>
                  <p className="text-xs text-[#41332B] mt-1 leading-relaxed bg-[#FAF6F1] p-3 rounded-xl border border-[#41332B]/10">
                    "{appointment.notes}"
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Billing & Settlement */}
          <Card>
            <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#806B5C] mb-4">
              Financial Breakdown &amp; Status
            </h3>

            <div className="space-y-2.5 text-xs text-[#41332B]">
              <div className="flex justify-between">
                <span>Treatment Service Subtotal</span>
                <span>₹{appointment.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#806B5C]">
                <span>Pre-authorized Deposit Paid</span>
                <span>- ₹{appointment.depositAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#41332B]/10 flex justify-between font-semibold text-sm">
                <span>Balance Due</span>
                <span className="text-[#41332B]">
                  ₹{(appointment.price - appointment.depositAmount).toLocaleString()}
                </span>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#806B5C]">
                <span>Payment Lifecycle State</span>
                <Badge status={appointment.paymentStatus} />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Immutable Lifecycle Status Audit Trail (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[#41332B]" />
              <h3 className="font-['Montserrat'] text-xs font-semibold uppercase tracking-wider text-[#41332B]">
                Lifecycle Transition Audit Trail
              </h3>
            </div>

            <p className="text-[11px] text-[#806B5C] mb-4">
              Every status change is verified on the backend and immutably recorded with actor identity.
            </p>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#41332B]/20">
              {history.map((record, idx) => (
                <div key={record.id || idx} className="relative pl-7 text-xs">
                  <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-[#41332B] border-2 border-white shadow-sm" />
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#41332B] capitalize">
                      {record.toStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#806B5C]">
                      {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-[#806B5C] mt-0.5 leading-snug">
                    {record.reason || 'Status updated'}
                  </p>

                  <div className="text-[10px] text-[#806B5C]/70 mt-1">
                    Actor: <strong className="text-[#41332B]">{record.changedByName}</strong>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
