import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Search, Plus, Edit, Trash2, Music, Video, FileText, Book, Play, Pause, X } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from '@/config';
import SEO from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function Ulama() {
    const [ulama, setUlama] = useState([]);
    const [selectedUlama, setSelectedUlama] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState('');
    const [activeTab, setActiveTab] = useState('audios');
    const [isAddingContent, setIsAddingContent] = useState(false);
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';

    // Form state for new content
    const [contentForm, setContentForm] = useState({
        type: 'audio', // audio, video, article
        title: '',
        url: '',
        thumbnail: '',
        category: '',
        description: '',
        content: '',
        duration: ''
    });

    const { playTrack, currentAudio, isPlaying: isGlobalPlaying } = useAudio();

    // Fetch all ulama
    useEffect(() => {
        fetchUlama();
    }, []);

    const fetchUlama = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/ulama`);
            setUlama(response.data);
        } catch (error) {
            console.error('Error fetching ulama:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUlama = ulama.filter(u =>
        u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.description?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const handleAddContent = async (e) => {
        e.preventDefault();
        if (!selectedUlama || !adminEmail) {
            alert('يرجى تحديد العالم وإدخال بريد المسؤول');
            return;
        }

        try {
            const endpoint = contentForm.type === 'article' ? 'articles' :
                contentForm.type === 'audio' ? 'audios' : 'videos';

            const payload = {
                adminEmail,
                title: contentForm.title,
                category: contentForm.category,
                ...(contentForm.description && { description: contentForm.description })
            };

            if (contentForm.type === 'article') {
                payload.content = contentForm.content;
            } else {
                payload.url = contentForm.url;
                payload.duration = contentForm.duration ? parseInt(contentForm.duration) : 0;
                if (contentForm.type === 'video' && contentForm.thumbnail) {
                    payload.thumbnail = contentForm.thumbnail;
                }
            }

            const response = await axios.post(
                `${API_URL}/api/ulama/${selectedUlama._id}/${endpoint}`,
                payload
            );

            setSelectedUlama(response.data);
            setContentForm({ type: 'audio', title: '', url: '', thumbnail: '', category: '', description: '', content: '', duration: '' });
            setIsAddingContent(false);
            alert('تم إضافة المحتوى بنجاح!');
        } catch (error) {
            console.error('Error adding content:', error);
            alert('خطأ في إضافة المحتوى: ' + error.response?.data?.message);
        }
    };

    const handleDeleteContent = async (contentId, type) => {
        if (!selectedUlama || !adminEmail) return;
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;

        try {
            const endpoint = type === 'article' ? 'articles' :
                type === 'audio' ? 'audios' : 'videos';

            const response = await axios.delete(
                `${API_URL}/api/ulama/${selectedUlama._id}/${endpoint}/${contentId}?adminEmail=${adminEmail}`
            );

            setSelectedUlama(response.data);
            alert('تم حذف المحتوى بنجاح!');
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('خطأ في حذف المحتوى');
        }
    };

    const handlePlayAudio = (audio) => {
        playTrack({
            url: audio.url,
            title: audio.title,
            reciter: selectedUlama?.name,
            id: audio.id
        }, selectedUlama?.audios || [], selectedUlama, 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
            </div>
        );
    }

    // Detail View
    if (selectedUlama) {
        return (
            <div className={`min-h-screen bg-background pb-20 ${currentAudio ? 'pb-32' : ''}`}>
                <SEO
                    title={`${selectedUlama.name} - دروس ومحاضرات`}
                    description={selectedUlama.description}
                    url={`/ulama/${selectedUlama._id}`}
                />

                {/* Header */}
                <div className="bg-[#0f172a] text-white py-12 px-4 shadow-lg">
                    <div className="container mx-auto max-w-4xl">
                        <button
                            onClick={() => setSelectedUlama(null)}
                            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
                        >
                            <span className="ml-2">→</span>
                            عودة للعلماء
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-xl overflow-hidden bg-white/10 flex items-center justify-center">
                                {selectedUlama.image ? (
                                    <img src={selectedUlama.image} alt={selectedUlama.name} className="w-full h-full object-cover" />
                                ) : (
                                    <GraduationCap className="w-16 h-16 opacity-50" />
                                )}
                            </div>
                            <div className="text-center md:text-right space-y-2 flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold font-amiri">{selectedUlama.name}</h1>
                                {selectedUlama.style && (
                                    <Badge className="bg-[#f97316] text-white">{selectedUlama.style}</Badge>
                                )}
                                <p className="text-white/60 font-changa">{selectedUlama.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="container mx-auto px-4 py-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-lg shadow border">
                            <TabsTrigger value="audios" className="flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                <span className="hidden sm:inline">صوتيات</span>
                            </TabsTrigger>
                            <TabsTrigger value="videos" className="flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                <span className="hidden sm:inline">فيديو</span>
                            </TabsTrigger>
                            <TabsTrigger value="articles" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">مقالات</span>
                            </TabsTrigger>
                            <TabsTrigger value="bio" className="flex items-center gap-2">
                                <Book className="w-4 h-4" />
                                <span className="hidden sm:inline">السيرة</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Audios Tab */}
                        <TabsContent value="audios" className="space-y-4">
                            <div className="bg-white rounded-xl border p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold font-changa">الصوتيات ({selectedUlama.audios?.length || 0})</h2>
                                    {adminEmail && (
                                        <Button
                                            onClick={() => {
                                                setIsAddingContent(!isAddingContent);
                                                setContentForm({ ...contentForm, type: 'audio' });
                                            }}
                                            className="bg-[#f97316] hover:bg-[#e0650d]"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4 ml-1" />
                                            إضافة
                                        </Button>
                                    )}
                                </div>

                                {selectedUlama.audios && selectedUlama.audios.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedUlama.audios.map((audio, idx) => {
                                            const isCurrentTrack = currentAudio?.id === audio.id;
                                            const isPlaying = isCurrentTrack && isGlobalPlaying;

                                            return (
                                                <div key={audio.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isCurrentTrack ? 'bg-[#f97316]/10 border-[#f97316]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-8 h-8 rounded flex items-center justify-center bg-[#f97316] text-white text-sm font-bold">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm font-changa">{audio.title}</p>
                                                            <p className="text-xs text-gray-600 font-changa">{audio.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handlePlayAudio(audio)}
                                                            className="hover:bg-[#f97316]/10"
                                                        >
                                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        </Button>
                                                        {adminEmail && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDeleteContent(audio.id, 'audio')}
                                                                className="hover:bg-red-100"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">لا توجد صوتيات</p>
                                )}
                            </div>
                        </TabsContent>

                        {/* Videos Tab */}
                        <TabsContent value="videos" className="space-y-4">
                            <div className="bg-white rounded-xl border p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold font-changa">الفيديو ({selectedUlama.videos?.length || 0})</h2>
                                    {adminEmail && (
                                        <Button
                                            onClick={() => {
                                                setIsAddingContent(!isAddingContent);
                                                setContentForm({ ...contentForm, type: 'video' });
                                            }}
                                            className="bg-[#f97316] hover:bg-[#e0650d]"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4 ml-1" />
                                            إضافة
                                        </Button>
                                    )}
                                </div>

                                {selectedUlama.videos && selectedUlama.videos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedUlama.videos.map((video) => (
                                            <div key={video.id} className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all bg-gray-50">
                                                <div className="relative w-full bg-gray-200 h-40 flex items-center justify-center">
                                                    {video.thumbnail ? (
                                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Video className="w-12 h-12 text-gray-400" />
                                                    )}
                                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                                                        <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity ml-1" />
                                                    </a>
                                                </div>
                                                <div className="p-3 space-y-2">
                                                    <h3 className="font-bold text-sm font-changa truncate">{video.title}</h3>
                                                    <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs">{video.category}</Badge>
                                                    {adminEmail && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteContent(video.id, 'video')}
                                                            className="w-full hover:bg-red-100 text-red-600"
                                                        >
                                                            <Trash2 className="w-3 h-3 ml-1" />
                                                            حذف
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">لا توجد فيديوهات</p>
                                )}
                            </div>
                        </TabsContent>

                        {/* Articles Tab */}
                        <TabsContent value="articles" className="space-y-4">
                            <div className="bg-white rounded-xl border p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold font-changa">المقالات ({selectedUlama.articles?.length || 0})</h2>
                                    {adminEmail && (
                                        <Button
                                            onClick={() => {
                                                setIsAddingContent(!isAddingContent);
                                                setContentForm({ ...contentForm, type: 'article' });
                                            }}
                                            className="bg-[#f97316] hover:bg-[#e0650d]"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4 ml-1" />
                                            إضافة
                                        </Button>
                                    )}
                                </div>

                                {selectedUlama.articles && selectedUlama.articles.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedUlama.articles.map((article) => (
                                            <div key={article.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start gap-3 mb-2">
                                                    <h3 className="font-bold text-sm font-changa flex-1">{article.title}</h3>
                                                    {adminEmail && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteContent(article.id, 'article')}
                                                            className="hover:bg-red-100"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs mb-2">{article.category}</Badge>
                                                <p className="text-sm text-gray-700 line-clamp-3 font-changa">{article.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">لا توجد مقالات</p>
                                )}
                            </div>
                        </TabsContent>

                        {/* Bio Tab */}
                        <TabsContent value="bio" className="space-y-4">
                            <div className="bg-white rounded-xl border p-6">
                                {selectedUlama.bio ? (
                                    <div>
                                        <p className="text-gray-700 leading-relaxed font-changa whitespace-pre-wrap">{selectedUlama.bio}</p>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8 font-changa">لا توجد سيرة ذاتية</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Add Content Form */}
                    {isAddingContent && adminEmail && (
                        <div className="mt-8 bg-white rounded-xl border p-6 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold font-changa">
                                    {contentForm.type === 'audio' && 'إضافة صوتية'}
                                    {contentForm.type === 'video' && 'إضافة فيديو'}
                                    {contentForm.type === 'article' && 'إضافة مقالة'}
                                </h3>
                                <button onClick={() => setIsAddingContent(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddContent} className="space-y-4">
                                <Input
                                    placeholder="العنوان"
                                    value={contentForm.title}
                                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                    required
                                    className="font-changa"
                                    dir="rtl"
                                />

                                <Input
                                    placeholder="الفئة/الموضوع"
                                    value={contentForm.category}
                                    onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })}
                                    className="font-changa"
                                    dir="rtl"
                                />

                                {contentForm.type !== 'article' && (
                                    <>
                                        <Input
                                            placeholder="رابط الملف"
                                            value={contentForm.url}
                                            onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                                            required
                                            className="font-changa"
                                            dir="rtl"
                                        />

                                        {contentForm.type === 'video' && (
                                            <Input
                                                placeholder="رابط الصورة المصغرة"
                                                value={contentForm.thumbnail}
                                                onChange={(e) => setContentForm({ ...contentForm, thumbnail: e.target.value })}
                                                className="font-changa"
                                                dir="rtl"
                                            />
                                        )}

                                        <Input
                                            placeholder="المدة بالثواني"
                                            type="number"
                                            value={contentForm.duration}
                                            onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                                            className="font-changa"
                                        />

                                        <Textarea
                                            placeholder="الوصف"
                                            value={contentForm.description}
                                            onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                                            className="font-changa"
                                            dir="rtl"
                                        />
                                    </>
                                )}

                                {contentForm.type === 'article' && (
                                    <Textarea
                                        placeholder="محتوى المقالة"
                                        value={contentForm.content}
                                        onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                                        required
                                        className="font-changa h-32"
                                        dir="rtl"
                                    />
                                )}

                                <div className="flex gap-2">
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                        حفظ
                                    </Button>
                                    <Button type="button" onClick={() => setIsAddingContent(false)} variant="outline">
                                        إلغاء
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title="دروس العلماء والمحاضرات الإسلامية"
                description="استمع لدروس ومحاضرات نخبة من العلماء والدعاة"
                url="/ulama"
            />

            {/* Header */}
            <div className="bg-[#0f172a] text-white py-12 px-4 shadow-lg">
                <div className="container mx-auto text-center max-w-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#f97316]">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold font-amiri mb-3">دروس العلماء</h1>
                    <p className="opacity-80 font-changa">استمع لدروس ومحاضرات نخبة من العلماء والدعاة</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Admin Section */}
                {adminEmail && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 font-changa flex justify-between items-center" dir="rtl">
                        <p>✓ وضع المسؤول مفعّل ({adminEmail})</p>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-xl border p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="ابحث عن عالم..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="font-changa"
                            dir="rtl"
                        />
                    </div>
                </div>

                {/* Add Scholar Button */}
                {adminEmail && (
                    <Button className="mb-6 bg-[#f97316] hover:bg-[#e0650d] font-changa" onClick={() => alert('استخدم admin panel: /admin/ulama')}>
                        <Plus className="w-4 h-4 ml-2" />
                        عالم جديد
                    </Button>
                )}

                {/* Scholars Grid */}
                {filteredUlama.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredUlama.map((scholar) => (
                            <div
                                key={scholar._id}
                                onClick={() => setSelectedUlama(scholar)}
                                className="group cursor-pointer p-3 rounded-lg transition-all hover:bg-gray-50 bg-white border hover:border-[#f97316]"
                            >
                                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                                    {scholar.image ? (
                                        <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <GraduationCap className="w-8 h-8 text-gray-400 group-hover:text-[#f97316]" />
                                    )}
                                </div>
                                <p className="font-bold text-xs truncate font-changa group-hover:text-[#f97316] transition-colors">{scholar.name}</p>
                                {scholar.style && (
                                    <p className="text-[10px] text-gray-600 truncate font-changa mt-1">{scholar.style}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-changa">لا توجد نتائج</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Ulama;
