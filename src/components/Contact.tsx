import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Contact() {
  const { personalInfo } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setFormStatus('sending');

    try {
      const response = await fetch('https://formsubmit.co/ajax/asgharnuman5@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Portfolio Contact: ${formData.subject}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormStatus('error');
      setErrorMessage('Failed to send message. Please email me directly at numanasghar901@gmail.com');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 bg-[#0c0f15] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative details */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10" id="contact-header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase mb-2"
          >
            <Mail className="w-3.5 h-3.5" />
            Connection
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mt-3 leading-relaxed"
          >
            Have a project in mind, an academic collaboration, or an automation query? Drop me a message below!
          </motion.p>
        </div>

        {/* Dual column: Info card on left, Form on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="contact-grid">
          {/* Contact Details Block */}
          <div className="lg:col-span-5 space-y-6" id="contact-info">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131924] p-6 shadow-xl space-y-8">
              <h3 className="font-sans font-bold text-lg text-zinc-100">
                Contact Information
              </h3>

              <div className="space-y-6">
                {/* Email detail */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 bg-yellow-950/20 border border-yellow-100 border-yellow-900/30 flex items-center justify-center text-yellow-600 text-yellow-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Email Address
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="font-mono text-sm text-zinc-200 hover:text-yellow-400 break-all block font-medium"
                      >
                        {personalInfo.email}
                      </a>
                      <button
                        onClick={handleCopyEmail}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:hover:bg-zinc-700 transition-colors shrink-0"
                        title="Copy to clipboard"
                        id="copy-email-btn"
                      >
                        {copiedEmail ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone detail */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 bg-emerald-950/20 border border-emerald-100 border-emerald-900/30 flex items-center justify-center text-emerald-600 text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Phone Number
                    </p>
                    <a
                      href={`tel:${personalInfo.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-mono text-sm text-zinc-202 hover:text-emerald-500 hover:text-emerald-400 mt-1 block font-medium"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Location detail */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 bg-yellow-950/20 border border-yellow-100 border-yellow-900/30 flex items-center justify-center text-yellow-650 text-yellow-405 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      Location / Campus
                    </p>
                    <p className="font-sans text-sm text-zinc-200 mt-1 font-medium">
                      Faisalabad, Pakistan (FAST-NUCES)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Block */}
          <div className="lg:col-span-7" id="contact-form-container">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#131924] p-6 sm:p-8 shadow-xl relative">
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  /* Success Feedback Page */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                    id="contact-success"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 bg-emerald-950/50 flex items-center justify-center text-emerald-500 text-emerald-400 mb-6 border border-emerald-200/50 border-emerald-900/50">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-sans font-bold text-2xl text-zinc-100">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-zinc-350 mt-3 max-w-md text-sm leading-relaxed">
                      Thank you for reaching out! Your message has been sent successfully. I will review your inquiry and get back to you at my earliest convenience.
                    </p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 px-6 py-2.5 hover:bg-zinc-200 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* Main Interactive Form Fields */
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-5"
                    id="contact-form"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="name"
                          className="font-sans text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={formStatus === 'sending'}
                          placeholder="Your full name"
                          className="px-4 py-3 rounded-xl border border-zinc-800 /50 bg-transparent/40 text-zinc-100 placeholder-zinc-450 text-sm focus:border-yellow-500 focus:border-yellow-500 focus:focus:bg-zinc-900 focus:outline-none transition-all disabled:opacity-50"
                        />
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="email"
                          className="font-sans text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={formStatus === 'sending'}
                          placeholder="your.email@example.com"
                          className="px-4 py-3 rounded-xl border border-zinc-800 /50 bg-transparent/40 text-zinc-100 placeholder-zinc-450 text-sm focus:border-yellow-500 focus:border-yellow-500 focus:focus:bg-zinc-900 focus:outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Subject input */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="subject"
                        className="font-sans text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        disabled={formStatus === 'sending'}
                        placeholder="Inquiry or project title"
                        className="px-4 py-3 rounded-xl border border-zinc-800 /50 bg-transparent/40 text-zinc-100 placeholder-zinc-450 text-sm focus:border-yellow-500 focus:border-yellow-500 focus:focus:bg-zinc-900 focus:outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="message"
                        className="font-sans text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider"
                      >
                        Message Body
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={formStatus === 'sending'}
                        placeholder="Enter details about your inquiry..."
                        className="px-4 py-3 rounded-xl border border-zinc-800 /50 bg-transparent/40 text-zinc-100 placeholder-zinc-450 text-sm focus:border-yellow-500 focus:border-yellow-500 focus:focus:bg-zinc-900 focus:outline-none transition-all resize-none disabled:opacity-50"
                      />
                    </div>

                    {/* Form Status Messages */}
                    {formStatus === 'error' && (
                      <div className="flex items-center space-x-2 text-rose-500 text-rose-400 text-sm bg-rose-50 bg-rose-950/20 px-4 py-3 rounded-xl border border-rose-100 border-rose-900/30">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-yellow-500/15 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-75"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="uppercase tracking-wider">Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="uppercase tracking-wider">Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
