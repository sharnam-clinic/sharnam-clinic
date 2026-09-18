import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const HomePage = () => {
  const pageRef = useRef(null);
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
  );
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [featuredServices]);

  // Fetch live photos and services from database
  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const [photosRes, servicesRes] = await Promise.all([
          api.get('/clinic-photos'),
          api.get('/services'),
        ]);

        if (photosRes.data?.status && Array.isArray(photosRes.data.result) && photosRes.data.result.length > 0) {
          const first = photosRes.data.result[0];
          if (first?.imageUrl || first?.image_url) {
            setHeroImage(first.imageUrl || first.image_url);
          }
        }

        if (servicesRes.data?.status && Array.isArray(servicesRes.data.result)) {
          const active = servicesRes.data.result.filter((s) => s.isStatus === 1 || s.isStatus === undefined);
          setFeaturedServices(active.slice(0, 3));
        }
      } catch (err) {
        console.warn('Failed to load live home data:', err);
      }
    };

    fetchLiveContent();
  }, []);

  return (
    <div ref={pageRef} className="bg-[#fff8f7] min-h-screen text-[#1f2937] pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-[#fff8f7] to-[#fcf4f2] border-b border-[#e5d8d6]">
        {/* Background Decorative Blur Blobs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#fcebeb] rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-80 h-80 bg-[#e6f4f8] rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          <div className="col-span-12 lg:col-span-7 space-y-5 sm:space-y-6 reveal active w-full">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcebeb] text-[#cc3b38] font-['Inter'] text-[12px] sm:text-[13px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#cc3b38] animate-pulse" />
              Welcome to Sharnam Homeopathy & Wellness Clinic
            </span>

            <h1 className="font-['Playfair_Display'] text-[30px] sm:text-[48px] lg:text-[58px] font-extrabold text-[#1f2937] leading-[1.15] tracking-tight">
              Holistic Healing for <br className="hidden sm:block" />
              <span className="text-[#cc3b38] underline decoration-[#fcebeb] underline-offset-8">
                Mind, Body & Soul
              </span>
            </h1>

            <p className="font-['Inter'] text-[15px] sm:text-[18px] text-[#4b5563] leading-relaxed max-w-2xl font-normal">
              Empowering your body’s natural ability to heal with safe, constitutional homeopathic treatments tailored by experienced practitioners. Experience gentle, root-cause care for long-lasting health.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Link
                to="/contact"
                className="bg-[#cc3b38] text-white px-6 py-3.5 rounded-xl font-['Inter'] text-[14px] sm:text-[15px] font-semibold shadow-lg hover:bg-[#b52f2c] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-center"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                Contact Us Today
              </Link>
              <Link
                to="/services"
                className="bg-white border-2 border-[#2c7a94] text-[#2c7a94] px-6 py-3.5 rounded-xl font-['Inter'] text-[14px] sm:text-[15px] font-semibold shadow-sm hover:bg-[#e6f4f8] transition-all flex items-center justify-center gap-2 text-center"
              >
                Explore Services
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-5 border-t border-gray-200/80 grid grid-cols-3 gap-2 sm:gap-4 font-['Inter'] text-center sm:text-left">
              <div>
                <span className="block text-[18px] sm:text-[22px] font-bold text-[#1f2937]">10+ Years</span>
                <span className="text-[11px] sm:text-[13px] text-[#6b7280]">Experience</span>
              </div>
              <div>
                <span className="block text-[18px] sm:text-[22px] font-bold text-[#cc3b38]">5,000+</span>
                <span className="text-[11px] sm:text-[13px] text-[#6b7280]">Patients</span>
              </div>
              <div>
                <span className="block text-[18px] sm:text-[22px] font-bold text-[#2c7a94]">100% Safe</span>
                <span className="text-[11px] sm:text-[13px] text-[#6b7280]">Remedies</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Illustration / Card */}
          <div className="col-span-12 lg:col-span-5 reveal active flex justify-center w-full" style={{ transitionDelay: '150ms' }}>
            <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#f0e6e4]">
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-4/3 bg-[#f8f4f2]">
                <img
                  src={heroImage}
                  alt="Sharnam Clinic Consultation Room"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-['Playfair_Display'] font-bold text-[18px]">Sharnam Clinic • Vadodara</p>
                  <p className="font-['Inter'] text-[12px] opacity-90">Constitutional Homeopathy Center</p>
                </div>
              </div>

              <div className="space-y-3 bg-[#faf7f5] p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fcebeb] flex items-center justify-center text-[#cc3b38] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">medical_services</span>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[14px] font-bold text-[#1f2937]">Dr. Dhairya Urmish Mehta</p>
                    <p className="font-['Inter'] text-[12px] text-[#6b7280]">BHMS, C.C.H, B.L.S • Reg No. G-30237</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CLINICAL SERVICES (Loaded dynamically from database) */}
      {featuredServices.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 reveal">
            <div>
              <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block mb-2">
                Specialized Treatments
              </span>
              <h2 className="font-['Playfair_Display'] text-[30px] sm:text-[38px] font-bold text-[#1f2937]">
                Featured Clinical Care
              </h2>
            </div>
            <Link
              to="/services"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-[#cc3b38] font-['Inter'] font-semibold text-[14px] hover:underline"
            >
              View Full Service Catalog <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="bg-white p-7 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#cc3b38] transition-all flex flex-col justify-between reveal"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-[26px]">
                      {srv.icon || 'medical_services'}
                    </span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1f2937] mb-2">
                    {srv.name}
                  </h3>
                  <p className="font-['Inter'] text-[14px] text-[#4b5563] line-clamp-3 leading-relaxed mb-4">
                    {srv.description}
                  </p>
                </div>
                <Link
                  to="/services"
                  className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#cc3b38] hover:underline"
                >
                  <span>Learn More</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. NAVIGATION TEASERS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block mb-2">
            Discover Our Clinic
          </span>
          <h2 className="font-['Playfair_Display'] text-[32px] sm:text-[40px] font-bold text-[#1f2937]">
            Everything You Need for Holistic Health
          </h2>
          <p className="font-['Inter'] text-[16px] text-[#4b5563] mt-3">
            Explore our specialized departments, meet our expert physician, or dive into our disease knowledge base.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Teaser 1: Explore Our Services */}
          <Link
            to="/services"
            className="group bg-white p-8 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#cc3b38] transition-all duration-300 flex flex-col justify-between reveal"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[30px]">healing</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1f2937] mb-3 group-hover:text-[#cc3b38] transition-colors">
                Explore Our Services →
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#4b5563] leading-relaxed">
                Customized homeopathic care for chronic skin, allergy, respiratory, and digestive health.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center font-['Inter'] text-[14px] font-semibold text-[#cc3b38]">
              View All Services
              <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>

          {/* Teaser 2: Health Info Library */}
          <Link
            to="/health-info"
            className="group bg-white p-8 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#cc3b38] transition-all duration-300 flex flex-col justify-between reveal"
            style={{ transitionDelay: '100ms' }}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[30px]">local_library</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1f2937] mb-3 group-hover:text-[#cc3b38] transition-colors">
                Health Info Library →
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#4b5563] leading-relaxed">
                Comprehensive guide on symptoms, causes, and prevention for various common health conditions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center font-['Inter'] text-[14px] font-semibold text-[#cc3b38]">
              Read Health Guides
              <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>

          {/* Teaser 3: About Our Clinic */}
          <Link
            to="/about"
            className="group bg-white p-8 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#2c7a94] transition-all duration-300 flex flex-col justify-between reveal"
            style={{ transitionDelay: '200ms' }}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] text-[#2c7a94] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[30px]">domain</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1f2937] mb-3 group-hover:text-[#2c7a94] transition-colors">
                About Our Clinic →
              </h3>
              <p className="font-['Inter'] text-[14px] text-[#4b5563] leading-relaxed">
                Discover our history, mission, facility gallery, and detailed reasons to choose Sharnam Clinic.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center font-['Inter'] text-[14px] font-semibold text-[#2c7a94]">
              Learn About Us
              <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
        <div className="bg-gradient-to-r from-[#1f2937] via-[#2c3e50] to-[#1f2937] text-white rounded-[32px] p-8 sm:p-14 shadow-2xl relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#cc3b38]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-block px-3.5 py-1 bg-[#cc3b38] text-white text-[12px] font-bold uppercase tracking-wider rounded-full font-['Inter']">
              Get In Touch
            </span>

            <h2 className="font-['Playfair_Display'] text-[32px] sm:text-[44px] font-bold leading-tight">
              Ready to Start Your Journey to Holistic Recovery?
            </h2>

            <p className="font-['Inter'] text-[16px] sm:text-[18px] text-gray-300 leading-relaxed">
              Contact Dr. Dhairya Mehta at Sharnam Clinic for a comprehensive constitutional health assessment.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="bg-[#cc3b38] text-white px-8 py-4 rounded-xl font-['Inter'] text-[16px] font-semibold shadow-lg hover:bg-[#b52f2c] transition-all transform hover:scale-[1.02] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                Contact Us & Clinic Location
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
