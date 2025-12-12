import React from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { USER_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
        
        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <SocialLink 
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${USER_INFO.email}`} 
            icon={<Mail className="w-5 h-5" />} 
            label="Gmail" 
          />
          <SocialLink 
            href={USER_INFO.social.linkedin} 
            icon={<Linkedin className="w-5 h-5" />} 
            label="LinkedIn" 
          />
          <SocialLink 
            href={USER_INFO.social.whatsapp} 
            icon={<WhatsAppIcon className="w-5 h-5" />} 
            label="WhatsApp" 
          />
        </div>

        {/* Copyright */}
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} {USER_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// Helper Components

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
  // Since we switched to a web link for email, all links can now open in a new tab.
  // We keep the logic just in case, but now email (https) will default to _blank.
  const isMailto = href.startsWith('mailto:');
  
  return (
    <a 
      href={href} 
      aria-label={label}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-all duration-300 hover:scale-110 border border-transparent hover:border-zinc-800"
    >
      {icon}
    </a>
  );
};

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

export default Footer;