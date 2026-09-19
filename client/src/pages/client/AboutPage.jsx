import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BusinessCard from '../../components/client/BusinessCard';
import api from '../../utils/api';

const AboutPage = () => {
  const pageRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos]);

  // Fetch live clinic photos from database
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get('/clinic-photos');
        if (res.data?.status && Array.isArray(res.data.result) && res.data.result.length > 0) {
          const activePhotos = res.data.result
            .filter((p) => p.isStatus === 1 || p.isStatus === undefined)
            .map((p) => ({
              url: p.imageUrl || p.image_url,
              title: p.title,
              desc: p.description,
            }));
          if (activePhotos.length > 0) {
            setPhotos(activePhotos);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch live clinic photos, using fallback:', err);
      }
    };
    fetchPhotos();
  }, []);

  const whyChooseUsList = [
    {
      icon: 'psychology',
      title: 'Individualized Constitutional Analysis',
      desc: 'We evaluate physical, emotional, and lifestyle aspects to formulate personalized homeopathic medicine specifically suited for your unique constitution.',
    },
    {
      icon: 'shield',
      title: '100% Safe & Zero Side Effects',
      desc: 'Homeopathic remedies are non-toxic, non-addictive, and suitable for newborns, pregnant women, elderly individuals, and sensitive patients.',
    },
    {
      icon: 'target',
      title: 'Root-Cause Treatment Approach',
      desc: 'Rather than suppressing surface symptoms with temporary painkillers or steroids, we focus on curing the underlying cause of disease.',
    },
    {
      icon: 'clinical_notes',
      title: 'In-Depth Case Consultation',
      desc: 'Dr. Dhairya Mehta dedicates substantial time to understand patient health history, family predispositions, and dietary habits during every consultation.',
    },
    {
      icon: 'autorenew',
      title: 'Prevent Recurrence of Chronic Illness',
      desc: 'By strengthening the body’s innate immune system, our therapies help prevent frequent relapses of allergies, asthma, skin rashes, and acidity.',
    },
    {
      icon: 'volunteer_activism',
      title: 'Compassionate Patient Care',
      desc: 'We prioritize patient comfort, confidential medical record keeping, and clear communication throughout your health recovery journey.',
    },
  ];

  

  return (
    <div ref={pageRef} className="bg-[#faf7f5] pb-20 text-[#1f2937]">
      {/* 1. Header Banner & Profile */}
      <header className="pt-12 pb-16 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          <div className="col-span-12 lg:col-span-7 reveal active space-y-4 w-full">
            <span className="inline-block px-4 py-1.5 bg-[#fcebeb] text-[#cc3b38] rounded-full font-['Inter'] text-[13px] font-bold uppercase tracking-wider">
              Practitioner Profile & Clinic Story
            </span>
            <h1 className="font-['Playfair_Display'] text-[36px] md:text-[48px] font-bold text-[#1f2937] leading-tight">
              About <span className="text-[#cc3b38]">Sharnam Homeopathy</span>
            </h1>
            <p className="font-['Inter'] text-[18px] font-medium text-[#2c7a94]">
              Lead Physician: Dr. Dhairya Urmish Mehta (BHMS, C.C.H, B.L.S)
            </p>
            <p className="font-['Inter'] text-[16px] text-[#4b5563] leading-relaxed max-w-2xl">
              Sharnam Homeopathy & Wellness Clinic was founded with a single mission: to provide genuine, root-cause healing through authentic homeopathic science. Registered under Reg. No: G-30237, Dr. Dhairya Mehta combines classic Hahnemannian principles with modern clinical diagnostics to deliver compassionate healthcare in Vadodara.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-[#cc3b38] text-white px-6 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#b52f2c] transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                Contact Us
              </Link>
              <Link
                to="/services"
                className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-white hover:border-[#cc3b38] transition-all"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 reveal active flex justify-center w-full">
            <div className="w-full max-w-md">
              <BusinessCard />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Clinic History & Values */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="reveal space-y-4">
            <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block">
              Our Clinical Philosophy
            </span>
            <h2 className="font-['Playfair_Display'] text-[32px] font-bold text-[#1f2937]">
              Rooted in Classic Homeopathic Science
            </h2>
            <p className="font-['Inter'] text-[15px] text-[#4b5563] leading-relaxed">
              At Sharnam Clinic, we treat the individual, not merely the disease label. Every patient brings a distinct combination of symptoms, temperaments, emotional triggers, and physiological patterns.
            </p>
            <p className="font-['Inter'] text-[15px] text-[#4b5563] leading-relaxed">
              By prescribing carefully researched single remedies and potencies, we help stimulate the body's natural defense systems to resolve chronic disorders permanently.
            </p>
          </div>

          <div className="reveal bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1f2937] border-b border-gray-100 pb-4">
              Core Principles at Sharnam
            </h3>
            <div className="space-y-4 font-['Inter'] text-[14px]">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#1f2937] block">Similia Similibus Curentur</strong>
                  <span className="text-[#6b7280]">Like cures like: matching symptom patterns with constitutional remedies.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#e6f4f8] text-[#2c7a94] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#1f2937] block">Minimum Dose Precision</strong>
                  <span className="text-[#6b7280]">Administering only the gentle potency required to spark the natural healing response.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#1f2937] block">Holistic Totality of Symptoms</strong>
                  <span className="text-[#6b7280]">Evaluating lifestyle, mental stress, sleep, and physical symptoms together.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed "Why Choose Sharnam Clinic" */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal">
            <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block mb-2">
              Why Patients Choose Us
            </span>
            <h2 className="font-['Playfair_Display'] text-[32px] sm:text-[40px] font-bold text-[#1f2937]">
              Six Distinct Reasons for Choosing Sharnam
            </h2>
            <p className="font-['Inter'] text-[16px] text-[#4b5563] mt-3">
              We provide the highest quality homeopathic consultation and treatment tailored for every family member.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsList.map((item, idx) => (
              <div
                key={item.title}
                className="bg-[#faf7f5] p-8 rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#cc3b38] transition-all reveal"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-[#cc3b38] flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1f2937] mb-3">
                  {item.title}
                </h3>
                <p className="font-['Inter'] text-[14px] text-[#4b5563] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* 5. Clinic Photos (Loaded Dynamically from Admin Clinic Photos Table) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="text-[#2c7a94] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block mb-2">
            Our Facility
          </span>
          <h2 className="font-['Playfair_Display'] text-[32px] font-bold text-[#1f2937]">
            Clinic Photos & Environment
          </h2>
          <p className="font-['Inter'] text-[16px] text-[#4b5563] mt-2">
            Take a look inside our clean, hygienic, and welcoming clinic space in Vasna - Bhayli, Vadodara.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photos.map((photo, idx) => (
            <div
              key={photo.title || idx}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm reveal group hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Playfair_Display'] text-[18px] font-bold text-[#1f2937] mb-1">
                  {photo.title}
                </h3>
                {photo.desc && (
                  <p className="font-['Inter'] text-[13px] text-[#6b7280]">
                    {photo.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
