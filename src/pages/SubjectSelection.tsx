import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Layout } from '@/components/Layout';
import { selectedGrade, selectedReviewType, navigateBack } from '@/lib/navigation';
import { getMaterialsByGradeAndType } from '@/services/reviewService';
import type { UploadedMaterial } from '@/types/database.types';
import './SubjectSelection.css';

export function SubjectSelection() {
    const grade = useStore(selectedGrade);
    const reviewType = useStore(selectedReviewType);
    const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [message] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedFile, setSelectedFile] = useState<UploadedMaterial | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getGradeName = (gradeId: number): string => {
        const grades = [
            { id: 1, name: 'الصف الأول' },
            { id: 2, name: 'الصف الثاني' },
            { id: 3, name: 'الصف الثالث' },
            { id: 4, name: 'الصف الرابع' },
            { id: 5, name: 'الصف الخامس' },
            { id: 6, name: 'الصف السادس' },
        ];
        const grade = grades.find(g => g.id === gradeId);
        return grade ? grade.name : `الصف ${gradeId}`;
    };

    useEffect(() => {
        async function loadMaterials() {
            if (grade && reviewType) {
                setLoading(true);
                const data = await getMaterialsByGradeAndType(grade, reviewType);
                setMaterials(data);
                setLoading(false);
            }
        }

        loadMaterials();

        // Subscribe to real-time updates
        let channel: any = null;
        if (grade && reviewType) {
            (async () => {
                const { supabase } = await import('@/lib/supabase');
                if (supabase) {
                    channel = supabase
                        .channel('materials-changes')
                        .on(
                            'postgres_changes',
                            {
                                event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                                schema: 'public',
                                table: 'uploaded_materials',
                                filter: `grade=eq.${grade}`,
                            },
                            async () => {
                                // Reload materials when there's a change
                                const data = await getMaterialsByGradeAndType(grade, reviewType);
                                setMaterials(data);
                            }
                        )
                        .subscribe();
                }
            })();
        }

        // Cleanup subscription on unmount
        return () => {
            if (channel) {
                (async () => {
                    const { supabase } = await import('@/lib/supabase');
                    if (supabase) {
                        supabase.removeChannel(channel);
                    }
                })();
            }
        };
    }, [grade, reviewType]);

    const handleShareLink = async (url: string, subjectName: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `مراجعة ${subjectName}`,
                    text: `مراجعة ${subjectName} - ${grade ? getGradeName(grade) : ''}`,
                    url: url
                });
            } catch (error) {
                // User cancelled or error occurred, fallback to copy
                try {
                    await navigator.clipboard.writeText(url);
                    alert('تم نسخ الرابط إلى الحافظة');
                } catch (clipboardError) {
                    console.error('Failed to copy to clipboard:', clipboardError);
                }
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                alert('تم نسخ الرابط إلى الحافظة');
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
                // Last resort: show the URL in an alert
                alert(`الرابط: ${url}`);
            }
        }
    };

    const handleDownload = (url: string, fileName: string) => {
        // Direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCardClick = (material: UploadedMaterial, e: React.MouseEvent) => {
        // منع فتح الـ modal عند الضغط على الأزرار
        const target = e.target as HTMLElement;
        if (target.closest('.action-icon') || target.closest('.subject-actions-icons')) {
            return;
        }
        setSelectedFile(material);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    const isPDF = (url: string): boolean => {
        return url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf');
    };

    const isImage = (url: string): boolean => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };


    const getSubjectIcon = (subjectName: string): string => {
        const icons: { [key: string]: string } = {
            'مجمع': '📚',
            'إسلاميات': '📚',
            'اجتماعيات': '📚',
            'تقنية رقمية': '📚',
            'رياضيات': '🔢',
            'علوم': '🧪',
            'لغة إنجليزية': '📚',
            'لغتي': '✏️',
            'اللغة العربية': '✏️',
            'الدراسات الاجتماعية': '📚',
            'المهارات الحياتية': '📚',
            'المهارات الرقمية': '📚',
            'تنمية المهارات': '📚',
            'توحيد': '📚',
            'فقة': '📚',
            'قرآن': '📚',
        };
        return icons[subjectName] || '📚';
    };


    if (loading) {
        return (
            <Layout showFooter={false} showLogo={false}>
                <div className="subject-selection">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h1 className="subject-title">جاري التحميل...</h1>
                    </div>
                </div>
            </Layout>
        );
    }

    if (materials.length === 0) {
        return (
            <Layout showFooter={false} showLogo={false}>
                <div className="subject-selection">
                    <button 
                        className="subject-back-button"
                        onClick={navigateBack}
                        aria-label="رجوع"
                    >
                        <span className="back-icon">←</span>
                        <span className="back-text">رجوع</span>
                    </button>
                    <div className="subject-header">
                        <div className="subject-header-content">
                            <div className="subject-logo">
                                <img 
                                    src="/school_logo.png" 
                                    alt="شعار المدرسة" 
                                    className="subject-logo-image"
                                    loading="eager"
                                />
                                <div className="subject-logo-glow"></div>
                            </div>
                            <div className="subject-title-wrapper">
                                <h1 className="subject-title">
                                    {reviewType === 'schedule' ? 'جدول الاختبارات' : 'اختر المادة'}
                                </h1>
                                <p className="subject-subtitle">
                                    {grade ? getGradeName(grade) : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="empty-state">
                        <p className="empty-text">
                            {reviewType === 'schedule' 
                                ? 'لم يتم رفع جدول الاختبارات لهذا الصف بعد' 
                                : 'لم يتم رفع أي مواد لهذا الصف بعد'}
                        </p>
                    </div>
                    
                </div>
            </Layout>
        );
    }

    return (
        <Layout showFooter={false} showLogo={false}>
            <div className="subject-selection">
                {/* Background */}
                <div className="subject-background"></div>

                {/* Back Button */}
                <button 
                    className="subject-back-button"
                    onClick={navigateBack}
                    aria-label="رجوع"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">رجوع</span>
                </button>

                {/* Header */}
                <div className="subject-header">
                    <div className="subject-header-content">
                        <div className="subject-logo">
                            <img 
                                src="/school_logo.png" 
                                alt="شعار المدرسة" 
                                className="subject-logo-image"
                                loading="eager"
                            />
                            <div className="subject-logo-glow"></div>
                        </div>
                        <div className="subject-title-wrapper">
                            <h1 className="subject-title">
                                {reviewType === 'schedule' ? 'جدول الاختبارات' : 'اختر المادة'}
                            </h1>
                            <p className="subject-subtitle">
                                {grade ? getGradeName(grade) : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`subject-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Materials List */}
                <div className="subject-list">
                    {materials.map((material) => (
                        <div key={material.id}>
                            {reviewType === 'schedule' ? (
                                // Schedule Display: Image with Download and Share buttons
                                <div className="schedule-container">
                                    <div className="schedule-image-wrapper">
                                        <img 
                                            src={material.file_url} 
                                            alt={material.subject_name}
                                            className="schedule-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="schedule-actions">
                                        <button
                                            className="schedule-button download-button"
                                            onClick={() => handleDownload(material.file_url, material.file_name)}
                                            aria-label="تحميل"
                                        >
                                            <span className="button-icon">⬇</span>
                                            <span className="button-text">تحميل</span>
                                        </button>
                                        <button
                                            className="schedule-button share-button"
                                            onClick={() => handleShareLink(material.file_url, material.subject_name)}
                                            aria-label="مشاركة"
                                        >
                                            <span className="button-icon">🔗</span>
                                            <span className="button-text">مشاركة</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Regular Material Display
                                <div 
                                    className="subject-card"
                                    onClick={(e) => handleCardClick(material, e)}
                                >
                                    <div className="subject-card-content">
                                        <div className="subject-info">
                                            <div className="subject-icon">{getSubjectIcon(material.subject_name)}</div>
                                            <div className="subject-name">{material.subject_name}</div>
                                        </div>
                                        <div className="subject-actions-icons">
                                            <button
                                                className="action-icon download-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(material.file_url, material.file_name);
                                                }}
                                                aria-label="تحميل"
                                                title="تحميل"
                                            >
                                                <span>⬇</span>
                                            </button>
                                            <button
                                                className="action-icon share-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShareLink(material.file_url, material.subject_name);
                                                }}
                                                aria-label="مشاركة"
                                                title="مشاركة"
                                            >
                                                <span>🔗</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Director Name */}
               
            </div>

            {/* File Viewer Modal */}
            {isModalOpen && selectedFile && (
                <div className="file-viewer-modal" onClick={handleCloseModal}>
                    <div className="file-viewer-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="file-viewer-close"
                            onClick={handleCloseModal}
                            aria-label="إغلاق"
                        >
                            ✕
                        </button>
                        <div className="file-viewer-header">
                            <h2 className="file-viewer-title">{selectedFile.subject_name}</h2>
                        </div>
                        <div className="file-viewer-body">
                            {isImage(selectedFile.file_url) ? (
                                <img 
                                    src={selectedFile.file_url} 
                                    alt={selectedFile.subject_name}
                                    className="file-viewer-image"
                                />
                            ) : isPDF(selectedFile.file_url) ? (
                                <iframe
                                    src={selectedFile.file_url}
                                    className="file-viewer-iframe"
                                    title={selectedFile.subject_name}
                                />
                            ) : (
                                <div className="file-viewer-unsupported">
                                    <p>نوع الملف غير مدعوم للعرض المباشر</p>
                                    <button
                                        className="file-viewer-download-btn"
                                        onClick={() => {
                                            handleDownload(selectedFile.file_url, selectedFile.file_name);
                                        }}
                                    >
                                        تحميل الملف
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="file-viewer-footer">
                            <button
                                className="file-viewer-action-btn download-btn"
                                onClick={() => {
                                    handleDownload(selectedFile.file_url, selectedFile.file_name);
                                }}
                            >
                                ⬇ تحميل
                            </button>
                            <button
                                className="file-viewer-action-btn share-btn"
                                onClick={() => {
                                    handleShareLink(selectedFile.file_url, selectedFile.subject_name);
                                }}
                            >
                                🔗 مشاركة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
