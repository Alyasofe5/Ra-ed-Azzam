import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Video, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Project, MediaItem } from '../types';
import { addProject, updateProject, uploadFile } from '../services/projectService';

interface ProjectFormProps {
    project?: Project;
    onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose }) => {
    const [formData, setFormData] = useState<Omit<Project, 'id' | 'createdAt'>>({
        title: '',
        description: '',
        tags: [],
        imageUrl: '',
        media: [],
        demoUrl: '',
        repoUrl: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagsInput, setTagsInput] = useState('');
    const [newMediaUrl, setNewMediaUrl] = useState('');
    const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                tags: project.tags,
                imageUrl: project.imageUrl,
                media: project.media || [],
                demoUrl: project.demoUrl || '',
                repoUrl: project.repoUrl || '',
            });
            setTagsInput(project.tags.join(', '));
        }
    }, [project]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const b64 = await uploadFile(file);
            if (isFeatured) {
                setFormData(prev => ({ ...prev, imageUrl: b64 }));
            } else {
                const newItem: MediaItem = {
                    id: Date.now().toString(),
                    type: file.type.startsWith('video') ? 'video' : 'image',
                    url: b64
                };
                setFormData(prev => ({ ...prev, media: [...(prev.media || []), newItem] }));
            }
        } catch (err) {
            alert("Failed to upload file");
        }
    };

    const addMediaByUrl = () => {
        if (!newMediaUrl.trim()) return;
        const newItem: MediaItem = {
            id: Date.now().toString(),
            type: newMediaType,
            url: newMediaUrl
        };
        setFormData(prev => ({ ...prev, media: [...(prev.media || []), newItem] }));
        setNewMediaUrl('');
    };

    const removeMedia = (id: string) => {
        setFormData(prev => ({
            ...prev,
            media: (prev.media || []).filter(m => m.id !== id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) {
            alert("Title and Featured Image are required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (project) {
                await updateProject(project.id, formData);
            } else {
                await addProject(formData);
            }
            onClose();
        } catch (err: any) {
            console.error(err);
            if (err.name === 'QuotaExceededError' || err.message?.includes('exceeded') || err.message?.includes('quota')) {
                alert("Storage limit reached! LocalStorage has a ~5MB limit. Please compress your images further, use fewer images, or use Web Links (URLs) for media instead of uploading files directly.");
            } else {
                alert("Save failed. An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="text-2xl font-bold text-white">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. My Awesome App"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="What is this project about?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={tagsInput}
                                    onChange={handleTagsChange}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="React, TypeScript, Tailwind..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Demo URL</label>
                                    <input
                                        type="text"
                                        name="demoUrl"
                                        value={formData.demoUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Repo URL</label>
                                    <input
                                        type="text"
                                        name="repoUrl"
                                        value={formData.repoUrl}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="https://github..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Image & Media */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Featured Image *</label>
                                <div className="flex flex-col gap-4">
                                    {formData.imageUrl && (
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                                            <img src={formData.imageUrl} alt="Featured Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="Paste Image URL..."
                                        />
                                        <label className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl cursor-pointer text-zinc-300 transition-colors">
                                            <Upload className="w-5 h-5" />
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Media Gallery (Optional Images/Videos)</label>
                                <div className="space-y-4">
                                    {/* Media Grid */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {(formData.media || []).map((m) => (
                                            <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                                                {m.type === 'image' ? (
                                                    <img src={m.url} className="w-full h-full object-cover" alt="Gallery" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                                        <Video className="w-6 h-6 text-zinc-500" />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(m.id)}
                                                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md hover:bg-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Media Tool */}
                                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl space-y-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewMediaType('image')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${newMediaType === 'image' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}
                                            >
                                                <ImageIcon className="w-4 h-4" /> Photo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewMediaType('video')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${newMediaType === 'video' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400'}`}
                                            >
                                                <Video className="w-4 h-4" /> Video
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    value={newMediaUrl}
                                                    onChange={(e) => setNewMediaUrl(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                    placeholder="Media Link..."
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addMediaByUrl}
                                                className="px-4 py-2.5 bg-zinc-800 hover:bg-white hover:text-black rounded-xl text-zinc-300 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">OR</span>
                                        </div>

                                        <label className="w-full flex items-center justify-center gap-2 py-3 bg-transparent border border-zinc-800 text-zinc-400 rounded-xl cursor-pointer hover:bg-zinc-900 transition-all text-xs font-bold">
                                            <Upload className="w-4 h-4" />
                                            CHOOSE FROM DEVICE
                                            <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFileUpload(e, false)} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 text-zinc-400 hover:text-white font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-4 bg-white text-black rounded-full font-black hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (project ? 'SAVE CHANGES' : 'CREATE PROJECT')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
