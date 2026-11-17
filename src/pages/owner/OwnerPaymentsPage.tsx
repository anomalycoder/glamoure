import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../database/db';
import type { Invoice, Payment, Appointment } from '../../types/appointment';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Receipt, 
  Search, 
  Printer,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export const OwnerPaymentsPage: React.FC = () => {
  const { salonId } = useAuth();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'reconciliation'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'card' | 'upi' | 'cash'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'successful' | 'pending' | 'failed' | 'refunded'>('all');

  // Selected receipt/invoice modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const payments = db.getPaymentsBySalon(currentSalonId);
  const invoices = db.getInvoicesBySalon(currentSalonId);
  const appointments = db.getAppointmentsBySalon(currentSalonId);
  const reconciliation = db.getDailyReconciliation(currentSalonId);
  const monthlySummary = db.getMonthlyRevenueSummary(currentSalonId);

  const totalSuccessfulRevenue = useMemo(() => {
    return payments
      .filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchMethod = methodFilter === 'all' || p.method === methodFilter;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = searchTerm === '' ||
        p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchMethod && matchStatus && matchSearch;
    });
  }, [payments, methodFilter, statusFilter, searchTerm]);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Payments, Invoices & Settlement
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Verified financial ledger, multi-channel payment reconciliation (Card, UPI, Cash), and tax receipts.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'payments' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6]'
            }`}
          >
            Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'invoices' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6]'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'reconciliation' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B] dark:hover:text-[#f5eee6]'
            }`}
          >
            Daily Reconciliation
          </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Total Realized Revenue</p>
          <p className="font-['Montserrat'] text-2xl text-[#41332B] dark:text-[#efc9a5] mt-1 font-light">
            ₹{totalSuccessfulRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Verified merchant ledger</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Today's Settlement</p>
          <p className="font-['Montserrat'] text-2xl text-[#41332B] dark:text-[#f5eee6] mt-1 font-light">
            ₹{reconciliation.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] mt-1">{reconciliation.appointmentCount} ritual receipts</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Digital (UPI & Card)</p>
          <p className="font-['Montserrat'] text-2xl text-[#41332B] dark:text-[#f5eee6] mt-1 font-light">
            ₹{(reconciliation.cardTotal + reconciliation.upiTotal).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Direct bank deposits</p>
        </Card>

        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Cash in Front Register</p>
          <p className="font-['Montserrat'] text-2xl text-[#41332B] dark:text-[#efc9a5] mt-1 font-light">
            ₹{reconciliation.cashTotal.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] mt-1">Ready for vault lockbox</p>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: PAYMENTS TRANSACTION STREAM
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'payments' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#806B5C] dark:text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] placeholder-[#806B5C] dark:placeholder-[#a89582] focus:outline-none focus:border-[#B99470]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
              >
                <option value="all">All Methods</option>
                <option value="card">Card (Stripe/POS)</option>
                <option value="upi">UPI QR / NetBanking</option>
                <option value="cash">Front Desk Cash</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-[#FAF6F1] dark:bg-[#2a1a15] border border-[#E8D8C7] dark:border-white/10 rounded-xl text-[#41332B] dark:text-[#f5eee6] focus:outline-none focus:border-[#B99470]"
              >
                <option value="all">All Statuses</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5c473b] dark:text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-[#E8D8C7] dark:border-white/10 text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Transaction Ref</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Appointment</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                {filteredPayments.map(p => {
                  const apt = appointments.find(a => a.id === p.appointmentId);
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF6F1]/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-mono text-xs text-[#B99470] dark:text-[#efc9a5]">
                        {p.transactionReference}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-sm text-[#41332B] dark:text-[#f5eee6]">
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 uppercase text-[10px] tracking-wider font-semibold">
                        <span className="px-2 py-0.5 rounded-lg bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]">
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#41332B] dark:text-[#f5eee6] block font-medium">{apt?.customerName || 'Guest'}</span>
                        <span className="text-[10px] text-[#806B5C] dark:text-[#a89582]">{apt?.serviceName || 'Salon Ritual'}</span>
                      </td>
                      <td className="py-3.5 text-[11px] text-[#806B5C] dark:text-[#a89582]">
                        {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5">
                        <Badge
                          variant={
                            p.status === 'successful' ? 'success' :
                            p.status === 'pending' ? 'warning' : 'danger'
                          }
                          className="capitalize text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: INVOICES & RECEIPT GENERATOR
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'invoices' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8D8C7] dark:border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">Tax Invoices & Billing Slips</h2>
              <p className="text-xs text-[#806B5C] dark:text-[#a89582]">Itemized breakdown with GST calculations and client discounts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5c473b] dark:text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-[#E8D8C7] dark:border-white/10 text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3">GST (18%)</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Grand Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#FAF6F1]/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#B99470] dark:text-[#efc9a5]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 font-mono">₹{inv.subtotal.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-[#806B5C] dark:text-[#a89582]">₹{inv.taxAmount.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-emerald-600 dark:text-emerald-400">-₹{inv.discountAmount.toLocaleString()}</td>
                    <td className="py-3.5 font-mono font-bold text-[#41332B] dark:text-[#f5eee6]">₹{inv.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5">
                      <Badge variant={inv.status === 'paid' ? 'success' : 'outline'} className="capitalize text-[10px]">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-xs px-2.5 py-1 text-[#41332B] dark:text-[#efc9a5] hover:border-[#B99470]"
                      >
                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        <span>View Bill</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: DAILY RECONCILIATION SUMMARY
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'reconciliation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8C7] dark:border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                End of Day Register Audit ({reconciliation.date})
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C] dark:text-[#a89582]">Total Appointments Finalized:</span>
                <span className="font-mono font-bold text-[#41332B] dark:text-[#f5eee6]">{reconciliation.appointmentCount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C] dark:text-[#a89582]">Card Swipes (POS Terminal):</span>
                <span className="font-mono font-semibold text-[#41332B] dark:text-[#f5eee6]">₹{reconciliation.cardTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C] dark:text-[#a89582]">Digital UPI & QR Payments:</span>
                <span className="font-mono font-semibold text-[#41332B] dark:text-[#f5eee6]">₹{reconciliation.upiTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C] dark:text-[#a89582]">Front Register Physical Cash:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">₹{reconciliation.cashTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3.5 rounded-xl bg-[#FAF6F1] dark:bg-[#41332b]/50 border border-[#E8D8C7] dark:border-[#b99470]/30 text-sm">
                <span className="font-semibold text-[#41332B] dark:text-[#efc9a5]">Total Daily Audited Revenue:</span>
                <span className="font-mono font-bold text-[#41332B] dark:text-[#efc9a5]">₹{reconciliation.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Monthly Velocity Trajectory
            </h2>
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              November 2026 consolidated revenue: <strong className="text-[#41332B] dark:text-[#f5eee6]">₹{monthlySummary.totalRevenue.toLocaleString()}</strong>
            </p>

            <div className="space-y-2 pt-2">
              {monthlySummary.breakdown.slice(-5).map((b, idx) => (
                <div key={idx} className="flex justify-between text-xs p-2.5 rounded-lg bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7]/50 dark:border-transparent">
                  <span className="text-[#806B5C] dark:text-[#c2b3a3] font-mono">{b.date}</span>
                  <span className="font-mono text-[#B99470] dark:text-[#efc9a5] font-semibold">₹{b.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: OFFICIAL TAX INVOICE & BILL RECEIPT (Refined & Clean)
      ═══════════════════════════════════════════════════════════════ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201511] border border-[#E8D8C7] dark:border-[#3a2820] rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl print:bg-white print:text-black">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C7] dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B99470]" />
                <h3 className="font-['Montserrat'] text-base font-medium text-[#41332B] dark:text-[#f5eee6]">
                  Tax Invoice &amp; Official Receipt
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="p-1 rounded-lg hover:bg-[#FAF6F1] dark:hover:bg-white/10 text-[#806B5C] dark:text-[#a89582] transition-colors"
                aria-label="Close bill modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Authentic Luxury Bill Layout */}
            <div className="p-5 rounded-xl bg-[#FAF6F1] dark:bg-white/5 border border-[#E8D8C7] dark:border-white/10 space-y-4 text-xs">
              
              {/* Salon Brand Header & Meta */}
              <div className="flex justify-between items-start pb-3 border-b border-[#E8D8C7] dark:border-white/10">
                <div>
                  <h4 className="font-['Montserrat'] font-light tracking-[0.2em] uppercase text-sm text-[#41332B] dark:text-[#efc9a5]">
                    GLAMOURÉ SANCTUARY
                  </h4>
                  <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] mt-0.5">Road No. 36, Jubilee Hills, Hyderabad</p>
                  <p className="text-[10px] text-[#806B5C] dark:text-[#a89582]">GSTIN: 36AAACG1234F1Z8</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-[#B99470] dark:text-[#efc9a5] block">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <p className="text-[10px] text-[#806B5C] dark:text-[#a89582] mt-0.5">
                    {new Date(selectedInvoice.issuedAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <span className="inline-block mt-1 text-[9.5px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                    Paid in Full
                  </span>
                </div>
              </div>

              {/* Itemized Line Items */}
              <div className="space-y-2">
                <div className="flex justify-between text-[#806B5C] dark:text-[#a89582] text-[10.5px] uppercase tracking-wider font-semibold">
                  <span>Ritual / Treatment Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-[#41332B] dark:text-[#f5eee6] font-medium pt-1">
                  <span>Custom Haute Styling &amp; Hair Care</span>
                  <span className="font-mono">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Financial Totals Breakdown */}
              <div className="pt-3 border-t border-[#E8D8C7] dark:border-white/10 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#806B5C] dark:text-[#a89582]">Subtotal:</span>
                  <span className="font-mono text-[#41332B] dark:text-[#f5eee6]">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#806B5C] dark:text-[#a89582]">Applicable GST (18%):</span>
                  <span className="font-mono text-[#41332B] dark:text-[#f5eee6]">₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Privilege Campaign Discount:</span>
                    <span className="font-mono">-₹{selectedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E8D8C7] dark:border-white/10 font-bold text-sm text-[#41332B] dark:text-[#efc9a5]">
                  <span>Total Settlement:</span>
                  <span className="font-mono text-base">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Verified Footer */}
              <p className="text-[10px] text-center text-[#806B5C] dark:text-[#a89582] italic pt-1">
                Thank you for visiting Glamouré. All treatments certified with botanical care.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintReceipt}
                className="flex items-center gap-1.5 text-xs text-[#41332B] dark:text-[#efc9a5]"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                <span>Print Bill</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs px-5 py-2 rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
