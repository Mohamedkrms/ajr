import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Heading1, Heading2, Heading3,
    AlignRight, AlignCenter, AlignLeft,
    Link as LinkIcon, Image as ImageIcon,
    Quote, Minus, Undo, Redo, Code
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

const MenuButton = ({ onClick, isActive, children, title }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-lg transition-all duration-150 ${isActive
            ? 'bg-[#f97316] text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

export default function RichTextEditor({ content, onChange, placeholder = 'ابدأ بالكتابة...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'right',
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#f97316] underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full mx-auto my-4',
                },
            }),
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-6 py-4 font-changa text-right',
                dir: 'rtl',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content]);

    const addLink = useCallback(() => {
        if (!editor) return;
        const url = prompt('أدخل رابط URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = prompt('أدخل رابط الصورة:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#f97316] focus-within:ring-1 focus-within:ring-[#f97316]/30 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
                {/* Undo / Redo */}
                <MenuButton onClick={() => editor.chain().focus().undo().run()} title="تراجع">
                    <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} title="إعادة">
                    <Redo className="w-4 h-4" />
                </MenuButton>

                <Divider />

                {/* Headings */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="عنوان رئيسي"
                >
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="عنوان فرعي"
                >
                    <Heading2 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="عنوان ثالث"
                >
                    <Heading3 className="w-4 h-4" />
                </MenuButton>

                <Divider />

                {/* Text Formatting */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="غامق"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="مائل"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="تحته خط"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="يتوسطه خط"
                >
                    <Strikethrough className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="كود"
                >
                    <Code className="w-4 h-4" />
                </MenuButton>

                <Divider />

                {/* Alignment */}
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="محاذاة يمين"
                >
                    <AlignRight className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="توسيط"
                >
                    <AlignCenter className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="محاذاة يسار"
                >
                    <AlignLeft className="w-4 h-4" />
                </MenuButton>

                <Divider />

                {/* Lists */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="قائمة نقطية"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="قائمة مرقمة"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="اقتباس"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="خط فاصل"
                >
                    <Minus className="w-4 h-4" />
                </MenuButton>

                <Divider />

                {/* Media */}
                <MenuButton onClick={addLink} isActive={editor.isActive('link')} title="رابط">
                    <LinkIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton onClick={addImage} title="صورة">
                    <ImageIcon className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Styles */}
            <style>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: right;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                    font-family: 'Changa', sans-serif;
                }
                .tiptap {
                    direction: rtl;
                    text-align: right;
                }
                .tiptap h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; font-family: 'Amiri', serif; }
                .tiptap h2 { font-size: 1.5rem; font-weight: 700; margin: 0.875rem 0 0.5rem; font-family: 'Amiri', serif; }
                .tiptap h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; font-family: 'Amiri', serif; }
                .tiptap p { margin: 0.5rem 0; line-height: 1.8; }
                .tiptap ul, .tiptap ol { padding-right: 1.5rem; margin: 0.5rem 0; }
                .tiptap li { margin: 0.25rem 0; }
                .tiptap blockquote {
                    border-right: 4px solid #f97316;
                    padding: 0.75rem 1.25rem;
                    margin: 1rem 0;
                    background: #fff7ed;
                    border-radius: 0 0.5rem 0.5rem 0;
                    color: #92400e;
                    font-style: italic;
                }
                .tiptap hr { border-color: #e5e7eb; margin: 1.5rem 0; }
                .tiptap code {
                    background: #f3f4f6;
                    padding: 0.15rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    color: #dc2626;
                }
                .tiptap img {
                    max-width: 100%;
                    border-radius: 0.75rem;
                    margin: 1rem auto;
                    display: block;
                }
                .tiptap a {
                    color: #f97316;
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
