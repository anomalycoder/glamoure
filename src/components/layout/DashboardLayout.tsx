import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { NotificationToastContainer } from '../ui/NotificationToast';
import { UiThemeProvider } from '../ui/ThemeContext';

export const DashboardLayout: React.FC = () => {
  return (
    <UiThemeProvider theme="dark">
      <div className="min-h-screen flex bg-[#16110e] font-['Plus_Jakarta_Sans'] text-[#f5eee6] selection:bg-[#b99470]/30 selection:text-white">
        {/* Role-Aware Responsive Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#16110e]">
          <TopNav />

          <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* Floating System Notification Toasts */}
        <NotificationToastContainer />
      </div>
    </UiThemeProvider>
  );
};
