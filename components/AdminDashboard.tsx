import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Video, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';
import { getProjects, deleteProject } from '../services/projectService';
import ProjectForm from './ProjectForm';

interface AdminDashboardProps {
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
            loadProjects();
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingProject(undefined);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        loadProjects();
    };

    return (
        <div className="pt-32 pb-20 bg-black min-h-screen">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </button>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Admin Dashboard<span className="text-indigo-500">.</span>
                        </h2>
                        <p className="text-zinc-400 mt-2">Manage your portfolio projects and content.</p>
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Project
                    </button>
                </div>

                {/* Project List */}
                <div className="grid grid-cols-1 gap-6">
                    {projects.length === 0 ? (
                        <div className="py-20 text-center border border-zinc-800 rounded-3xl bg-zinc-900/20">
                            <p className="text-zinc-500">No projects found. Add your first project!</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="group flex flex-col md:flex-row gap-6 p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all"
                            >
                                {/* Preview Image */}
                                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="text-xl font-bold text-white truncate">{project.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded-md border border-zinc-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

                                        <div className="flex items-center gap-3 text-zinc-500">
                                            {project.demoUrl && project.demoUrl !== '#' && <ExternalLink className="w-4 h-4 cursor-default" title="Live Link Available" />}
                                            {project.repoUrl && project.repoUrl !== '#' && <Github className="w-4 h-4 cursor-default" title="Repo Link Available" />}
                                            {project.media && project.media.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span>{project.media.filter(m => m.type === 'image').length}</span>
                                                    <Video className="w-4 h-4 ml-1" />
                                                    <span>{project.media.filter(m => m.type === 'video').length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Project Form Modal */}
            {isFormOpen && (
                <ProjectForm
                    project={editingProject}
                    onClose={closeForm}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
