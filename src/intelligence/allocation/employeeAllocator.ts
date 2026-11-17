/**
 * Employee Allocation & Workload Balancing Engine
 * Analyzes workstation and bay utilization, detects artisan burnout risks,
 * and suggests intelligent slot rebalancing.
 */

import { db } from '../../database/db';
import type { StaffAllocationResult, StaffWorkloadAnalysis } from '../types';
import { ModelRegistry } from '../models/modelRegistry';
import { IntelligenceMonitor } from '../monitoring/intelligenceMonitor';

export class EmployeeAllocator {
  private static readonly MODEL_ID = 'workforce-allocator-v1';

  /**
   * Analyze staff allocation and bay utilization for a date
   */
  public static analyzeAllocation(
    salonId: string,
    date: string = new Date().toISOString().split('T')[0]
  ): StaffAllocationResult {
    IntelligenceMonitor.recordInferenceCall('employee_allocation');

    const staffList = db.getStaffBySalon(salonId).filter(s => s.isActive !== false);
    const appointments = db.getAppointmentsBySalon(salonId).filter(a => 
      a.appointmentDate === date && 
      a.status !== 'cancelled' && 
      a.status !== 'no_show'
    );
    const branches = db.getBranchesBySalon(salonId);
    const services = db.getServicesBySalon(salonId);

    const allocations: StaffWorkloadAnalysis[] = [];
    const shiftHoursStandard = 8;

    for (const staff of staffList) {
      const branchName = branches.find(b => b.id === staff.branchId)?.name || 'Flagship';
      const staffApts = appointments.filter(a => a.staffId === staff.id);
      
      const totalBookedMinutes = staffApts.reduce((sum, a) => sum + (Number(a.durationMinutes) || 60), 0);
      const bookedHours = Math.round((totalBookedMinutes / 60) * 10) / 10;
      const utilizationRate = Math.min(100, Math.round((bookedHours / shiftHoursStandard) * 100));

      let status: 'optimal' | 'underutilized' | 'overloaded' = 'optimal';
      let alert: string | undefined;

      if (utilizationRate >= 85) {
        status = 'overloaded';
        alert = 'Workstation density above 85%. Client wait risk elevated; consider rebalancing later slots.';
      } else if (utilizationRate < 45) {
        status = 'underutilized';
        alert = 'Available workstation capacity. Ideal for accepting walk-in queue or rebalanced bookings.';
      }

      // Qualified rituals
      const qualifiedRitualNames = (staff.servicesOffered || [])
        .map(id => services.find(s => s.id === id)?.name)
        .filter(Boolean) as string[];

      allocations.push({
        staffId: staff.id,
        staffName: staff.displayName,
        branchName,
        activeHours: shiftHoursStandard,
        bookedHours,
        utilizationRate,
        status,
        alert,
        recommendedRituals: qualifiedRitualNames.slice(0, 3),
      });
    }

    // Identify Suggested Rebalancing
    const suggestedRebalancing: StaffAllocationResult['suggestedRebalancing'] = [];
    const overloadedStaff = allocations.filter(a => a.status === 'overloaded');
    const underutilizedStaff = allocations.filter(a => a.status === 'underutilized');

    for (const overloaded of overloadedStaff) {
      const underutilized = underutilizedStaff.find(u => u.branchName === overloaded.branchName);
      if (underutilized) {
        // Find an appointment assigned to overloaded staff that can be shifted
        const candidateApt = appointments.find(a => a.staffId === overloaded.staffId);
        if (candidateApt) {
          suggestedRebalancing.push({
            fromStaffId: overloaded.staffId,
            toStaffId: underutilized.staffId,
            appointmentId: candidateApt.id,
            reason: `Rebalance workload: ${overloaded.staffName} is at ${overloaded.utilizationRate}% while ${underutilized.staffName} has available capacity at ${underutilized.utilizationRate}%.`,
          });
        }
      }
    }

    const totalUtil = allocations.reduce((sum, a) => sum + a.utilizationRate, 0);
    const averageBayUtilization = allocations.length > 0 ? Math.round(totalUtil / allocations.length) : 65;

    ModelRegistry.recordInference(this.MODEL_ID, 0.95);

    return {
      allocations,
      suggestedRebalancing,
      averageBayUtilization,
    };
  }
}
