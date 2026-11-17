import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { NotificationToastContainer } from '../ui/NotificationToast';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#FAF6F1] font-['Plus_Jakarta_Sans'] text-[#241812]">
      {/* Role-Aware Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNav />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating System Notification Toasts */}
      <NotificationToastContainer />
    </div>
  );
};
