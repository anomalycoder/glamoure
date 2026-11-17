import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { SalonBranch } from '../types/salon';
import { db } from '../database/db';
import { useAuth } from './AuthContext';

interface BranchContextType {
  selectedBranchId: string; // 'all' or branch id
  setSelectedBranchId: (branchId: string) => void;
  selectedBranch: SalonBranch | null;
  branches: SalonBranch[];
  isBranchMatch: (targetBranchId?: string) => boolean;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const STORAGE_KEY = 'glamoure_active_branch_id';

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, currentSalonId, user } = useAuth();
  const salonId = currentSalonId || 'salon-glamoure-jubilee';

  // Load all salon branches from database
  const allSalonBranches = useMemo(() => {
    return db.getBranchesBySalon(salonId);
  }, [salonId]);

  // If member, filter to only the branch(es) they are assigned to
  const permittedBranches = useMemo(() => {
    if (role === 'salon_member' && user) {
      const staffProfile = db.getAllStaff(salonId).find(s => s.userId === user.id);
      if (staffProfile?.branchId) {
        return allSalonBranches.filter(b => b.id === staffProfile.branchId);
      }
    }
    return allSalonBranches;
  }, [role, user, allSalonBranches, salonId]);

  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Fallback
    }
    return 'all';
  });

  // Ensure member cannot stay in 'all' or an unauthorized branch
  useEffect(() => {
    if (role === 'salon_member') {
      const allowedIds = permittedBranches.map(b => b.id);
      if (selectedBranchId === 'all' || !allowedIds.includes(selectedBranchId)) {
        if (permittedBranches.length > 0) {
          setSelectedBranchIdState(permittedBranches[0].id);
        }
      }
    }
  }, [role, permittedBranches, selectedBranchId]);

  const setSelectedBranchId = (id: string) => {
    setSelectedBranchIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  const selectedBranch = useMemo(() => {
    if (selectedBranchId === 'all') return null;
    return allSalonBranches.find(b => b.id === selectedBranchId) || null;
  }, [selectedBranchId, allSalonBranches]);

  const isBranchMatch = (targetBranchId?: string): boolean => {
    if (!targetBranchId) return true;
    if (selectedBranchId === 'all') return true;
    return targetBranchId === selectedBranchId;
  };

  return (
    <BranchContext.Provider
      value={{
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,
        branches: permittedBranches,
        isBranchMatch,
        isLoading: false,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
