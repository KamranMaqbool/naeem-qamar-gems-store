import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';

export default function Layout() {
  return (
    <div className="bg-[#F8FAFC] text-on-surface flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen">
        <TopNavBar />
        <main className="flex-1 mt-16 p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}