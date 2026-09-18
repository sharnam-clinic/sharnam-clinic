import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    {
      label: 'Total Patients',
      value: '1,248',
      change: '+14% this month',
      icon: Icons.Users,
      color: 'text-[#cc3b38]',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      label: 'Appointments Today',
      value: '42',
      change: '8 pending check-ins',
      icon: Icons.CalendarCheck,
      color: 'text-[#2c7a94]',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
    {
      label: 'Active Staff & Doctors',
      value: '18',
      change: '100% attendance',
      icon: Icons.Stethoscope,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ];

  const quickModules = [
    {
      title: 'Clinic Photos (Our Facility)',
      description: 'Manage clinic ambiance, consultation room, and facility pictures displayed on the website.',
      path: '/admin/clinic-photos',
      icon: Icons.Image,
      count: 'Facility Gallery',
      color: 'bg-red-50 text-[#cc3b38]',
    },
    {
      title: 'Services & Treatments',
      description: 'Update the list of homeopathic services, descriptions, and treatment approaches.',
      path: '/admin/services',
      icon: Icons.Activity,
      count: 'Active Services',
      color: 'bg-teal-50 text-[#2c7a94]',
    },
    {
      title: 'Health Conditions',
      description: 'Add and edit conditions treated, symptoms, and constitutional remedies offered.',
      path: '/admin/health-conditions',
      icon: Icons.HeartPulse,
      count: 'Health Directory',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="w-full space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#cc3b38] text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#cc3b38] animate-pulse"></span>
            Clinic Administration
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Administrator'}!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here is your clinic overview and dynamic website content controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 transition-colors"
          >
            <Icons.ExternalLink size={16} />
            View Live Website
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {stat.value}
                </p>
                <span className="inline-block text-xs font-medium text-gray-500 mt-2">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Modules Quick Shortcuts */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Dynamic Content Management</h3>
          <p className="text-xs text-gray-500">Quickly update and maintain live website sections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:border-[#cc3b38]/40 transition-all group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    <Icon size={24} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-[#cc3b38] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">{item.count}</span>
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#cc3b38] hover:text-[#b52f2c] transition-colors"
                  >
                    Open Module
                    <Icons.ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
