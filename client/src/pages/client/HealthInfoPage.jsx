import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const HealthInfoPage = () => {
  const pageRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.05 }
    );
    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => {
      observer.observe(el);
      el.classList.add('active');
    });
    return () => observer.disconnect();
  }, [conditions, selectedCategory, searchQuery]);

  // Fetch live conditions and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [condRes, catRes] = await Promise.all([
          api.get('/health-conditions'),
          api.get('/categories'),
        ]);

        if (condRes.data?.status && Array.isArray(condRes.data.result) && condRes.data.result.length > 0) {
          const activeConds = condRes.data.result.filter((c) => c.isStatus === 1 || c.isStatus === undefined);
          if (activeConds.length > 0) {
            setConditions(activeConds);
          }
        }

        if (catRes.data?.status && Array.isArray(catRes.data.result)) {
          const activeCats = catRes.data.result.filter((c) => c.isStatus === 1);
          setCategories(activeCats);
        }
      } catch (err) {
        console.warn('Could not fetch live health conditions, using default library:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryTabs = [
    { id: 'all', label: 'All Conditions' },
    ...categories.map((c) => ({
      id: c.slug || c.name.toLowerCase(),
      label: c.name,
    })),
  ];

  const getCategoryLabel = (catKey) => {
    const found = categories.find(
      (c) => c.slug === catKey || c.name.toLowerCase() === String(catKey).toLowerCase()
    );
    return found ? found.name : catKey ? catKey.charAt(0).toUpperCase() + catKey.slice(1) : 'General';
  };

  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return val.split('\n').filter(Boolean);
    }
    return [];
  };

  const filteredDiseases = conditions.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      item.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const symptomsList = toArray(item.symptoms);
    const causesList = toArray(item.causes);
    const preventionList = toArray(item.prevention);

    const matchesTitle = item.title?.toLowerCase().includes(q);
    const matchesSummary = item.shortSummary?.toLowerCase().includes(q);
    const matchesSymptoms = symptomsList.some((s) => s.toLowerCase().includes(q));
    const matchesCauses = causesList.some((c) => c.toLowerCase().includes(q));
    const matchesPrevention = preventionList.some((p) => p.toLowerCase().includes(q));

    return matchesCategory && (matchesTitle || matchesSummary || matchesSymptoms || matchesCauses || matchesPrevention);
  });

  return (
    <div ref={pageRef} className="bg-[#faf7f5] pb-20 text-[#1f2937]">
      {/* Header Banner */}
      <header className="bg-white py-14 border-b border-gray-200 px-6">
        <div className="max-w-4xl mx-auto text-center reveal active">
          <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] tracking-widest uppercase mb-2 block">
            Patient Education • Sharnam Knowledge Base
          </span>
          <h1 className="font-['Playfair_Display'] text-[36px] sm:text-[48px] font-bold text-[#1f2937] mb-4">
            Health Information & Disease Library
          </h1>
          <p className="font-['Inter'] text-[16px] sm:text-[18px] text-[#4b5563] leading-relaxed">
            Detailed guides on common medical conditions, symptoms, root causes, prevention tips, and medical advice.
          </p>
        </div>
      </header>

      {/* 1. DISCLAIMER BANNER */}
      <section className="max-w-5xl mx-auto px-6 pt-8">
        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] text-[#856404] p-5 rounded-2xl shadow-sm font-['Inter'] text-[14px] leading-relaxed reveal active">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#856404] shrink-0 mt-0.5">
              warning
            </span>
            <div>
              <strong className="font-bold text-[15px] block mb-1">
                Medical Disclaimer & Educational Notice
              </strong>
              The health information provided on this page is strictly for general educational and informational purposes. It is not intended to be a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified physician or homeopathic consultant regarding any specific health condition.
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm reveal active">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-['Inter'] text-[13px] font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2c7a94] text-white shadow-sm'
                    : 'bg-[#faf7f5] text-[#4b5563] hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search diseases or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 font-['Inter'] text-[14px] text-[#1f2937] focus:outline-none focus:border-[#cc3b38]"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-[18px]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Disease Cards List */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {loading && conditions.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#cc3b38] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDiseases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">stethoscope</span>
            <p className="font-['Inter'] text-gray-600 font-medium">No medical conditions match your filter or search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#cc3b38] text-white rounded-xl text-sm font-semibold hover:bg-[#b52f2c] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredDiseases.map((disease, idx) => {
              const symptomsList = toArray(disease.symptoms);
              const causesList = toArray(disease.causes);
              const preventionList = toArray(disease.prevention);

              return (
                <div
                  key={disease.id || idx}
                  className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-200 shadow-md reveal active space-y-6"
                  style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[32px]">
                        {disease.icon || 'stethoscope'}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-0.5 bg-[#e6f4f8] text-[#2c7a94] rounded-full font-['Inter'] text-[12px] font-bold uppercase tracking-wider mb-1">
                        {getCategoryLabel(disease.category)} Condition
                      </span>
                      <h2 className="font-['Playfair_Display'] text-[26px] sm:text-[30px] font-bold text-[#1f2937]">
                        {disease.title}
                      </h2>
                      {disease.shortSummary && (
                        <p className="font-['Inter'] text-[15px] text-[#6b7280]">
                          {disease.shortSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid of Symptoms, Causes, Prevention */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Symptoms */}
                    {symptomsList.length > 0 && (
                      <div className="bg-[#faf7f5] p-5 rounded-2xl border border-gray-100">
                        <h4 className="font-['Inter'] text-[14px] font-bold text-[#cc3b38] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">warning</span>
                          Common Symptoms
                        </h4>
                        <ul className="space-y-2 font-['Inter'] text-[13px] text-[#4b5563]">
                          {symptomsList.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#cc3b38] font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Causes */}
                    {causesList.length > 0 && (
                      <div className="bg-[#faf7f5] p-5 rounded-2xl border border-gray-100">
                        <h4 className="font-['Inter'] text-[14px] font-bold text-[#2c7a94] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">biotech</span>
                          Root Causes & Triggers
                        </h4>
                        <ul className="space-y-2 font-['Inter'] text-[13px] text-[#4b5563]">
                          {causesList.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#2c7a94] font-bold">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention */}
                    {preventionList.length > 0 && (
                      <div className="bg-[#faf7f5] p-5 rounded-2xl border border-gray-100">
                        <h4 className="font-['Inter'] text-[14px] font-bold text-[#1f2937] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">shield</span>
                          Prevention & Care Tips
                        </h4>
                        <ul className="space-y-2 font-['Inter'] text-[13px] text-[#4b5563]">
                          {preventionList.map((p, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-gray-400 font-bold">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* When to See a Doctor */}
                  {disease.whenToSeeDoctor && (
                    <div className="p-4 rounded-2xl bg-[#fcf4f2] border border-[#f0e6e4] flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#cc3b38] text-[20px] shrink-0 mt-0.5">
                        emergency
                      </span>
                      <div className="font-['Inter'] text-[13px] text-[#4b5563] leading-relaxed">
                        <strong className="text-[#1f2937] font-semibold">When to Consult a Physician: </strong>
                        {disease.whenToSeeDoctor}
                      </div>
                    </div>
                  )}

                  {/* Action Link to Inquire */}
                  <div className="pt-2 flex justify-end">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-[#cc3b38] font-['Inter'] text-[14px] font-semibold hover:underline"
                    >
                      Book Consultation for this Condition
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HealthInfoPage;
