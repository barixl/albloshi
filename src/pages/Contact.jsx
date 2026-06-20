import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileFooterBar from '../components/MobileFooterBar';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'Industrial Materials', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill out all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      if (supabase) {
        const { error } = await supabase.from('leads').insert([{
          name:    form.name,
          email:   form.email,
          phone:   form.phone,
          service: form.service,
          message: form.message,
          status:  'new',
          read:    false,
          source:  'contact_form',
        }]);
        if (error) throw error;
      }
      toast.success(`Thank you, ${form.name}! Your inquiry has been sent. Our team will contact you shortly.`);
      setForm({ name: '', email: '', phone: '', service: 'Industrial Materials', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      const msg = err?.message || err?.details || 'Something went wrong. Please try again or contact us directly.';
      toast.error(msg, { duration: 8000 });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Mohammad Abdulla Albloshi Trading Co.</title>
        <meta name="description" content="Get in touch with Mohammad Abdulla Albloshi Trading Co. — reach our business development team for industrial materials, food distribution, TELLABS chemicals, and manpower supply inquiries across Saudi Arabia." />
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="page-hero" style={{ backgroundImage: 'linear-gradient(135deg, rgba(9, 20, 45, 0.90) 0%, rgba(27, 95, 175, 0.75) 100%), url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80)' }}>
        <div className="container">
          <h1>Get in Touch</h1>
          <p>Connect with our team for inquiries, quotes, and partnership opportunities. We're here to support your business across all our divisions.</p>
          <div className="page-hero-actions">
            <a href="#inquiry-form" className="btn btn-primary">Send an Inquiry</a>
            <a href="https://wa.me/966549581547" target="_blank" rel="noopener noreferrer" className="btn-outline-white">WhatsApp Us</a>
          </div>
        </div>
      </section>


      {/* Contact Form & Info */}
      <section id="inquiry-form" className="section-padding">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-container">
              <h3>Enterprise Sales Inquiry</h3>
              <p className="large-para" style={{ fontSize: '0.95rem', marginBottom: '2rem' }}>Please submit your details and project specifications below. Our business development team will analyze your request and reply within one business day.</p>
              <form id="companyInquiryForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="formName" className="form-label">Full Name *</label>
                  <input type="text" id="formName" className="form-input" required placeholder="e.g. Mohammad Al-Harbi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="formEmail" className="form-label">Business Email *</label>
                    <input type="email" id="formEmail" className="form-input" required placeholder="name@yourcompany.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="formPhone" className="form-label">Mobile / WhatsApp *</label>
                    <input type="tel" id="formPhone" className="form-input" required placeholder="+966 5X XXX XXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="formService" className="form-label">Required Division</label>
                  <select id="formService" className="form-select" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="Industrial Materials">Industrial Materials and Building Solutions</option>
                    <option value="Food Distribution">Wholesale Food Distribution</option>
                    <option value="TELLABS Chemicals">TELLABS specialty Chemicals</option>
                    <option value="Manpower Supply">Manpower Supply Services</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="formMessage" className="form-label">Additional Information</label>
                  <textarea id="formMessage" className="form-textarea" placeholder="Any additional details, quantities, specifications, or questions..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', border: 'none' }} disabled={submitting}>
                  {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>

            <div className="contact-info-panel">
              <h2 className="section-title">Connect With Our Corporate Offices</h2>
              <p className="large-para">Connect directly with our headquarters or division directors to arrange technical consultation or obtain direct credit accounts.</p>
              <div className="contact-card-list">
                <div className="contact-card-item">
                  <span className="contact-card-icon material-icons">phone_in_talk</span>
                  <div className="contact-card-details">
                    <h4>Business Development Office</h4>
                    <p>Mohammad Riaz — Business Development Manager</p>
                    <p>Mobile / WhatsApp: <a href="https://wa.me/966549581547" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700' }}>+966 54 958 1547</a></p>
                  </div>
                </div>
                <div className="contact-card-item">
                  <span className="contact-card-icon material-icons">mail_outline</span>
                  <div className="contact-card-details">
                    <h4>General Sales Desk</h4>
                    <p>Email: <a href="mailto:sales@albloshi.co">sales@albloshi.co</a></p>
                    <p>Website: <a href="https://albloshi.co" target="_blank" rel="noopener noreferrer">https://albloshi.co</a></p>
                  </div>
                </div>
                <div className="contact-card-item">
                  <span className="contact-card-icon material-icons">location_on</span>
                  <div className="contact-card-details">
                    <h4>Dammam Headquarters Address</h4>
                    <p>5250, Al Nidal 7372, Ash Shulah Dist.,</p>
                    <p>Dammam 34261, Kingdom of Saudi Arabia</p>
                  </div>
                </div>
              </div>
              <div className="contact-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Commercial Registry</span>
                  <span className="meta-value">7049763092</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">National Address Code</span>
                  <span className="meta-value">EAPB5250</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location CTA */}
      <section className="page-cta">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title center" style={{ color: 'white' }}>Visit Our Dammam Headquarters</h2>
          <p>Located in the heart of the Eastern Province's industrial corridor — easily accessible for site visits, inspections, and meetings.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+966549581547" className="btn btn-primary" style={{ background: 'white', color: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              Call +966 54 958 1547
            </a>
            <a href="mailto:sales@albloshi.co" className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }}>
              Email sales@albloshi.co
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <MobileFooterBar />
      <WhatsAppFloat />
    </>
  );
}
