import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

