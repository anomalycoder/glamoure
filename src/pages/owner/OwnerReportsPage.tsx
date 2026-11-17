import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { db } from '../../database/db';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Download, 
  Scissors, 
  Star,
  Building2,
  Filter,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const OwnerReportsPage: React.FC = () => {
  const { salonId } = useAuth();
  const { showToast } = useNotification();
  const currentSalonId = salonId || 'salon-glamoure-jubilee';

  // Filters
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [reportRange, setReportRange] = useState<'week' | 'month' | 'quarter' | 'all'>('month');

  const branches = db.getBranchesBySalon(currentSalonId);
  const staff = db.getStaffBySalon(currentSalonId);
  const services = db.getServicesBySalon(currentSalonId);
  const allAppointments = db.getAppointmentsBySalon(currentSalonId);
  const allPayments = db.getPaymentsBySalon(currentSalonId).filter(p => p.status === 'successful');

  // Filtered dataset
  const appointments = useMemo(() => {
    return allAppointments.filter(a => {
      const matchBranch = selectedBranchId === 'all' || a.branchId === selectedBranchId;
      if (!matchBranch) return false;
      if (reportRange === 'week') return a.appointmentDate >= '2026-11-15' && a.appointmentDate <= '2026-11-21';
      if (reportRange === 'month') return a.appointmentDate.startsWith('2026-11');
      if (reportRange === 'quarter') return a.appointmentDate >= '2026-10-01' && a.appointmentDate <= '2026-12-31';
      return true;
    });
  }, [allAppointments, selectedBranchId, reportRange]);

  const payments = useMemo(() => {
    return allPayments.filter(p => {
      if (reportRange === 'week') return p.createdAt >= '2026-11-15' && p.createdAt <= '2026-11-21T23:59:59Z';
      if (reportRange === 'month') return p.createdAt.startsWith('2026-11');
      return true;
    });
  }, [allPayments, reportRange]);

  // Metric 1: Revenue Calculations
  const totalRevenue = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  // Metric 2: Appointment Metrics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const noShowAppointments = appointments.filter(a => a.status === 'no_show').length;
  const completionRate = totalAppointments > 0 ? +((completedAppointments / totalAppointments) * 100).toFixed(1) : 100;
  const cancellationRate = totalAppointments > 0 ? +((cancelledAppointments / totalAppointments) * 100).toFixed(1) : 0;

  // Metric 3: Customer Metrics
  const segments = db.getCustomerSegments(currentSalonId);
  const newCustomerCount = segments.new.length;
  const returningCustomerCount = segments.returning.length + segments.frequent.length;
  const totalUniqueCustomers = newCustomerCount + returningCustomerCount || 6;
  const retentionRate = totalUniqueCustomers > 0 ? +((returningCustomerCount / totalUniqueCustomers) * 100).toFixed(1) : 80;

  // Revenue by Service Breakdown
  const revenueByService = useMemo(() => {
    const map: Record<string, { serviceName: string; count: number; total: number }> = {};
    appointments.forEach(a => {
      if (!map[a.serviceId]) {
        map[a.serviceId] = { serviceName: a.serviceName, count: 0, total: 0 };
      }
      map[a.serviceId].count++;
      map[a.serviceId].total += a.price;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [appointments]);

  // Employee Performance Trends
  const employeePerformance = useMemo(() => {
    return staff.map(s => {
      const staffApts = appointments.filter(a => a.staffId === s.id);
      const rev = staffApts.reduce((acc, curr) => acc + curr.price, 0);
      return {
        id: s.id,
        name: s.displayName,
        title: s.title,
        appointments: staffApts.length,
        revenue: rev,
        rating: s.rating,
        commission: Math.round((rev * s.commissionPercentage) / 100),
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [staff, appointments]);

  const handleExportReport = () => {
    const headers = ['Artisan', 'Title', 'Appointments', 'Revenue (INR)', 'Commission (INR)', 'Rating'];
    const rows = employeePerformance.map(e => [
      `"${e.name}"`,
      `"${e.title}"`,
      e.appointments,
      e.revenue,
      e.commission,
      e.rating
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glamoure_business_report_${reportRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'Executive analytics spreadsheet downloaded.');
  };

  return (
    <div className="space-y-6 text-left font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5] dark:border-[#3d2a21]">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-wide text-[#2B2118] dark:text-[#f5eee6]">
            Intelligence & Executive Reports
          </h1>
          <p className="text-xs text-[#7A6658] dark:text-[#a89582] mt-0.5">
            Empirical revenue attribution, artisan utilization, retention curves, and tariff analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-xl text-xs text-[#2B2118] dark:text-[#efc9a5] focus:outline-none"
          >
            <option value="all">All Salon Branches</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            value={reportRange}
            onChange={(e) => setReportRange(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-[#201511] border border-[#E8DFD5] dark:border-[#3a2820] rounded-xl text-xs text-[#2B2118] dark:text-[#efc9a5] focus:outline-none"
          >
            <option value="week">Current Week</option>
            <option value="month">Current Month (Nov 2026)</option>
            <option value="quarter">Q4 2026</option>
            <option value="all">Full Lifetime</option>
          </select>

          <Button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-[#2B2118] hover:bg-[#1D1610] text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 4 Macro Domain KPI Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Consolidated Revenue</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#2B2118] dark:text-[#efc9a5] mt-1">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Verified financial transactions</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Total Appointments</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#2B2118] dark:text-[#f5eee6] mt-1">
            {totalAppointments}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{completionRate}% Completed</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Client Retention</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#2B2118] dark:text-[#efc9a5] mt-1">
            {retentionRate}%
          </p>
          <p className="text-[10px] text-[#7A6658] dark:text-[#a89582] mt-1">Repeat visits across quarters</p>
        </Card>

        <Card className="p-4 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] shadow-xs">
          <p className="text-[11px] uppercase tracking-wider text-[#7A6658] dark:text-[#a89582] font-semibold">Cancellation Rate</p>
          <p className="font-['Montserrat'] text-2xl font-light text-[#2B2118] dark:text-[#f5eee6] mt-1">
            {cancellationRate}%
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{cancelledAppointments} total cancellations</p>
        </Card>
      </div>

      {/* Grid: Revenue by Ritual & Artisan Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Revenue Distribution */}
        <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8DFD5] dark:border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#2B2118] dark:text-[#f5eee6]">
                Revenue by Service Category
              </h2>
              <p className="text-xs text-[#7A6658] dark:text-[#a89582]">Gross treatment tariff contribution</p>
            </div>
          </div>

          <div className="space-y-3">
            {revenueByService.map(item => {
              const pct = totalRevenue > 0 ? ((item.total / totalRevenue) * 100).toFixed(0) : '0';
              return (
                <div key={item.serviceName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#2B2118] dark:text-[#f5eee6]">{item.serviceName} ({item.count} sessions)</span>
                    <span className="font-mono font-semibold text-[#B99470] dark:text-[#efc9a5]">₹{item.total.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#FAF8F5] dark:bg-white/5 border border-[#E8DFD5] dark:border-transparent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B99470] to-[#E8D8C7] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Artisan Productivity & Commission */}
        <Card className="p-6 bg-white dark:bg-[#201511] border-[#E8DFD5] dark:border-[#3a2820] space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8DFD5] dark:border-white/10">
            <div>
              <h2 className="font-['Montserrat'] text-base font-light text-[#2B2118] dark:text-[#f5eee6]">
                Artisan Productivity & Payroll
              </h2>
              <p className="text-xs text-[#7A6658] dark:text-[#a89582]">Performance ranking and earned commissions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2B2118] dark:text-[#c2b3a3]">
              <thead>
                <tr className="border-b border-[#E8DFD5] dark:border-white/10 text-[#7A6658] dark:text-[#a89582] uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-2">Artisan</th>
                  <th className="pb-2">Rituals</th>
                  <th className="pb-2">Gross Revenue</th>
                  <th className="pb-2 text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5]/60 dark:divide-white/5">
                {employeePerformance.map(e => (
                  <tr key={e.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5">
                      <p className="font-semibold text-[#2B2118] dark:text-[#f5eee6]">{e.name}</p>
                      <p className="text-[10px] text-[#7A6658] dark:text-[#a89582]">{e.title}</p>
                    </td>
                    <td className="py-2.5 font-semibold text-[#2B2118] dark:text-[#f5eee6]">{e.appointments}</td>
                    <td className="py-2.5 font-mono text-[#B99470] dark:text-[#efc9a5]">₹{e.revenue.toLocaleString()}</td>
                    <td className="py-2.5 font-mono text-emerald-600 dark:text-emerald-400 text-right">₹{e.commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
