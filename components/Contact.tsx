import React, { useState, useRef } from 'react';
import { Send, Mail, Linkedin, ArrowLeft, Upload, X } from 'lucide-react';
import { USER_INFO } from '../constants';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare the email content
    const subject = encodeURIComponent(`Portfolio Inquiry from: ${formState.name}`);
    
    let bodyText = `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`;
    
    // Add note about files if any are selected
    if (files.length > 0) {
      bodyText += `\n\n--------------------------------------------------\n[NOTE TO SENDER]: You selected ${files.length} file(s) to attach:\n${files.map(f => `- ${f.name}`).join('\n')}\n\nPlease remember to attach them manually to this email before sending.\n--------------------------------------------------`;
    }

    const body = encodeURIComponent(bodyText);

    // 2. Open the user's email client
    // Note: This still uses mailto for the form action as it's the standard way to trigger client-side composition with body text.
    window.location.href = `mailto:${USER_INFO.email}?subject=${subject}&body=${body}`;

    // 3. Reset UI to show feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormState({ name: '', email: '', message: '' });
      setFiles([]);
      setTimeout(() => setSuccess(false), 8000);
    }, 1000);
  };

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen relative">
      
      {/* Option 1: Vertical Right Sidebar (Added to Other Pages) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-20 select-none">
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
          <span 
            style={{ writingMode: 'vertical-rl' }} 
            className="text-zinc-500 text-xs tracking-[0.6em] font-mono uppercase opacity-60 hover:text-indigo-400 hover:opacity-100 transition-all duration-300"
          >
              // PROGRAMMER
          </span>
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        
        {/* Back Navigation */}
        <div className="mb-8 flex justify-start">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-indigo-400 text-xs font-medium mb-6">
          <Mail className="w-3 h-3" /> Available for hire
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch.</h2>
        <p className="text-zinc-400 mb-12 max-w-xl mx-auto">
          Have a project in mind? Fill out the form below and attach any relevant files or images to discuss your ideas.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              required
              placeholder="Your Name"
              value={formState.name}
              onChange={(e) => setFormState({...formState, name: e.target.value})}
              className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-zinc-900 text-white transition-all placeholder-zinc-600"
            />
            <input 
              type="email" 
              required
              placeholder="Your Email"
              value={formState.email}
              onChange={(e) => setFormState({...formState, email: e.target.value})}
              className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-zinc-900 text-white transition-all placeholder-zinc-600"
            />
          </div>
          
          <textarea 
            required
            rows={4}
            placeholder="Tell me about your project..."
            value={formState.message}
            onChange={(e) => setFormState({...formState, message: e.target.value})}
            className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-zinc-900 text-white transition-all placeholder-zinc-600 resize-none"
          ></textarea>

          {/* File Upload Area */}
          <div className="w-full">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative border border-dashed border-zinc-700 bg-zinc-900/30 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-900/50 hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer group"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Click to attach files or images</span>
              <span className="text-xs text-zinc-600 mt-1">Project briefs, mockups, screenshots, etc.</span>
            </div>
            
            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2 animate-fade-in-up">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-zinc-300 bg-zinc-900/80 px-4 py-3 rounded-lg border border-zinc-800">
                    <span className="truncate max-w-[80%]">{file.name}</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? 'Opening Email Client...' : (
              <>
                Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {success && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-center text-sm font-medium animate-fade-in-up">
              <p>Email client opening...</p>
              {files.length > 0 && (
                <p className="mt-1 text-white font-bold">Please remember to attach your files manually!</p>
              )}
            </div>
          )}
        </form>

        <div className="mt-16 pt-8 border-t border-zinc-900/50 flex flex-col items-center gap-6">
          <p className="text-zinc-500 text-sm">
            Or connect with me directly
          </p>
          
          <div className="flex items-center justify-center gap-6">
             <SocialLink 
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${USER_INFO.email}`} 
              icon={<Mail className="w-5 h-5" />} 
              label="Gmail" 
             />
             <SocialLink href={USER_INFO.social.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
             <SocialLink href={USER_INFO.social.whatsapp} icon={<WhatsAppIcon className="w-5 h-5" />} label="WhatsApp" />
          </div>
          
          <p className="text-zinc-600 text-sm font-mono mt-2">
            {USER_INFO.email}
          </p>
        </div>

      </div>
    </div>
  );
};

// Reusing the social components for consistency
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a0.5 .5 0 0 0 1 0V9a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
  </svg>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  const isMailto = href.startsWith('mailto:');
  return (
    <a 
      href={href} 
      aria-label={label}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className="p-4 glass rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 hover:scale-110 hover:border-indigo-500/50 transition-all duration-300"
    >
      {icon}
    </a>
  );
};

export default Contact;