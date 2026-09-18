import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const DEFAULT_SERVICES = [
  {
    id: 1,
    category: 'skin',
    icon: 'dermatology',
    name: 'Skin & Hair Care Therapy',
    description: 'Comprehensive homeopathic treatment for chronic skin conditions, scalp ailments, and allergic dermatitis without steroid creams.',
    whatsIncluded: [
      'Adult & Teenage Acne / Pimples Treatment',
      'Eczema & Atopic Dermatitis Relief',
      'Psoriasis & Scalp Flaking Management',
      'Urticaria & Skin Allergy Care',
      'Hair Loss, Alopecia & Dandruff Control',
    ],
    approach: 'Addresses internal hormonal imbalance and immune sensitivity to achieve long-lasting clear skin.',
  },
  {
    id: 2,
    category: 'respiratory',
    icon: 'air',
    name: 'Respiratory & ENT Care',
    description: 'Strengthening natural lung immunity and nasal defense to prevent recurring seasonal allergies, sinus pressure, and wheezing.',
    whatsIncluded: [
      'Chronic Allergic Rhinitis & Frequent Sneezing',
      'Sinusitis & Nasal Blockage Relief',
      'Bronchial Asthma & Wheezing Management',
      'Recurrent Tonsillitis & Throat Infections',
      'Dust & Pollen Allergy Immunomodulation',
    ],
    approach: 'Desensitizes the respiratory system naturally so seasonal changes no longer trigger severe flare-ups.',
  },
  {
    id: 3,
    category: 'digestive',
    icon: 'stomach',
    name: 'Digestive & Gastric Wellness',
    description: 'Gentle, natural solutions for chronic acidity, reflux, IBS, and sluggish digestion to restore gut health and gut microbiome balance.',
    whatsIncluded: [
      'GERD, Heartburn & Chronic Acidity',
      'Irritable Bowel Syndrome (IBS)',
      'Chronic Constipation & Bloating',
      'Gastritis & Stomach Ulcer Recovery',
      'Indigestion & Food Intolerance Care',
    ],
    approach: 'Normalizes stomach acid production and gut motility while reducing stress-induced gastric distress.',
  },
  {
    id: 4,
    category: 'women',
    icon: 'female',
    name: 'Women’s & Hormonal Health',
    description: 'Holistic care for female endocrine health, menstrual irregularities, PCOS, and menopausal transitions.',
    whatsIncluded: [
      'PCOS / PCOD & Ovarian Cysts',
      'Irregular & Painful Menstrual Cycles',
      'Menopausal Hot Flashes & Mood Swings',
      'Hormonal Acne & Weight Gain',
      'Fibroids & Premenstrual Syndrome (PMS)',
    ],
    approach: 'Restores natural endocrine rhythm without synthetic hormone replacement therapy.',
  },
  {
    id: 5,
    category: 'chronic',
    icon: 'joint',
    name: 'Joint & Chronic Pain Management',
    description: 'Natural pain relief and anti-inflammatory homeopathic care for joint stiffness, arthritis, and backache.',
    whatsIncluded: [
      'Rheumatoid & Osteoarthritis Relief',
      'Cervical & Lumbar Spondylosis',
      'Gout & Uric Acid Management',
      'Sciatica & Lower Back Pain',
      'Fibromyalgia & Muscle Stiffness',
    ],
    approach: 'Reduces joint swelling and morning stiffness while promoting cartilage health and mobility.',
  },
  {
    id: 6,
    category: 'pediatric',
    icon: 'child_care',
    name: 'Pediatric & Child Health',
    description: 'Ultra-gentle, sweet homeopathic pills designed for babies, toddlers, and young children to boost natural immunity.',
    whatsIncluded: [
      'Recurrent Cold, Cough & Fever in Children',
      'Childhood Asthma & Allergic Cough',
      'Poor Appetite & Digestive Troubles',
      'Teething Complaints & Bedwetting',
      'Immunity Enhancement for School-Going Children',
    ],
    approach: 'Zero chemical burden, safe for infants, and highly effective for developing immune systems.',
  },
];

