import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { BackButton } from '@/components/BackButton';
import { useStore } from '@nanostores/react';
import { selectedGrade, setReviewType } from '@/lib/navigation';
import './ReviewTypeSelection.css';

export function ReviewTypeSelection() {
    const grade = useStore(selectedGrade);

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

    const reviewTypes = [
        {
            id: 'schedule',
            name: 'جدول الاختبارات',
            icon: '📅',
            description: 'جدول مواعيد الاختبارات الوزارية',
            color: '#f59e0b',
            backgroundColor: '#f59e0b' /* لون ثابت بدون تدرج */
        },
        {
            id: 'solved',
            name: 'مراجعات محلولة',
            icon: '✅',
            description: 'مراجعات شاملة مع الحلول النموذجية',
            color: '#10b981',
            backgroundColor: '#10b981' /* لون ثابت بدون تدرج */
        },
        {
            id: 'unsolved',
            name: 'مراجعات غير محلولة',
            icon: '📝',
            description: 'مراجعات للتدريب والممارسة الذاتية',
            color: '#3b82f6',
            backgroundColor: '#3b82f6' /* لون ثابت بدون تدرج */
        }
    ];

    const handleTypeSelect = (type: 'schedule' | 'solved' | 'unsolved') => {
        setReviewType(type);
    };

    return (
        <Layout showFooter showLogo={false}>
            <div className="review-type-selection">
                <BackButton />
                <motion.div
                    className="review-type-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="review-type-header-content">
                        <div className="review-type-logo">
                            <img 
                                src="/school_logo.png" 
                                alt="شعار المدرسة" 
                                className="review-type-logo-image"
                                loading="eager"
                            />
                            <div className="review-type-logo-glow"></div>
                        </div>
                        <div className="review-type-title-wrapper">
                            <h1 className="review-type-title">اختر نوع المراجعة</h1>
                            <p className="review-type-subtitle">
                                {getGradeName(grade)} - اختر النوع المناسب لاحتياجاتك
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="review-type-grid">
                    {reviewTypes.map((type, index) => (
                        <motion.div
                            key={type.id}
                            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + index * 0.1,
                                type: 'spring',
                                stiffness: 100
                            }}
                        >
                            <Card
                                className="review-type-card"
                                onClick={() => handleTypeSelect(type.id as 'schedule' | 'solved' | 'unsolved')}
                            >
                                <motion.div
                                    className="review-type-card-content"
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div
                                        className="review-type-icon-wrapper"
                                        style={{ backgroundColor: type.backgroundColor }}
                                    >
                                        <div className="review-type-icon">{type.icon}</div>
                                    </div>
                                    <h2 className="review-type-name">{type.name}</h2>
                                    <p className="review-type-description">{type.description}</p>
                                    <div className="review-type-arrow">
                                        <span>اختيار</span>
                                        <span className="arrow-icon">←</span>
                                    </div>
                                </motion.div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

            
                    
              
            </div>
        </Layout>
    );
}
