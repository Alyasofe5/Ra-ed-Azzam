import { get, set } from 'idb-keyval';
import { Project, MediaItem } from '../types';
import { PROJECTS as STATIC_PROJECTS } from '../constants';

const STORAGE_KEY = 'raed_portfolio_projects';

// Helper to get projects from IndexedDB or static data fallback
export const getProjects = async (): Promise<Project[]> => {
    try {
        const stored = await get<Project[]>(STORAGE_KEY);
        if (stored && stored.length > 0) {
            return stored;
        }
    } catch (e) {
        console.error("Failed to read from IndexedDB", e);
    }

    // If no storage, initialize with static projects but mark them with timestamps
    const initial = STATIC_PROJECTS.map(p => ({
        ...p,
        createdAt: p.createdAt || Date.now()
    }));
    await saveProjects(initial);
    return initial;
};

// Helper to save all projects to IndexedDB
export const saveProjects = async (projects: Project[]): Promise<void> => {
    await set(STORAGE_KEY, projects);
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
    const projects = await getProjects();
    const newProject: Project = {
        ...project,
        id: Date.now(), // Unique ID using timestamp
        createdAt: Date.now()
    };
    const updated = [newProject, ...projects];
    await saveProjects(updated);
    return newProject;
};

// Update an existing project
export const updateProject = async (id: number, updates: Partial<Project>): Promise<Project> => {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updatedProject = { ...projects[index], ...updates };
    projects[index] = updatedProject;
    await saveProjects(projects);
    return updatedProject;
};

// Delete a project
export const deleteProject = async (id: number): Promise<void> => {
    const projects = await getProjects();
    const updated = projects.filter(p => p.id !== id);
    await saveProjects(updated);
};

// Handle File Upload (Simulation)
// Since we don't have a backend, we convert files to Base64 strings.
// We still compress images to be safe, even though IndexedDB has a larger quota.
export const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.type.startsWith('video/')) {
            // Video files are generally too large to store locally reliably, but we allow it for Demo purposes
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
            return;
        }

        if (file.type.startsWith('image/gif')) {
            // Allow GIFs natively to preserve animations!
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
            return;
        }

        // Image compression for non-GIFs
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200; // Increased max width since we have more space
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to WebP or JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};
