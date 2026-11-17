import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { NotificationToastContainer } from '../ui/NotificationToast';
import { UiThemeProvider, useUiTheme } from '../ui/ThemeContext';

export const DashboardLayout: React.FC = () => {
  return (
    <UiThemeProvider defaultTheme="light">
      <DashboardLayoutInner />
    </UiThemeProvider>
  );
};

const DashboardLayoutInner: React.FC = () => {
  const theme = useUiTheme();

  return (
    <div className={`min-h-screen flex font-['Plus_Jakarta_Sans'] transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-[#16110e] text-[#f5eee6] selection:bg-[#b99470]/30 selection:text-white' 
        : 'bg-[#FAF7F2] text-[#41332B] selection:bg-[#E8D8C7] selection:text-[#41332B]'
    }`}>
      {/* Role-Aware Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#16110e]' : 'bg-[#FAF7F2]'
      }`}>
        <TopNav />

        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating System Notification Toasts */}
      <NotificationToastContainer />
    </div>
  );
};
