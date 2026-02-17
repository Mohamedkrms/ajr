import { useState, useEffect } from 'react';
import axios from 'axios';
import { PenLine, Calendar, User, Send, Loader2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', author: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = () => {
        axios.get('http://localhost:5000/api/posts')
            .then(response => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/posts', {
                title: form.title,
                content: form.content,
                author: form.author || 'مجهول',
            });
            setForm({ title: '', content: '', author: '' });
            setShowForm(false);
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
                <Skeleton className="h-12 w-1/3 mb-8" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">المدونة الإسلامية</h2>
                    <p className="text-muted-foreground mt-1">شارك خواطرك وتأملاتك مع المجتمع</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'إلغاء' : <><Plus className="w-4 h-4 ml-2" /> كتابة مقال</>}
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <Card className="animate-in fade-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>مقال جديد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">العنوان</label>
                                <Input
                                    placeholder="عنوان المقال..."
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">الكاتب</label>
                                <Input
                                    placeholder="اسمك (اختياري)"
                                    value={form.author}
                                    onChange={e => setForm({ ...form, author: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">المحتوى</label>
                                <Textarea
                                    placeholder="اكتب مقالك هنا..."
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    rows={6}
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                                    نشر المقال
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Posts */}
            {posts.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                    <PenLine className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold">لا توجد مقالات بعد</h3>
                    <p className="text-muted-foreground text-sm mb-4">كن أول من يشارك أفكاره!</p>
                    <Button variant="outline" onClick={() => setShowForm(true)}>ابدأ الكتابة</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <Card key={post._id} className="overflow-hidden hover:shadow-md transition-all">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl leading-relaxed">{post.title}</CardTitle>
                                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md border min-w-fit">
                                        {new Date(post.date).toLocaleDateString('ar-EG', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                    <User className="w-3 h-3" />
                                    <span>{post.author}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <p className="text-foreground/80 leading-loose whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Blog;
