import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser && storedUser.name) {
        setUser(storedUser);
      }
    } catch {}
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-[32px] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#fcf4f2] shadow-sm border border-gray-200">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cc3b38]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2c7a94]/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up">
        
        {/* Center Clinic Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#fcebeb] blur-xl rounded-full animate-pulse" />
          <div className="relative w-32 h-32 rounded-[28px] border border-[#fcebeb] bg-white flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Icons.Stethoscope size={56} className="text-[#cc3b38]" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="font-['Inter'] text-[20px] sm:text-[24px] text-[#2c7a94] font-bold tracking-[0.2em] mb-2 uppercase">
          Welcome To
        </h2>
        
        <h1 className="font-['Playfair_Display'] text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-[#1f2937] leading-none tracking-tight mb-6">
          SHARNAM CLINIC
        </h1>

        <div className="flex items-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#cc3b38]" />
          <span className="font-['Inter'] text-[13px] text-[#cc3b38] font-bold tracking-[0.2em] uppercase">
            Admin Portal
          </span>
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#cc3b38]" />
        </div>

        {user && (
          <p className="mt-8 font-['Inter'] text-gray-500 text-[15px] bg-white/60 px-6 py-2 rounded-full border border-gray-100 shadow-sm">
            Logged in as <span className="text-[#1f2937] font-bold">{user.name}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
