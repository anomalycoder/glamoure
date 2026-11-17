import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Invoice, Payment, Appointment } from '../../types/appointment';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  CreditCard, 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Calendar, 
  TrendingUp, 
  Search, 
  FileText, 
  Printer,
  Sparkles
} from 'lucide-react';

export const OwnerPaymentsPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#f5eee6]">
            Payments, Invoices & Settlement
          </h1>
          <p className="text-xs text-[#a89582] mt-0.5">
            Verified financial ledger, multi-channel payment reconciliation (Card, UPI, Cash), and tax receipts.
          </p>
        </div>

        <div className="flex rounded-lg bg-white/5 p-1 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'payments' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
            }`}
          >
            Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'invoices' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
            }`}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'reconciliation' ? 'bg-[#41332b] text-[#efc9a5]' : 'text-[#c2b3a3] hover:text-[#f5eee6]'
            }`}
          >
            Daily Reconciliation
          </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Total Realized Revenue</p>
          <p className="font-['Montserrat'] text-2xl text-[#efc9a5] mt-1 font-light">
            ₹{totalSuccessfulRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Verified merchant ledger</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Today's Settlement</p>
          <p className="font-['Montserrat'] text-2xl text-[#f5eee6] mt-1 font-light">
            ₹{reconciliation.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">{reconciliation.appointmentCount} ritual receipts</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Digital (UPI & Card)</p>
          <p className="font-['Montserrat'] text-2xl text-[#f5eee6] mt-1 font-light">
            ₹{(reconciliation.cardTotal + reconciliation.upiTotal).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">Direct bank deposits</p>
        </Card>

        <Card className="p-4 bg-[#201511] border-[#3a2820]">
          <p className="text-[11px] uppercase tracking-wider text-[#a89582] font-semibold">Cash in Front Register</p>
          <p className="font-['Montserrat'] text-2xl text-[#efc9a5] mt-1 font-light">
            ₹{reconciliation.cashTotal.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#a89582] mt-1">Ready for vault lockbox</p>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: PAYMENTS TRANSACTION STREAM
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'payments' && (
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#a89582] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-[#f5eee6] placeholder-[#a89582] focus:outline-none focus:border-[#b99470]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-[#2a1a15] border border-white/10 rounded-xl text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
              >
                <option value="all">All Methods</option>
                <option value="card">Card (Stripe/POS)</option>
                <option value="upi">UPI QR / NetBanking</option>
                <option value="cash">Front Desk Cash</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-[#2a1a15] border border-white/10 rounded-xl text-[#f5eee6] focus:outline-none focus:border-[#b99470]"
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
            <table className="w-full text-left text-xs text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-white/10 text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Transaction Ref</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Appointment</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map(p => {
                  const apt = appointments.find(a => a.id === p.appointmentId);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-mono text-xs text-[#efc9a5]">
                        {p.transactionReference}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-sm text-[#f5eee6]">
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 uppercase text-[10px] tracking-wider font-semibold">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f5eee6]">
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#f5eee6] block font-medium">{apt?.customerName || 'Guest'}</span>
                        <span className="text-[10px] text-[#a89582]">{apt?.serviceName || 'Salon Ritual'}</span>
                      </td>
                      <td className="py-3.5 text-[11px] text-[#a89582]">
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
        <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">Tax Invoices & Billing Slips</h2>
              <p className="text-xs text-[#a89582]">Itemized breakdown with GST calculations and client discounts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-white/10 text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3">GST (18%)</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Grand Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#efc9a5]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 font-mono">₹{inv.subtotal.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-[#a89582]">₹{inv.taxAmount.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-emerald-400">-₹{inv.discountAmount.toLocaleString()}</td>
                    <td className="py-3.5 font-mono font-bold text-[#f5eee6]">₹{inv.totalAmount.toLocaleString()}</td>
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
                        className="text-xs px-2.5 py-1 text-[#efc9a5] hover:text-[#f5eee6] border-white/10"
                      >
                        <Receipt className="w-3.5 h-3.5 mr-1" />
                        <span>View Receipt</span>
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
          <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
            <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
              Daily Till Reconciliation ({reconciliation.date})
            </h2>
            <p className="text-xs text-[#a89582]">
              Audit register balancing digital gateway settlements with cash drawer intake.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-white/5">
                <span className="text-[#a89582]">POS / Credit & Debit Cards:</span>
                <span className="font-mono font-semibold text-[#f5eee6]">₹{reconciliation.cardTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white/5">
                <span className="text-[#a89582]">UPI QR / Online Collections:</span>
                <span className="font-mono font-semibold text-[#f5eee6]">₹{reconciliation.upiTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white/5">
                <span className="text-[#a89582]">Front Register Physical Cash:</span>
                <span className="font-mono font-semibold text-emerald-400">₹{reconciliation.cashTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3.5 rounded-xl bg-[#41332b]/50 border border-[#b99470]/30 text-sm">
                <span className="font-semibold text-[#efc9a5]">Total Daily Audited Revenue:</span>
                <span className="font-mono font-bold text-[#efc9a5]">₹{reconciliation.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#201511] border-[#3a2820] space-y-4">
            <h2 className="font-['Montserrat'] text-base font-light text-[#f5eee6]">
              Monthly Velocity Trajectory
            </h2>
            <p className="text-xs text-[#a89582]">
              November 2026 consolidated revenue: <strong>₹{monthlySummary.totalRevenue.toLocaleString()}</strong>
            </p>

            <div className="space-y-2 pt-2">
              {monthlySummary.breakdown.slice(-5).map((b, idx) => (
                <div key={idx} className="flex justify-between text-xs p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#c2b3a3] font-mono">{b.date}</span>
                  <span className="font-mono text-[#efc9a5] font-semibold">₹{b.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: OFFICIAL TAX INVOICE & RECEIPT
      ═══════════════════════════════════════════════════════════════ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#201511] border border-[#3a2820] rounded-2xl max-w-lg w-full p-6 space-y-4 print:bg-white print:text-black">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b99470]" />
                <h3 className="font-['Montserrat'] text-base text-[#f5eee6]">Tax Invoice Receipt</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-[#a89582] hover:text-[#f5eee6]">✕</button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 text-xs">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-['Montserrat'] font-bold tracking-widest uppercase text-sm text-[#efc9a5]">
                    GLAMOURÉ SANCTUARY
                  </h4>
                  <p className="text-[10px] text-[#a89582]">Road No. 36, Jubilee Hills, Hyderabad</p>
                  <p className="text-[10px] text-[#a89582]">GSTIN: 36AAACG1234F1Z8</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-xs text-[#efc9a5]">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-[10px] text-[#a89582]">{new Date(selectedInvoice.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#a89582]">Subtotal:</span>
                  <span className="font-mono text-[#f5eee6]">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a89582]">Applicable GST (18%):</span>
                  <span className="font-mono text-[#f5eee6]">₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Campaign Discount:</span>
                    <span className="font-mono">-₹{selectedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm text-[#efc9a5]">
                  <span>Total Settlement:</span>
                  <span className="font-mono">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintReceipt}
                className="flex items-center gap-1.5 text-xs text-[#efc9a5]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="bg-[#b99470] text-[#18110e] font-semibold text-xs px-4 py-1.5 rounded-xl"
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
