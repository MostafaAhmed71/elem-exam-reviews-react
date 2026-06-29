import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { selectedGrade, selectedReviewType, navigateToMaterials } from '@/lib/navigation';
import { getMaterialsByGradeAndType } from '@/services/reviewService';
import { updateMaterial, deleteMaterial } from '@/services/uploadService';
import type { UploadedMaterial } from '@/types/database.types';
import './SubjectSelection.css';

export function SubjectSelection() {
    const grade = useStore(selectedGrade);
    const reviewType = useStore(selectedReviewType);
    const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMaterial, setEditingMaterial] = useState<UploadedMaterial | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Check if user is admin (access via #admin or #admin-panel)
    useEffect(() => {
        const checkAdmin = () => {
            const hash = window.location.hash;
            setIsAdmin(hash === '#admin' || hash === '#admin-panel');
        };
        
        checkAdmin();
        window.addEventListener('hashchange', checkAdmin);
        return () => window.removeEventListener('hashchange', checkAdmin);
    }, []);

    const getGradeName = (gradeId: number | null): string => {
        if (!gradeId) return '';
        const gradeNames: { [key: number]: string } = {
            1: 'الصف الأول',
            2: 'الصف الثاني',
            3: 'الصف الثالث',
            4: 'الصف الرابع',
            5: 'الصف الخامس',
            6: 'الصف السادس'
        };
        return gradeNames[gradeId] || `الصف ${gradeId}`;
    };

    const subjects = [
        'إسلاميات',
        'الدراسات الاجتماعية',
        'الرياضيات',
        'العلوم',
        'اللغة الإنجليزية',
        'اللغة العربية',
        'المهارات الحياتية',
        'تنمية المهارات',
        'توحيد',
        'فقة',
        'قرآن'
    ];

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
    }, [grade, reviewType]);

    const handleShare = async (url: string, fileName: string) => {
        // Try Web Share API first (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: fileName,
                    text: `مشاركة ملف: ${fileName}`,
                    url: url
                });
                return;
            } catch (error) {
                // User cancelled or error occurred, fall back to copy
                console.log('Share cancelled or failed:', error);
            }
        }
        
        // Fallback: Copy URL to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setMessage({ type: 'success', text: 'تم نسخ رابط الملف إلى الحافظة' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            // If clipboard API fails, show URL in alert
            alert(`رابط الملف:\n${url}`);
        }
    };

    const handleDownload = (url: string, fileName: string) => {
        // Use direct download link to avoid CORS issues
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEdit = (material: UploadedMaterial) => {
        setEditingMaterial({ ...material });
        setShowEditModal(true);
        setMessage(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
            return;
        }

        setMessage(null);
        const result = await deleteMaterial(id);
        if (result.success) {
            setMessage({ type: 'success', text: 'تم حذف المادة بنجاح' });
            // Wait a bit to ensure database is updated, then reload
            setTimeout(async () => {
                if (grade && reviewType) {
                    setLoading(true);
                    const data = await getMaterialsByGradeAndType(grade, reviewType);
                    setMaterials(data);
                    setLoading(false);
                }
            }, 500);
        } else {
            setMessage({ type: 'error', text: result.error || 'فشل حذف المادة' });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingMaterial || !editingMaterial.id) return;

        const result = await updateMaterial(editingMaterial.id, {
            grade: editingMaterial.grade,
            subject_name: editingMaterial.subject_name,
            review_type: editingMaterial.review_type,
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'تم تحديث المادة بنجاح' });
            setShowEditModal(false);
            setEditingMaterial(null);
            // Reload materials
            if (grade && reviewType) {
                const data = await getMaterialsByGradeAndType(grade, reviewType);
                setMaterials(data);
            }
        } else {
            setMessage({ type: 'error', text: result.error || 'فشل تحديث المادة' });
        }
    };

    if (loading) {
        return (
            <Layout showFooter>
                <div className="subject-selection">
                    <BackButton />
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
            <Layout showFooter>
                <div className="subject-selection">
                    <BackButton />
                    <h1 className="subject-title">لا توجد مواد متاحة</h1>
                    <p className="subject-subtitle">
                        {getGradeName(grade)} - {reviewType === 'schedule' ? 'جدول الاختبارات' : reviewType === 'solved' ? 'مراجعات محلولة' : 'مراجعات غير محلولة'}
                    </p>
                    <div className="empty-state">
                        <p className="empty-text">لم يتم رفع أي مواد لهذا الصف بعد</p>
                        <p className="empty-hint">يرجى التواصل مع المدرسة أو المحاولة لاحقاً</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showFooter>
            <div className="subject-selection">
                <BackButton />
                {isAdmin && (
                    <div className="subject-header-actions">
                        <Button
                            variant="secondary"
                            onClick={() => navigateToMaterials()}
                            className="materials-management-button"
                        >
                            إدارة جميع المواد
                        </Button>
                    </div>
                )}
                <h1 className="subject-title">
                    {reviewType === 'schedule' ? 'جدول الاختبارات' : 'اختر المادة'}
                </h1>
                <p className="subject-subtitle">
                    {getGradeName(grade)} - {reviewType === 'schedule' ? 'جدول مواعيد الاختبارات الوزارية' : reviewType === 'solved' ? 'مراجعات محلولة' : 'مراجعات غير محلولة'}
                </p>

                {message && (
                    <div className={`subject-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {reviewType === 'schedule' ? (
                    // Display schedule image directly
                    <div className="schedule-container">
                        {materials.length > 0 ? (
                            materials.map((material) => (
                                <Card key={material.id} className="schedule-card">
                                    <h2 className="schedule-title">{material.subject_name}</h2>
                                    <div className="schedule-image-wrapper">
                                        <img 
                                            src={material.file_url} 
                                            alt={material.subject_name}
                                            className="schedule-image"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = '<p class="image-error">فشل تحميل الصورة</p>';
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="schedule-actions">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleShare(material.file_url, material.file_name)}
                                            fullWidth
                                        >
                                            مشاركة الملف
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleDownload(material.file_url, material.file_name)}
                                            fullWidth
                                        >
                                            تحميل
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleEdit(material)}
                                                    fullWidth
                                                    className="subject-edit-btn"
                                                >
                                                    تعديل
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => material.id && handleDelete(material.id)}
                                                    fullWidth
                                                    className="subject-delete-btn"
                                                >
                                                    حذف
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p className="empty-text">لم يتم رفع جدول الاختبارات لهذا الصف بعد</p>
                                <p className="empty-hint">يرجى التواصل مع المدرسة أو المحاولة لاحقاً</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Display subjects list for solved/unsolved
                    <div className="subject-grid">
                        {materials.map((material) => (
                            <Card key={material.id} className="subject-card">
                                <div className="subject-name">{material.subject_name}</div>

                                <div className="subject-actions">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleShare(material.file_url, material.file_name)}
                                        fullWidth
                                    >
                                        مشاركة الملف
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleDownload(material.file_url, material.file_name)}
                                        fullWidth
                                    >
                                        تحميل
                                    </Button>
                                    {isAdmin && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleEdit(material)}
                                                fullWidth
                                                className="subject-edit-btn"
                                            >
                                                تعديل
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => material.id && handleDelete(material.id)}
                                                fullWidth
                                                className="subject-delete-btn"
                                            >
                                                حذف
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingMaterial && (
                    <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                            <h2 className="edit-modal-title">تعديل المادة</h2>
                            
                            <div className="edit-form">
                                <div className="form-group">
                                    <label className="form-label">الصف</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.grade}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            grade: parseInt(e.target.value)
                                        })}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((g) => (
                                            <option key={g} value={g}>
                                                الصف {g === 1 ? 'الأول' : g === 2 ? 'الثاني' : g === 3 ? 'الثالث' : g === 4 ? 'الرابع' : g === 5 ? 'الخامس' : 'السادس'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">المادة</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.subject_name}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            subject_name: e.target.value
                                        })}
                                    >
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">نوع المراجعة</label>
                                    <select
                                        className="form-select"
                                        value={editingMaterial.review_type}
                                        onChange={(e) => setEditingMaterial({
                                            ...editingMaterial,
                                            review_type: e.target.value as 'solved' | 'unsolved'
                                        })}
                                    >
                                        <option value="solved">محلولة</option>
                                        <option value="unsolved">غير محلولة</option>
                                    </select>
                                </div>
                            </div>

                            <div className="edit-modal-actions">
                                <Button
                                    variant="primary"
                                    onClick={handleSaveEdit}
                                    fullWidth
                                >
                                    حفظ التغييرات
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingMaterial(null);
                                    }}
                                    fullWidth
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
