import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const FloatingIcon = ({ icons, initialClass, style }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Automatically change the shape every 3 seconds
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [icons.length]);

  const Icon = icons[index];

  return (
    <div
      onClick={() => setIndex((index + 1) % icons.length)}
      className={`absolute cursor-pointer transition-all duration-700 ease-out z-0 hover:scale-110 hover:opacity-[0.3] pointer-events-auto ${initialClass} ${index > 0 ? 'text-[#2c7a94] scale-110 rotate-[360deg] opacity-[0.2]' : 'text-[#cc3b38] opacity-[0.15]'
        }`}
      style={style}
    >
      <Icon className="w-full h-full" />
    </div>
  );
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser && storedUser.name) {
        setUser(storedUser);
      }
    } catch { }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-[32px] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#fcf4f2] shadow-sm border border-gray-200">

      {/* Custom Keyframes for Floating Animation */}
      <style>
        {`
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(15deg); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(45deg); }
            50% { transform: translateY(-40px) rotate(20deg); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) rotate(-15deg); }
            50% { transform: translateY(25px) rotate(-30deg); }
          }
          .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
          .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
          .animate-float-3 { animation: float-3 9s ease-in-out infinite; }
        `}
      </style>

      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cc3b38]/5 rounded-full blur-[80px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2c7a94]/10 rounded-full blur-[60px] pointer-events-none z-0" />

      {/* Floating Medical Icons Background */}
      <div className="absolute inset-0 overflow-hidden select-none pointer-events-none z-0">
        <FloatingIcon
          icons={[Icons.Activity, Icons.HeartPulse, Icons.Zap, Icons.Heart]}
          initialClass="bottom-[10%] left-[8%] w-32 h-32 animate-float-1"
          style={{ animationDelay: '0s' }}
        />
        <FloatingIcon
          icons={[Icons.Pill, Icons.FlaskConical, Icons.Beaker, Icons.Dna]}
          initialClass="top-[10%] right-[8%] w-24 h-24 animate-float-2"
          style={{ animationDelay: '1s' }}
        />
        <FloatingIcon
          icons={[Icons.Plus, Icons.ShieldPlus, Icons.Crosshair, Icons.BadgePlus]}
          initialClass="bottom-[10%] right-[10%] w-28 h-28 animate-float-3"
          style={{ animationDelay: '2s' }}
        />
        <FloatingIcon
          icons={[Icons.Stethoscope, Icons.Microscope, Icons.Bone, Icons.Tablets]}
          initialClass="top-[12%] left-[10%] w-32 h-32 animate-float-1"
          style={{ animationDelay: '3s' }}
        />
        <FloatingIcon
          icons={[Icons.Syringe, Icons.TestTube, Icons.Droplet, Icons.Bandage]}
          initialClass="top-[45%] left-[5%] w-24 h-24 animate-float-3"
          style={{ animationDelay: '1.5s' }}
        />
        <FloatingIcon
          icons={[Icons.Cross, Icons.BaggageClaim, Icons.ClipboardPlus, Icons.Thermometer]}
          initialClass="top-[45%] right-[5%] w-24 h-24 animate-float-2"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-up pointer-events-none">

        {/* Welcome Text */}
        <h2 className="font-['Inter'] text-[20px] sm:text-[24px] text-[#2c7a94] font-bold tracking-[0.2em] mb-2 uppercase">
          Welcome To
        </h2>

        <h1 className="font-['Playfair_Display'] text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-[#1f2937] leading-none tracking-tight mb-6 cursor-default">
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
          <p className="mt-8 font-['Inter'] text-gray-500 text-[15px] bg-white/60 px-6 py-2 rounded-full border border-gray-100 shadow-sm cursor-default">
            Logged in as <span className="text-[#1f2937] font-bold">{user.name}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