const ServicesPage = () => {
  const pageRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [services, activeCategory]);

  // Fetch live services and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          api.get('/services'),
          api.get('/categories'),
        ]);

        if (servicesRes.data?.status && Array.isArray(servicesRes.data.result) && servicesRes.data.result.length > 0) {
          const activeServices = servicesRes.data.result.filter((s) => s.isStatus === 1 || s.isStatus === undefined);
          if (activeServices.length > 0) {
            setServices(activeServices);
          }
        }

        if (categoriesRes.data?.status && Array.isArray(categoriesRes.data.result)) {
          const activeCategories = categoriesRes.data.result.filter((c) => c.isStatus === 1);
          setCategories(activeCategories);
        }
      } catch (err) {
        console.warn('Could not fetch live services, using default catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute category tabs: 'All' + active categories from Category Master
  const filterTabs = [
    { id: 'all', label: 'All Services' },
    ...categories.map((c) => ({
      id: c.slug || c.name.toLowerCase(),
      label: c.name,
    })),
  ];

  // Map category slug to display name
  const getCategoryName = (catKey) => {
    const found = categories.find(
      (c) => c.slug === catKey || c.name.toLowerCase() === String(catKey).toLowerCase()
    );
    return found ? found.name : catKey ? catKey.charAt(0).toUpperCase() + catKey.slice(1) : 'General';
  };

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter(
          (s) =>
            s.category === activeCategory ||
            s.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div ref={pageRef} className="bg-[#faf7f5] pb-20 text-[#1f2937]">
      {/* Header Banner */}
      <header className="bg-white py-14 border-b border-gray-200 px-6">
        <div className="max-w-4xl mx-auto text-center reveal active">
          <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] tracking-widest uppercase mb-2 block">
            Sharnam Homeopathy • Clinical Services
          </span>
          <h1 className="font-['Playfair_Display'] text-[36px] sm:text-[48px] font-bold text-[#1f2937] mb-4">
            Our Detailed Clinical Services
          </h1>
          <p className="font-['Inter'] text-[16px] sm:text-[18px] text-[#4b5563] leading-relaxed">
            Personalized constitutional homeopathic treatments offered at Sharnam Clinic by Dr. Dhairya Mehta.
          </p>
        </div>
      </header>

      {/* Category Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-3 reveal active">
          {filterTabs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-['Inter'] text-[14px] font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#cc3b38] text-white shadow-md'
                  : 'bg-white text-[#4b5563] border border-gray-200 hover:border-[#cc3b38]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Full Detailed Services List */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {loading && services.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#cc3b38] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">medical_services</span>
            <p className="font-['Inter'] text-gray-600 font-medium">No treatments found under this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 px-4 py-2 bg-[#cc3b38] text-white rounded-xl text-sm font-semibold hover:bg-[#b52f2c]"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service, idx) => {
              const itemsList = Array.isArray(service.whatsIncluded)
                ? service.whatsIncluded
                : typeof service.whatsIncluded === 'string'
                ? service.whatsIncluded.split('\n').filter(Boolean)
                : [];

              return (
                <div
                  key={service.id || idx}
                  className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between reveal active"
                  style={{ transitionDelay: `${(idx % 4) * 80}ms` }}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[32px]">
                          {service.icon || 'medical_services'}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-['Playfair_Display'] text-[24px] font-bold text-[#1f2937]">
                          {service.name}
                        </h2>
                        <span className="inline-block px-3 py-0.5 bg-[#e6f4f8] text-[#2c7a94] rounded-full font-['Inter'] text-[12px] font-semibold uppercase tracking-wider mt-1">
                          {getCategoryName(service.category)}
                        </span>
                      </div>
                    </div>

                    <p className="font-['Inter'] text-[15px] text-[#4b5563] leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* What's Included List */}
                    {itemsList.length > 0 && (
                      <div className="bg-[#faf7f5] p-5 rounded-2xl border border-gray-100 mb-6">
                        <h4 className="font-['Inter'] text-[13px] font-bold text-[#cc3b38] uppercase tracking-wider mb-3">
                          What's Included & Conditions Treated:
                        </h4>
                        <ul className="space-y-2 font-['Inter'] text-[14px] text-[#1f2937]">
                          {itemsList.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-[#2c7a94] text-[18px] shrink-0 mt-0.5">
                                check_circle
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {service.approach && (
                      <div className="text-[13px] font-['Inter'] text-gray-500 italic mb-6">
                        <strong className="text-[#1f2937] not-italic">Treatment Approach:</strong>{' '}
                        {service.approach}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-['Inter'] text-[13px] text-[#6b7280]">
                      Consultation required prior to medication
                    </span>
                    <Link
                      to="/contact"
                      className="bg-[#cc3b38] text-white px-5 py-2.5 rounded-xl font-['Inter'] text-[14px] font-semibold hover:bg-[#b52f2c] transition-all flex items-center gap-1.5"
                    >
                      Inquire Service
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="bg-[#1f2937] text-white rounded-3xl p-8 md:p-12 text-center reveal active">
          <h3 className="font-['Playfair_Display'] text-[28px] font-bold mb-3">
            Not Sure Which Treatment Is Right For You?
          </h3>
          <p className="font-['Inter'] text-[16px] text-gray-300 max-w-2xl mx-auto mb-6">
            Get in touch with Dr. Dhairya Mehta to identify the root cause of your symptoms.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#cc3b38] text-white px-7 py-3.5 rounded-xl font-['Inter'] text-[15px] font-semibold hover:bg-[#b52f2c] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            Contact Us Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
