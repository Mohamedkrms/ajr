import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, ChevronLeft, Save, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { API_URL } from '@/config';

export default function AdminUlama() {
    const [ulama, setUlama] = useState([]);
    const [selectedUlama, setSelectedUlama] = useState(null);
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
    const [loading, setLoading] = useState(true);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        style: '',
        image: '',
        bio: ''
    });

    useEffect(() => {
        fetchUlama();
    }, []);

    const fetchUlama = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/ulama`);
            setUlama(response.data);
        } catch (error) {
            console.error('Error fetching ulama:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateScholar = async (e) => {
        e.preventDefault();
        if (!adminEmail) {
            alert('يرجى إدخال بريد المسؤول');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/ulama`, {
                ...formData,
                adminEmail
            });
            setUlama([...ulama, response.data]);
            setFormData({ name: '', description: '', style: '', image: '', bio: '' });
            setIsCreatingNew(false);
            alert('تم إنشاء العالم بنجاح!');
        } catch (error) {
            console.error('Error creating scholar:', error);
            alert('خطأ في إنشاء العالم: ' + error.response?.data?.message);
        }
    };

    const handleDeleteScholar = async (id) => {
        if (!adminEmail) {
            alert('يرجى إدخال بريد المسؤول');
            return;
        }
        if (!confirm('هل أنت متأكد من حذف هذا العالم؟')) return;

        try {
            await axios.delete(`${API_URL}/api/ulama/${id}?adminEmail=${adminEmail}`);
            setUlama(ulama.filter(u => u._id !== id));
            if (selectedUlama?._id === id) setSelectedUlama(null);
            alert('تم حذف العالم بنجاح!');
        } catch (error) {
            console.error('Error deleting scholar:', error);
            alert('خطأ في حذف العالم');
        }
    };

    if (loading) return <div className="p-8 text-center font-changa">جاري التحميل...</div>;

    // Detail View
    if (selectedUlama) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <button
                        onClick={() => setSelectedUlama(null)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-changa"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        العودة
                    </button>

                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b">
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                {selectedUlama.image ? (
                                    <img src={selectedUlama.image} alt={selectedUlama.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl">👨‍🎓</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold font-changa">{selectedUlama.name}</h1>
                                <p className="text-gray-600 font-changa">{selectedUlama.style}</p>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-2" dir="rtl">
                            <h2 className="text-xl font-bold font-changa mb-4">المعلومات الأساسية</h2>
                            <div>
                                <p className="text-sm text-gray-600 font-changa">الوصف</p>
                                <p className="font-changa">{selectedUlama.description}</p>
                            </div>
                            {selectedUlama.bio && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 font-changa">السيرة</p>
                                    <p className="font-changa whitespace-pre-wrap line-clamp-5">{selectedUlama.bio}</p>
                                </div>
                            )}
                        </div>

                        {/* Content Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">{selectedUlama.audios?.length || 0}</p>
                                <p className="text-sm text-gray-600 font-changa">صوتيات</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-600">{selectedUlama.videos?.length || 0}</p>
                                <p className="text-sm text-gray-600 font-changa">فيديوهات</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-purple-600">{selectedUlama.articles?.length || 0}</p>
                                <p className="text-sm text-gray-600 font-changa">مقالات</p>
                            </div>
                        </div>

                        {/* Content Lists */}
                        {selectedUlama.audios && selectedUlama.audios.length > 0 && (
                            <div>
                                <h3 className="font-bold font-changa mb-3">الصوتيات:</h3>
                                <div className="space-y-2">
                                    {selectedUlama.audios.map((audio, idx) => (
                                        <div key={audio.id} className="bg-gray-50 p-3 rounded-lg text-sm font-changa">
                                            <p className="font-bold">{idx + 1}. {audio.title}</p>
                                            <p className="text-gray-600">{audio.category}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedUlama.videos && selectedUlama.videos.length > 0 && (
                            <div>
                                <h3 className="font-bold font-changa mb-3">الفيديوهات:</h3>
                                <div className="space-y-2">
                                    {selectedUlama.videos.map((video, idx) => (
                                        <div key={video.id} className="bg-gray-50 p-3 rounded-lg text-sm font-changa">
                                            <p className="font-bold">{idx + 1}. {video.title}</p>
                                            <p className="text-gray-600">{video.category}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delete Button */}
                        <Button
                            onClick={() => handleDeleteScholar(selectedUlama._id)}
                            variant="destructive"
                            className="w-full font-changa"
                        >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف العالم
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-amiri mb-2">إدارة العلماء</h1>
                    <p className="text-gray-600 font-changa">أنشئ العلماء وأدر محتواهم</p>
                </div>

                {/* Admin Status */}
                {!adminEmail && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 font-changa" dir="rtl">
                        <p className="text-yellow-900">⚠ لم يتم تعيين بريد المسؤول في متغيرات البيئة (VITE_ADMIN_EMAIL)</p>
                    </div>
                )}

                {/* Create New Scholar */}
                {isCreatingNew ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-changa">عالم جديد</h2>
                            <button onClick={() => setIsCreatingNew(false)}>
                                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateScholar} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">الاسم *</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="font-changa"
                                    dir="rtl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">التخصص</label>
                                <Input
                                    value={formData.style}
                                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                    placeholder="مثال: الفقه والحديث"
                                    className="font-changa"
                                    dir="rtl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">الوصف</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="وصف مختصر عن العالم"
                                    className="font-changa"
                                    dir="rtl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">رابط الصورة</label>
                                <Input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="font-changa"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold font-changa mb-1">السيرة الذاتية</label>
                                <Textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="السيرة الذاتية للعالم"
                                    className="font-changa h-32"
                                    dir="rtl"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 font-changa">
                                    <Save className="w-4 h-4 ml-2" />
                                    حفظ
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatingNew(false);
                                        setFormData({ name: '', description: '', style: '', image: '', bio: '' });
                                    }}
                                    variant="outline"
                                    className="font-changa"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsCreatingNew(true)}
                        className="mb-8 bg-[#f97316] hover:bg-[#e0650d] font-changa"
                    >
                        <Plus className="w-4 h-4 ml-2" />
                        عالم جديد
                    </Button>
                )}

                {/* Scholars List */}
                {ulama.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ulama.map((scholar) => (
                            <div
                                key={scholar._id}
                                onClick={() => setSelectedUlama(scholar)}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                            >
                                <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {scholar.image ? (
                                        <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <span className="text-5xl">👨‍🎓</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg font-changa mb-1">{scholar.name}</h3>
                                    {scholar.style && (
                                        <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs mb-3 font-changa">{scholar.style}</Badge>
                                    )}
                                    <div className="flex gap-2 text-xs text-gray-600 font-changa">
                                        <span>🎵 {scholar.audios?.length || 0}</span>
                                        <span>🎬 {scholar.videos?.length || 0}</span>
                                        <span>📄 {scholar.articles?.length || 0}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2 mt-2 font-changa">{scholar.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 text-lg font-changa mb-4">لا توجد علماء حتى الآن</p>
                        <Button
                            onClick={() => setIsCreatingNew(true)}
                            className="bg-[#f97316] hover:bg-[#e0650d] font-changa"
                        >
                            <Plus className="w-4 h-4 ml-2" />
                            أضف أول عالم
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
