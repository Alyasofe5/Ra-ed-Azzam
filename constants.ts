import { NavItem, Project } from './types';

// Dynamic Age Calculation
const birthDate = new Date('2001-05-17');
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const m = today.getMonth() - birthDate.getMonth();
if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}

export const USER_INFO = {
  name: "Raed Azzam",
  title: "CIS Specialist & Frontend Developer",
  age: age, // Dynamic age
  // Updated Bio to include University and Birthdate details professionally
  bio: "I am a Computer Information Systems (CIS) graduate from Al-Hussein Bin Talal University, based in Jordan. Born on May 17, 2001, I am a passionate software developer specializing in building interactive web applications using React and TypeScript, transforming designs into clean, maintainable code.",
  skills: ["React", "TypeScript", "Tailwind CSS", "CIS", "Database Management", "UI/UX Design", "Gemini API", "Git"],
  email: "raedazzam11@gmail.com",
  phone: "+962 78 171 7990",
  location: "Jordan",
  social: {
    linkedin: "#",
    whatsapp: "https://wa.me/962781717990"
  }
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'About Me', href: '#about' },
  { label: 'My Work', href: 'projects' }, 
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A comprehensive online store application supporting shopping carts, online payments, and an admin dashboard. Built with modern technologies to ensure speed and security.",
    tags: ["React", "Redux", "Node.js", "Stripe"],
    imageUrl: "https://picsum.photos/800/600?random=1",
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 2,
    title: "Smart Task Manager",
    description: "A project and daily task management application with team collaboration features, powered by AI to suggest priorities.",
    tags: ["TypeScript", "React", "Gemini API", "Tailwind"],
    imageUrl: "https://picsum.photos/800/600?random=2",
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "An interactive dashboard displaying real-time data analytics using dynamic charts and visualizations.",
    tags: ["Next.js", "Recharts", "D3.js"],
    imageUrl: "https://picsum.photos/800/600?random=3",
    demoUrl: "#",
    repoUrl: "#"
  }
];

export const AI_SYSTEM_INSTRUCTION = `
You are an AI assistant for Raed Azzam's portfolio website. 
Your goal is to answer visitor questions about Raed professionally and concisely in English.
Here is Raed's profile data:
Name: ${USER_INFO.name}
Birthdate: May 17, 2001 (Age: ${USER_INFO.age})
University: Al-Hussein Bin Talal University
Major: Computer Information Systems (CIS)
Role: ${USER_INFO.title}
Bio: ${USER_INFO.bio}
Skills: ${USER_INFO.skills.join(', ')}
Location: ${USER_INFO.location}
Projects: ${PROJECTS.map(p => p.title).join(', ')}
Contact Email: ${USER_INFO.email}
Phone: ${USER_INFO.phone}

If asked about something not in this data, suggest they contact Raed directly via the contact form.
Always reply in English unless the user speaks Arabic.
Be polite, professional, and helpful.
`;