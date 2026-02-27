import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, ChevronLeft, Save, X, Search, Edit3, Upload, Music, Video, BookOpen, Eye } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { API_URL } from '@/config';

// ── Modal Overlay ──
function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="text-xl font-bold font-changa">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

export default function AdminUlama() {
    const { user, isLoaded } = useUser();
    const [ulama, setUlama] = useState([]);
    const [selectedUlama, setSelectedUlama] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const isAdmin = !!user && !!ADMIN_EMAIL && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
    const adminEmail = isAdmin ? user.primaryEmailAddress?.emailAddress : '';
    const [loading, setLoading] = useState(true);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null); // null = adding, object = editing
    const [contentType, setContentType] = useState('audios'); // 'audios' or 'videos'
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    // Scholar form
    const [formData, setFormData] = useState({ name: '', description: '', style: '', image: '', bio: '' });

    // Content form
    const [contentForm, setContentForm] = useState({ title: '', url: '', category: '', description: '', duration: '', thumbnail: '' });

    useEffect(() => { fetchUlama(); }, []);

    const fetchUlama = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/ulama`);
            setUlama(res.data);
        } catch (err) {
            console.error('Error fetching ulama:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshSelected = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/api/ulama/${id}`);
            setSelectedUlama(res.data);
            setUlama((prev) => prev.map((u) => (u._id === id ? res.data : u)));
        } catch (err) {
            console.error('Error refreshing scholar:', err);
        }
    };

    // ── Scholar CRUD ──
    const handleCreateScholar = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        try {
            const res = await axios.post(`${API_URL}/api/ulama`, { ...formData, adminEmail });
            setUlama([...ulama, res.data]);
            setFormData({ name: '', description: '', style: '', image: '', bio: '' });
            setShowCreateModal(false);
        } catch (err) {
            console.error('Error creating scholar:', err);
            alert('خطأ في إنشاء العالم: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEditScholar = async (e) => {
        e.preventDefault();
        if (!isAdmin || !selectedUlama) return;
        try {
            const res = await axios.put(`${API_URL}/api/ulama/${selectedUlama._id}`, { ...formData, adminEmail });
            setSelectedUlama(res.data);
            setUlama((prev) => prev.map((u) => (u._id === res.data._id ? res.data : u)));
            setShowEditModal(false);
        } catch (err) {
            console.error('Error updating scholar:', err);
            alert('خطأ في تحديث العالم: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteScholar = async (id) => {
        if (!isAdmin) return;
        if (!confirm('هل أنت متأكد من حذف هذا العالم وجميع محتواه؟')) return;
        try {
            await axios.delete(`${API_URL}/api/ulama/${id}?adminEmail=${adminEmail}`);
            setUlama(ulama.filter((u) => u._id !== id));
            if (selectedUlama?._id === id) setSelectedUlama(null);
        } catch (err) {
            console.error('Error deleting scholar:', err);
            alert('خطأ في حذف العالم');
        }
    };

    // ── Content CRUD ──
    const handleSaveContent = async (e) => {
        e.preventDefault();
        if (!isAdmin || !selectedUlama) return;
        const scholarId = selectedUlama._id;
        const type = contentType; // 'audios' or 'videos'

        try {
            if (editingContent) {
                // Edit existing
                await axios.put(`${API_URL}/api/ulama/${scholarId}/${type}/${editingContent.id}`, {
                    ...contentForm,
                    adminEmail
                });
            } else {
                // Add new
                await axios.post(`${API_URL}/api/ulama/${scholarId}/${type}`, {
                    ...contentForm,
                    adminEmail
                });
            }
            await refreshSelected(scholarId);
            closeContentModal();
        } catch (err) {
            console.error('Error saving content:', err);
            alert('خطأ في حفظ المحتوى: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteContent = async (type, itemId) => {
        if (!isAdmin || !selectedUlama) return;
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;
        try {
            await axios.delete(`${API_URL}/api/ulama/${selectedUlama._id}/${type}/${itemId}?adminEmail=${adminEmail}`);
            await refreshSelected(selectedUlama._id);
        } catch (err) {
            console.error('Error deleting content:', err);
            alert('خطأ في حذف المحتوى');
        }
    };

    // ── File Upload ──
    const handleFileUpload = async (file, folder, onSuccess) => {
        if (!file) return;
        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const res = await axios.post(`${API_URL}/api/ulama/upload`, {
                        file: reader.result,
                        fileName: file.name,
                        folder,
                        adminEmail
                    });
                    if (res.data?.url) onSuccess(res.data.url);
                } catch (err) {
                    console.error('Upload error:', err);
                    alert('خطأ في رفع الملف');
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('File read error:', err);
            setUploading(false);
        }
    };

    // ── Modal Helpers ──
    const openCreateModal = () => {
        setFormData({ name: '', description: '', style: '', image: '', bio: '' });
        setShowCreateModal(true);
    };

    const openEditModal = () => {
        setFormData({
            name: selectedUlama.name || '',
            description: selectedUlama.description || '',
            style: selectedUlama.style || '',
            image: selectedUlama.image || '',
            bio: selectedUlama.bio || ''
        });
        setShowEditModal(true);
    };

    const openAddContent = (type) => {
        setContentType(type);
        setEditingContent(null);
        setContentForm({ title: '', url: '', category: '', description: '', duration: '', thumbnail: '' });
        setShowContentModal(true);
    };

    const openEditContent = (type, item) => {
        setContentType(type);
        setEditingContent(item);
        setContentForm({
            title: item.title || '',
            url: item.url || '',
            category: item.category || '',
            description: item.description || '',
            duration: item.duration || '',
            thumbnail: item.thumbnail || ''
        });
        setShowContentModal(true);
    };

    const closeContentModal = () => {
        setShowContentModal(false);
        setEditingContent(null);
        setContentForm({ title: '', url: '', category: '', description: '', duration: '', thumbnail: '' });
    };

    // ── Filter ──
    const filtered = ulama.filter((s) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.style?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Loading / Auth ──
    if (!isLoaded || loading) return <div className="p-8 text-center font-changa">جاري التحميل...</div>;

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-24 text-center font-changa" dir="rtl">
                    <h2 className="text-2xl font-bold mb-2">غير مصرح</h2>
                    <p className="text-gray-600">هذه الصفحة للمسؤول فقط.</p>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // DETAIL VIEW
    // ═══════════════════════════════════════════
    if (selectedUlama) {
        const tabs = [
            { key: 'info', label: 'المعلومات', icon: BookOpen },
            { key: 'audios', label: `صوتيات (${selectedUlama.audios?.length || 0})`, icon: Music },
            { key: 'videos', label: `فيديوهات (${selectedUlama.videos?.length || 0})`, icon: Video },
        ];

        const renderContentList = (type, items) => (
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-changa">
                        {type === 'audios' ? 'الصوتيات' : 'الفيديوهات'} ({items?.length || 0})
                    </h3>
                    <Button onClick={() => openAddContent(type)} className="bg-[#f97316] hover:bg-[#e0650d] font-changa text-sm">
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة
                    </Button>
                </div>
                {(!items || items.length === 0) ? (
                    <div className="text-center py-8 text-gray-400 font-changa">
                        لا يوجد محتوى بعد
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div key={item.id} className="bg-gray-50 border rounded-lg p-4 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0" dir="rtl">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-400 font-mono">{idx + 1}</span>
                                    <p className="font-bold font-changa truncate">{item.title}</p>
                                    {type === 'audios' && (
                                        <Badge className="bg-orange-100 text-orange-700 text-[10px] px-1.5">mp3</Badge>
                                    )}
                                </div>
                                {item.category && <p className="text-xs text-gray-500 font-changa">{item.category}</p>}
                                {item.duration && <p className="text-xs text-gray-400 font-changa">{item.duration}</p>}
                                {item.url && (
                                    <p className="text-xs text-blue-500 truncate mt-1 direction-ltr" dir="ltr">{item.url}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => openEditContent(type, item)}
                                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                    title="تعديل"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteContent(type, item.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                    title="حذف"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    {/* Back + Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => { setSelectedUlama(null); setActiveTab('info'); }}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-changa"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            العودة للقائمة
                        </button>
                        <div className="flex gap-2">
                            <a
                                href={`/ulama/${selectedUlama.slug || selectedUlama._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-changa"
                            >
                                <Eye className="w-4 h-4" />
                                معاينة
                            </a>
                            <Button onClick={openEditModal} variant="outline" className="font-changa text-sm">
                                <Edit3 className="w-4 h-4 ml-1" />
                                تعديل
                            </Button>
                        </div>
                    </div>

                    {/* Scholar Header */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                        <div className="bg-[#0f172a] p-6 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                {selectedUlama.image ? (
                                    <img src={selectedUlama.image} alt={selectedUlama.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl">👨‍🎓</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white font-amiri">{selectedUlama.name}</h1>
                                {selectedUlama.style && (
                                    <Badge className="bg-[#f97316] text-white text-xs mt-1">{selectedUlama.style}</Badge>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-changa border-b-2 transition-colors ${
                                        activeTab === tab.key
                                            ? 'border-[#f97316] text-[#f97316]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6" dir="rtl">
                            {activeTab === 'info' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-blue-600">{selectedUlama.audios?.length || 0}</p>
                                            <p className="text-sm text-gray-600 font-changa">صوتيات</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg text-center">
                                            <p className="text-2xl font-bold text-green-600">{selectedUlama.videos?.length || 0}</p>
                                            <p className="text-sm text-gray-600 font-changa">فيديوهات</p>
                                        </div>
                                    </div>
                                    {selectedUlama.description && (
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 font-changa mb-1">الوصف</p>
                                            <p className="font-changa text-gray-700">{selectedUlama.description}</p>
                                        </div>
                                    )}
                                    {selectedUlama.bio && (
                                        <div>
                                            <p className="text-sm font-bold text-gray-500 font-changa mb-1">السيرة الذاتية</p>
                                            <p className="font-changa text-gray-700 whitespace-pre-wrap">{selectedUlama.bio}</p>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t">
                                        <Button
                                            onClick={() => handleDeleteScholar(selectedUlama._id)}
                                            variant="destructive"
                                            className="font-changa"
                                        >
                                            <Trash2 className="w-4 h-4 ml-2" />
                                            حذف العالم
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'audios' && renderContentList('audios', selectedUlama.audios)}
                            {activeTab === 'videos' && renderContentList('videos', selectedUlama.videos)}
                        </div>
                    </div>
                </div>

                {/* ── Edit Scholar Modal ── */}
                <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل بيانات العالم">
                    <form onSubmit={handleEditScholar} className="space-y-4" dir="rtl">
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">الاسم *</label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="font-changa" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">التخصص</label>
                            <Input value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} className="font-changa" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">الوصف</label>
                            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="font-changa" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">الصورة</label>
                            <div className="flex gap-2">
                                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="رابط الصورة" className="font-changa flex-1" dir="ltr" />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="shrink-0"
                                    disabled={uploading}
                                    onClick={() => imageInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4" />
                                </Button>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, 'ulama/images', (url) => setFormData((p) => ({ ...p, image: url })));
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                            {formData.image && (
                                <img src={formData.image} alt="preview" className="mt-2 h-20 w-20 rounded-lg object-cover" />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">السيرة الذاتية</label>
                            <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="font-changa h-32" dir="rtl" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="bg-[#f97316] hover:bg-[#e0650d] font-changa">
                                <Save className="w-4 h-4 ml-2" />
                                حفظ التعديلات
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="font-changa">إلغاء</Button>
                        </div>
                    </form>
                </Modal>

                {/* ── Add/Edit Content Modal ── */}
                <Modal
                    open={showContentModal}
                    onClose={closeContentModal}
                    title={editingContent
                        ? `تعديل ${contentType === 'audios' ? 'صوتية' : 'فيديو'}`
                        : `إضافة ${contentType === 'audios' ? 'صوتية جديدة' : 'فيديو جديد'}`
                    }
                >
                    <form onSubmit={handleSaveContent} className="space-y-4" dir="rtl">
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">العنوان *</label>
                            <Input value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} required className="font-changa" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">
                                {contentType === 'audios' ? 'رابط الملف الصوتي *' : 'رابط الفيديو *'}
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={contentForm.url}
                                    onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                                    required
                                    placeholder={contentType === 'audios' ? 'https://...mp3' : 'https://youtube.com/watch?v=...'}
                                    className="font-changa flex-1"
                                    dir="ltr"
                                />
                                {contentType === 'audios' && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="shrink-0"
                                            disabled={uploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploading ? '...' : <Upload className="w-4 h-4" />}
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="audio/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(file, 'ulama/audios', (url) => setContentForm((p) => ({ ...p, url })));
                                                e.target.value = '';
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">التصنيف</label>
                            <Input value={contentForm.category} onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })} placeholder="مثال: خطب، دروس، محاضرات" className="font-changa" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold font-changa mb-1">الوصف</label>
                            <Textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} className="font-changa" dir="rtl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">المدة</label>
                                <Input value={contentForm.duration} onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })} placeholder="00:00:00" className="font-changa" dir="ltr" />
                            </div>
                            {contentType === 'videos' && (
                                <div>
                                    <label className="block text-sm font-bold font-changa mb-1">صورة مصغرة</label>
                                    <Input value={contentForm.thumbnail} onChange={(e) => setContentForm({ ...contentForm, thumbnail: e.target.value })} placeholder="رابط الصورة" className="font-changa" dir="ltr" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" className="bg-[#f97316] hover:bg-[#e0650d] font-changa">
                                <Save className="w-4 h-4 ml-2" />
                                {editingContent ? 'حفظ التعديلات' : 'إضافة'}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeContentModal} className="font-changa">إلغاء</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // LIST VIEW
    // ═══════════════════════════════════════════
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-amiri mb-1">إدارة العلماء</h1>
                        <p className="text-gray-600 font-changa">{ulama.length} عالم مسجل</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-[#f97316] hover:bg-[#e0650d] font-changa">
                        <Plus className="w-4 h-4 ml-2" />
                        عالم جديد
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن عالم..."
                        className="pr-10 font-changa"
                        dir="rtl"
                    />
                </div>

                {/* Scholars Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((scholar) => (
                            <div
                                key={scholar._id}
                                onClick={() => setSelectedUlama(scholar)}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                            >
                                <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {scholar.image ? (
                                        <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <span className="text-5xl">👨‍🎓</span>
                                    )}
                                </div>
                                <div className="p-4" dir="rtl">
                                    <h3 className="font-bold text-lg font-changa mb-1">{scholar.name}</h3>
                                    {scholar.style && (
                                        <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs mb-2 font-changa">{scholar.style}</Badge>
                                    )}
                                    <div className="flex gap-3 text-xs text-gray-500 font-changa mt-2">
                                        <span className="flex items-center gap-1"><Music className="w-3 h-3" /> {scholar.audios?.length || 0}</span>
                                        <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {scholar.videos?.length || 0}</span>
                                    </div>
                                    {scholar.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-2 font-changa">{scholar.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow">
                        {searchQuery ? (
                            <p className="text-gray-400 text-lg font-changa">لا توجد نتائج لـ "{searchQuery}"</p>
                        ) : (
                            <>
                                <p className="text-gray-400 text-lg font-changa mb-4">لا توجد علماء حتى الآن</p>
                                <Button onClick={openCreateModal} className="bg-[#f97316] hover:bg-[#e0650d] font-changa">
                                    <Plus className="w-4 h-4 ml-2" />
                                    أضف أول عالم
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ── Create Scholar Modal ── */}
            <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="إضافة عالم جديد">
                <form onSubmit={handleCreateScholar} className="space-y-4" dir="rtl">
                    <div>
                        <label className="block text-sm font-bold font-changa mb-1">الاسم *</label>
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="font-changa" dir="rtl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold font-changa mb-1">التخصص</label>
                        <Input value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} placeholder="مثال: الفقه والحديث" className="font-changa" dir="rtl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold font-changa mb-1">الوصف</label>
                        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="font-changa" dir="rtl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold font-changa mb-1">الصورة</label>
                        <div className="flex gap-2">
                            <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="رابط الصورة" className="font-changa flex-1" dir="ltr" />
                            <Button
                                type="button"
                                variant="outline"
                                className="shrink-0"
                                disabled={uploading}
                                onClick={() => imageInputRef.current?.click()}
                            >
                                {uploading ? '...' : <Upload className="w-4 h-4" />}
                            </Button>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, 'ulama/images', (url) => setFormData((p) => ({ ...p, image: url })));
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold font-changa mb-1">السيرة الذاتية</label>
                        <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="font-changa h-32" dir="rtl" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" className="bg-[#f97316] hover:bg-[#e0650d] font-changa">
                            <Save className="w-4 h-4 ml-2" />
                            إنشاء
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="font-changa">إلغاء</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
