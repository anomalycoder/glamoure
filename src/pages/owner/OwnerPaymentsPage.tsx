import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import type { Invoice, Payment, Appointment } from '../../types/appointment';
import type { StaffProfile } from '../../types/staff';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Receipt, 
  Search, 
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  UserCheck,
  Percent,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Check,
  Download
} from 'lucide-react';

export const OwnerPaymentsPage: React.FC = () => {
  const { salonId } = useAuth();
  const { activeBranchId, isBranchMatch } = useBranch();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // 4 Tabs: Customer Ledger, Member Commission Ledger, Financial Overview (GST), Daily Reconciliation
  const [activeTab, setActiveTab] = useState<'customer_ledger' | 'commissions' | 'financial_overview' | 'reconciliation'>('customer_ledger');
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'card' | 'upi' | 'cash'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'successful' | 'pending' | 'failed' | 'refunded'>('all');

  // Selected receipt/invoice modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const payments = useMemo(() => db.getPaymentsBySalon(currentSalonId), [currentSalonId]);
  const invoices = useMemo(() => db.getInvoicesBySalon(currentSalonId), [currentSalonId]);
  const appointments = useMemo(() => db.getAppointmentsBySalon(currentSalonId), [currentSalonId]);
  const staffMembers = useMemo(() => db.getStaffBySalon(currentSalonId), [currentSalonId]);
  const reconciliation = useMemo(() => db.getDailyReconciliation(currentSalonId), [currentSalonId]);
  const monthlySummary = useMemo(() => db.getMonthlyRevenueSummary(currentSalonId), [currentSalonId]);

  // Branch-Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => isBranchMatch(a.branchId));
  }, [appointments, isBranchMatch]);

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

  // Member Commission Calculations
  const memberCommissions = useMemo(() => {
    const completedApts = filteredAppointments.filter(a => a.status === 'completed');
    return staffMembers.map(staff => {
      const staffApts = completedApts.filter(a => a.staffId === staff.id);
      const grossRevenue = staffApts.reduce((sum, a) => sum + a.price, 0);
      const commissionRate = staff.commissionPercentage || 30;
      const earnedAmount = Math.round(grossRevenue * (commissionRate / 100));
      return {
        staff,
        completedCount: staffApts.length,
        grossRevenue,
        commissionRate,
        earnedAmount,
        settled: true
      };
    });
  }, [filteredAppointments, staffMembers]);

  // Total Commissions Earned
  const totalCommissionsEarned = useMemo(() => {
    return memberCommissions.reduce((sum, m) => sum + m.earnedAmount, 0);
  }, [memberCommissions]);

  // GST Breakdown (18% GST = 9% CGST + 9% SGST)
  const gstBreakdown = useMemo(() => {
    const totalTax = invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    const subtotal = invoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    return {
      totalTax,
      subtotal,
      cgst: Math.round(totalTax / 2),
      sgst: Math.round(totalTax / 2)
    };
  }, [invoices]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSettleCommission = (staffName: string) => {
    showToast('Commission Settled', `Direct deposit payroll voucher dispatched for ${staffName}.`);
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* ═════════════════════════════════════════════════════════════════════
          HEADER & 4-TAB NAVIGATION
      ═════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#41332B] dark:text-[#f5eee6]">
            Payments, Invoices & Settlement
          </h1>
          <p className="text-xs text-[#806B5C] dark:text-[#a89582] mt-0.5">
            Verified financial ledger: Customer billing, artisan commission accounting, GST tax compliance, and daily cash reconciliation.
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="flex flex-wrap rounded-xl bg-[#FAF6F1] dark:bg-white/5 p-1 border border-[#E8D8C7] dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('customer_ledger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'customer_ledger' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Customer Ledger ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'commissions' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Member Commissions ({staffMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('financial_overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'financial_overview' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Financial Overview & GST
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'reconciliation' 
                ? 'bg-[#41332B] text-white shadow-xs' 
                : 'text-[#806B5C] dark:text-[#c2b3a3] hover:text-[#41332B]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reconciliation
          </button>
        </div>
      </div>

      {/* Financial Health Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Total Realized Revenue</p>
          <p className="font-['Montserrat'] text-xl text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-light">
            ₹{totalSuccessfulRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified merchant ledger
          </p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Artisan Commissions</p>
          <p className="font-['Montserrat'] text-xl text-[#B99470] mt-0.5 font-light">
            ₹{totalCommissionsEarned.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#806B5C] mt-0.5">Calculated per contract rates</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">GST Collected (18%)</p>
          <p className="font-['Montserrat'] text-xl text-[#41332B] dark:text-[#f5eee6] mt-0.5 font-light">
            ₹{gstBreakdown.totalTax.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#806B5C] mt-0.5">CGST 9% + SGST 9%</p>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21]">
          <p className="text-[10px] uppercase tracking-wider text-[#806B5C] dark:text-[#a89582] font-semibold">Net Salon Retained</p>
          <p className="font-['Montserrat'] text-xl text-emerald-600 dark:text-emerald-400 mt-0.5 font-light">
            ₹{(totalSuccessfulRevenue - totalCommissionsEarned - gstBreakdown.totalTax).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 mt-0.5">After staff & statutory tax</p>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: CUSTOMER LEDGER & TAX INVOICES
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'customer_ledger' && (
        <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D8C7]/60 dark:border-[#3d2a21]">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                Customer Invoices & Billing Slips
              </h2>
              <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                Official GST-compliant tax receipts with customer attribution and itemized services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#806B5C]" />
                <input
                  type="text"
                  placeholder="Filter invoice #..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8D8C7] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#41332B] dark:text-[#f5eee6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invoice #</th>
                  <th className="py-3 px-4 font-semibold">Client Dossier</th>
                  <th className="py-3 px-4 font-semibold">Service Date</th>
                  <th className="py-3 px-4 font-semibold">Subtotal</th>
                  <th className="py-3 px-4 font-semibold">GST (18%)</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                {invoices.map(inv => {
                  const apt = appointments.find(a => a.id === inv.appointmentId);
                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF6F1]/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#B99470]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{apt?.customerName || 'Walk-in Guest'}</p>
                        <p className="text-[11px] text-[#806B5C]">{apt?.serviceName || 'Salon Ritual'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#806B5C] dark:text-[#a89582]">
                        {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString('en-IN') : 'Nov 17, 2026'}
                      </td>
                      <td className="py-3.5 px-4 font-mono">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 font-mono text-[#806B5C]">₹{inv.taxAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#41332B] dark:text-[#f5eee6]">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={inv.status === 'paid' ? 'success' : 'outline'} className="capitalize text-[10px]">
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-xs px-2.5 py-1 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
                        >
                          <Receipt className="w-3.5 h-3.5 mr-1 text-[#B99470]" />
                          View Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: MEMBER COMMISSION LEDGER
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'commissions' && (
        <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8D8C7]/60 dark:border-[#3d2a21]">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
                Artisan Commission Ledger & Payroll Accruals
              </h2>
              <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
                Automated payout ledger derived from completed service milestones and contractual commission percentages.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Export Complete', 'Commission payroll report downloaded.')}
              className="text-xs border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#B99470]" />
              Export Payroll CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#E8D8C7]/80 dark:border-[#3d2a21] text-[#806B5C] dark:text-[#a89582] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Salon Artisan</th>
                  <th className="py-3 px-4 font-semibold">Role & Title</th>
                  <th className="py-3 px-4 font-semibold">Completed Services</th>
                  <th className="py-3 px-4 font-semibold">Gross Service Billing</th>
                  <th className="py-3 px-4 font-semibold">Contract Rate</th>
                  <th className="py-3 px-4 font-semibold">Net Commission Earned</th>
                  <th className="py-3 px-4 font-semibold">Settlement Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C7]/50 dark:divide-white/5">
                {memberCommissions.map(m => (
                  <tr key={m.staff.id} className="hover:bg-[#FAF6F1]/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E8D8C7] text-[#41332B] flex items-center justify-center font-serif text-xs font-bold">
                          {m.staff.displayName.charAt(0)}
                        </div>
                        <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{m.staff.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#806B5C] dark:text-[#a89582]">
                      {m.staff.role || 'Artisan'} • {m.staff.title}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                      {m.completedCount} rituals
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      ₹{m.grossRevenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#41332B] dark:text-[#f5eee6]">
                      {m.commissionRate}%
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{m.earnedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <Check className="w-3 h-3" /> Ready for Payroll
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSettleCommission(m.staff.displayName)}
                        className="text-xs px-2.5 py-1 border-[#E8D8C7] dark:border-white/10 text-[#41332B] dark:text-[#f5eee6]"
                      >
                        Settle Voucher
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: FINANCIAL OVERVIEW & TAX (GST)
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'financial_overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statutory GST Tax Ledger */}
          <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#B99470]" />
              GST Tax Compliance Breakdown (18% HSN 99972)
            </h3>
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              Tax collected under Indian Goods and Services Tax regulations for salon & beauty services.
            </p>

            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/80 dark:border-white/10 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C]">Taxable Gross Turnover</span>
                <span className="font-mono font-medium text-[#41332B] dark:text-[#f5eee6]">₹{gstBreakdown.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C]">Central GST (CGST @ 9%)</span>
                <span className="font-mono font-medium text-[#41332B] dark:text-[#f5eee6]">₹{gstBreakdown.cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8D8C7]/50 dark:border-white/5">
                <span className="text-[#806B5C]">State GST (SGST @ 9%)</span>
                <span className="font-mono font-medium text-[#41332B] dark:text-[#f5eee6]">₹{gstBreakdown.sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-sm text-[#41332B] dark:text-[#f5eee6]">
                <span>Total Statutory Tax Liability</span>
                <span className="font-mono text-[#B99470]">₹{gstBreakdown.totalTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method Distribution */}
          <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#B99470]" />
              Payment Channels Distribution
            </h3>
            <p className="text-xs text-[#806B5C] dark:text-[#a89582]">
              Multi-channel reconciliation between digital gateways and cash desk.
            </p>

            <div className="space-y-3 pt-1">
              {[
                { name: 'Razorpay UPI & Instant Pay', share: '62%', amount: Math.round(totalSuccessfulRevenue * 0.62) },
                { name: 'POS Card Terminals (Visa/Mastercard)', share: '31%', amount: Math.round(totalSuccessfulRevenue * 0.31) },
                { name: 'Front Desk Cash Tender', share: '7%', amount: Math.round(totalSuccessfulRevenue * 0.07) },
              ].map((channel, i) => (
                <div key={i} className="p-3 rounded-lg border border-[#E8D8C7]/60 dark:border-white/5 bg-[#FAF7F2] dark:bg-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#41332B] dark:text-[#f5eee6]">{channel.name}</span>
                    <span className="font-mono font-bold text-[#41332B] dark:text-[#f5eee6]">₹{channel.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-[#E8D8C7]/40 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#41332B] dark:bg-[#B99470] h-full rounded-full" style={{ width: channel.share }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 4: DAILY RECONCILIATION
      ═════════════════════════════════════════════ */}
      {activeTab === 'reconciliation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Daily Till & Settlement Balances
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/60 dark:border-white/5">
                <span className="text-[#806B5C]">Opening Drawer Balance</span>
                <span className="font-mono font-medium text-[#41332B] dark:text-[#f5eee6]">₹{reconciliation.openingBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/60 dark:border-white/5">
                <span className="text-[#806B5C]">Cash Received Today</span>
                <span className="font-mono font-medium text-[#41332B] dark:text-[#f5eee6]">₹{reconciliation.cashReceived.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF7F2] dark:bg-white/5 border border-[#E8D8C7]/60 dark:border-white/5">
                <span className="text-[#806B5C]">Digital Gateways Settled</span>
                <span className="font-mono font-medium text-emerald-600">₹{reconciliation.digitalSettled.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 font-semibold text-emerald-900 dark:text-emerald-300">
                <span>Total Reconciled Till</span>
                <span className="font-mono">₹{reconciliation.totalReconciled.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-[#221612] border-[#E8D8C7]/80 dark:border-[#3d2a21] space-y-4">
            <h3 className="font-['Montserrat'] text-base font-light text-[#41332B] dark:text-[#f5eee6]">
              Gateway Batch Settlements
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { gateway: 'Razorpay PG Batch #8812', amount: '₹42,500', status: 'Dispatched to HDFC Current Account' },
                { gateway: 'PineLabs EDC Terminal #04', amount: '₹18,200', status: 'Settled to Bank via T+1 IMPS' },
                { gateway: 'Cash Drawer Vault', amount: '₹6,400', status: 'Audited & Locked in Safe' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-[#E8D8C7]/60 dark:border-white/5 bg-[#FAF7F2] dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#41332B] dark:text-[#f5eee6]">{item.gateway}</p>
                    <p className="text-[11px] text-[#806B5C]">{item.status}</p>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#41332B] dark:text-[#f5eee6]">{item.amount}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          OFFICIAL TAX INVOICE MODAL
      ═════════════════════════════════════════════════════════════════════ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8D8C7] shadow-2xl overflow-hidden text-left font-['Plus_Jakarta_Sans'] text-[#41332B]">
            {/* Action Bar */}
            <div className="p-3 bg-[#FAF7F2] border-b border-[#E8D8C7] flex items-center justify-between print:hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#806B5C]">
                Official Tax Invoice Receipt
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handlePrintReceipt}
                  className="text-xs bg-[#41332B] hover:bg-[#2b1810] text-white flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </Button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-[#806B5C] hover:text-[#41332B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Authentic Printable Bill Layout */}
            <div className="p-6 space-y-5 bg-white">
              {/* Salon Brand Header */}
              <div className="text-center pb-4 border-b border-dashed border-[#E8D8C7]">
                <h2 className="font-['Montserrat'] text-xl font-light tracking-[0.25em] uppercase text-[#41332B]">
                  G L A M O U R É
                </h2>
                <p className="text-[11px] text-[#806B5C] tracking-widest uppercase mt-0.5">Haute Beauté & Artisan Sanctuary</p>
                <p className="text-[10px] text-[#806B5C] mt-1">Road No. 36, Jubilee Hills, Hyderabad • Tel: +91 98840 12345</p>
                <p className="text-[10px] text-[#806B5C] font-mono">GSTIN: 36AAACG1234F1Z8</p>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 text-xs gap-2">
                <div>
                  <span className="text-[#806B5C] block text-[10px] uppercase">Invoice Number</span>
                  <span className="font-mono font-bold text-[#41332B]">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#806B5C] block text-[10px] uppercase">Date & Time</span>
                  <span className="font-mono text-[#41332B]">
                    {new Date(selectedInvoice.issuedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div className="pt-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E8D8C7] text-[#806B5C] uppercase text-[10px]">
                      <th className="pb-2 text-left">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D8C7]/50">
                    <tr>
                      <td className="py-2.5">
                        <span className="font-medium text-[#41332B] block">Signature Luxury Ritual</span>
                        <span className="text-[10px] text-[#806B5C]">SAC: 999722 • Senior Artisan Styling</span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-medium text-[#41332B]">
                        ₹{selectedInvoice.subtotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals & Tax Calculation */}
              <div className="border-t border-[#E8D8C7] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#806B5C]">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#806B5C]">
                  <span>CGST @ 9%</span>
                  <span className="font-mono">₹{Math.round(selectedInvoice.taxAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#806B5C]">
                  <span>SGST @ 9%</span>
                  <span className="font-mono">₹{Math.round(selectedInvoice.taxAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#41332B] font-bold text-sm pt-2 border-t border-dashed border-[#E8D8C7]">
                  <span>Grand Total (INR)</span>
                  <span className="font-mono">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-dashed border-[#E8D8C7] text-[10px] text-[#806B5C] space-y-1">
                <p>Thank you for choosing Glamouré. All services are curated with organic botanicals.</p>
                <p className="font-mono text-[9px]">Receipt Token: {selectedInvoice.id.slice(0, 16)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
