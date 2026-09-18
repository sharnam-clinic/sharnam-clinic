import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const ContactPage = () => {
  const pageRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.status && Array.isArray(res.data.result)) {
          setCategories(res.data.result.filter((c) => c.isStatus === 1));
        }
      } catch {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, phone number, and message.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/inquiries', form);
      if (res.data?.status) {
        toast.success('Thank you! Your message has been sent to Sharnam Clinic. We will contact you soon.', { duration: 5000 });
        setForm({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Could not submit inquiry. Please try again or call us directly.');
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={pageRef} className="bg-[#faf7f5] pb-20 text-[#1f2937]">
      {/* Header Banner */}
      <header className="bg-white py-14 border-b border-gray-200 px-6">
        <div className="max-w-4xl mx-auto text-center reveal active">
          <span className="text-[#cc3b38] font-bold font-['Inter'] text-[13px] tracking-widest uppercase mb-2 block">
            Get In Touch • Sharnam Clinic
          </span>
          <h1 className="font-['Playfair_Display'] text-[36px] sm:text-[48px] font-bold text-[#1f2937] mb-3">
            Contact Us & Clinic Location
          </h1>
          <p className="font-['Inter'] text-[16px] sm:text-[18px] text-[#4b5563] leading-relaxed">
            We are here to answer your questions and assist with your health inquiries.
          </p>
        </div>
      </header>

      {/* Main Grid: Contact Info & Contact Form */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Basics Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-md reveal space-y-6">
              <h2 className="font-['Playfair_Display'] text-[26px] font-bold text-[#1f2937] border-b border-gray-100 pb-4">
                Clinic Details
              </h2>

              <div className="space-y-5 font-['Inter'] text-[15px]">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1f2937] text-[16px] mb-1">Clinic Address</h4>
                    <p className="text-[#4b5563] leading-relaxed">
                      GF/46, Samanway Westfields, TP-2, Vasna - Bhayli Main Rd, Opp. Rajpath Complex, Bhayli, Vadodara, Gujarat 391410
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#e6f4f8] text-[#2c7a94] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1f2937] text-[16px] mb-1">Phone & WhatsApp</h4>
                    <p className="text-[#4b5563]">
                      <a href="tel:+916355548616" className="text-[#cc3b38] font-bold hover:underline">
                        +91 6355 548 616
                      </a>
                    </p>
                    <p className="text-[13px] text-gray-500 mt-0.5">Available during OPD consultation hours</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] text-[#cc3b38] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1f2937] text-[16px] mb-1">Email Inquiry</h4>
                    <p className="text-[#4b5563]">
                      <a href="mailto:dhairyam30@gmail.com" className="hover:underline">
                        dhairyam30@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-200 shadow-md reveal">
              <h2 className="font-['Playfair_Display'] text-[26px] font-bold text-[#1f2937] mb-2">
                Send Us a Message
              </h2>
              <p className="font-['Inter'] text-[14px] text-[#4b5563] mb-6">
                Fill out the form below and our clinic team will respond to your message promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-['Inter'] text-[14px] font-bold text-[#1f2937] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl px-4 py-3 font-['Inter'] text-[15px] focus:outline-none focus:border-[#cc3b38]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Inter'] text-[14px] font-bold text-[#1f2937] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl px-4 py-3 font-['Inter'] text-[15px] focus:outline-none focus:border-[#cc3b38]"
                    />
                  </div>
                  <div>
                    <label className="block font-['Inter'] text-[14px] font-bold text-[#1f2937] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl px-4 py-3 font-['Inter'] text-[15px] focus:outline-none focus:border-[#cc3b38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-['Inter'] text-[14px] font-bold text-[#1f2937] mb-1">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl px-4 py-3 font-['Inter'] text-[15px] focus:outline-none focus:border-[#cc3b38]"
                    required
                  >
                    <option value="" disabled>Select a Subject</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-['Inter'] text-[14px] font-bold text-[#1f2937] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#faf7f5] border border-gray-200 rounded-xl px-4 py-3 font-['Inter'] text-[15px] focus:outline-none focus:border-[#cc3b38]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2c7a94] text-white px-8 py-3.5 rounded-xl font-['Inter'] text-[15px] font-semibold hover:bg-[#236378] transition-all shadow-md w-full disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map Section */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-white rounded-[32px] p-6 border border-gray-200 shadow-md reveal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1f2937] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#cc3b38]">map</span>
              Find Us on Google Maps
            </h3>
            <a
              href="https://maps.google.com/?q=Sharnam+Clinic,+Vasna+-+Bhayli+Main+Rd,+Vadodara"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2c7a94] font-['Inter'] text-[13px] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              Open in Google Maps App
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-100">
            <iframe
              title="Sharnam Clinic Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.684110825316!2d73.1248302!3d22.2903243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc7cb2ccf26cb%3A0xae495116baa823f1!2sSharnam%20Clinic!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
