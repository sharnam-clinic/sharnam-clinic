import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BusinessCard from '../../components/client/BusinessCard';

const AboutPage = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

  const clinicStats = [
    { number: '10+', label: 'Years of Clinical Practice' },
    { number: '5,000+', label: 'Satisfied Patients Healed' },
    { number: '98%', label: 'Positive Health Outcomes' },
    { number: '15+', label: 'Condition Specialties' },
  ];

  const clinicPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      title: 'Consultation Room',
      desc: 'Private, comfortable setting for detailed constitutional case-taking.',
    },
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      title: 'Reception & Waiting Lounge',
      desc: 'Warm and serene atmosphere designed for patient peace of mind.',
    },
    {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      title: 'Homeopathic Pharmacy',
      desc: 'Authentic high-potency remedies prepared under strict hygiene standards.',
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
              <a
                href="tel:+916355548616"
                className="border border-[#2c7a94] text-[#2c7a94] px-6 py-3 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#e6f4f8] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                +91 6355 548 616
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 reveal active flex justify-center w-full" style={{ transitionDelay: '150ms' }}>
            <BusinessCard />
          </div>
        </div>
      </header>

      {/* 2. Clinic History, Story, Mission & Vision */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Our Story */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm reveal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">history_edu</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-[28px] font-bold text-[#1f2937] mb-4">
                Our History & Journey
              </h2>
              <p className="font-['Inter'] text-[15px] text-[#4b5563] leading-relaxed space-y-3">
                Established in Vasna - Bhayli, Vadodara, Sharnam Clinic started with the belief that healthcare should be personalized, non-invasive, and focused on long-term wellness. Over the past decade, we have helped thousands of patients suffering from stubborn chronic ailments regain their health naturally.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 font-['Inter'] text-[14px] text-[#2c7a94] font-semibold">
              Serving Vadodara & Surrounding Regions
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm reveal flex flex-col justify-between" style={{ transitionDelay: '150ms' }}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4f8] text-[#2c7a94] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">visibility</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-[28px] font-bold text-[#1f2937] mb-4">
                Mission & Vision
              </h2>
              <div className="space-y-4 font-['Inter'] text-[15px] text-[#4b5563] leading-relaxed">
                <div>
                  <h4 className="font-bold text-[#1f2937] text-[16px] mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#cc3b38]" />
                    Our Mission
                  </h4>
                  <p>To restore individual health safely, quickly, and permanently by employing individualised homeopathic remedies based on sound scientific principles.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1f2937] text-[16px] mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2c7a94]" />
                    Our Vision
                  </h4>
                  <p>To be the premier choice for holistic healthcare in Gujarat, recognized for clinical excellence, patient trust, and ethical medical practice.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 font-['Inter'] text-[14px] text-[#cc3b38] font-semibold">
              Patient-Centric Care Excellence
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us (Full Detailed List — Lives ONLY Here) */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 reveal">
            <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] uppercase tracking-widest block mb-2">
              Why Choose Sharnam Clinic
            </span>
            <h2 className="font-['Playfair_Display'] text-[32px] sm:text-[40px] font-bold text-[#1f2937]">
              The Sharnam Advantage
            </h2>
            <p className="font-['Inter'] text-[16px] text-[#4b5563] mt-3">
              Discover what sets our homeopathic practice apart and why hundreds of families trust us with their health.
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

      {/* 4. Clinic Stats */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#2c7a94] to-[#1e576b] text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 shadow-xl reveal">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {clinicStats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <span className="font-['Playfair_Display'] text-[40px] sm:text-[52px] font-bold block leading-none">
                  {stat.number}
                </span>
                <span className="font-['Inter'] text-[14px] sm:text-[15px] text-white/90 font-medium block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Clinic Photos */}
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
          {clinicPhotos.map((photo, idx) => (
            <div
              key={photo.title}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm reveal group"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-['Playfair_Display'] text-[20px] font-bold text-[#1f2937] mb-1">
                  {photo.title}
                </h3>
                <p className="font-['Inter'] text-[14px] text-[#4b5563]">
                  {photo.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
