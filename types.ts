export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // For videos mainly
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string; // Featured image
  media?: MediaItem[]; // Additional photos/videos
  demoUrl?: string;
  repoUrl?: string;
  createdAt?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
