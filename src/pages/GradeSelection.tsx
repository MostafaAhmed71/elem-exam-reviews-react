import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { BackButton } from '@/components/BackButton';
import { setGrade } from '@/lib/navigation';
import './GradeSelection.css';

export function GradeSelection() {
    const grades = [
        { id: 1, name: 'الصف الأول', icon: '1️⃣', color: '#3b82f6' },
        { id: 2, name: 'الصف الثاني', icon: '2️⃣', color: '#8b5cf6' },
        { id: 3, name: 'الصف الثالث', icon: '3️⃣', color: '#ec4899' },
        { id: 4, name: 'الصف الرابع', icon: '4️⃣', color: '#f59e0b' },
        { id: 5, name: 'الصف الخامس', icon: '5️⃣', color: '#10b981' },
        { id: 6, name: 'الصف السادس', icon: '6️⃣', color: '#06b6d4' },
    ];

    const handleGradeSelect = (gradeId: number) => {
        setGrade(gradeId);
    };

    return (
        <Layout showFooter showLogo={false}>
            <div className="grade-selection">
                <BackButton />
                <motion.div
                    className="grade-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grade-header-content">
                        <div className="grade-logo">
                            <img 
                                src="/school_logo.png" 
                                alt="شعار المدرسة" 
                                className="grade-logo-image"
                                loading="eager"
                            />
                            <div className="grade-logo-glow"></div>
                        </div>
                        <div className="grade-title-wrapper">
                            <p className="grade-title">اختر صفك للوصول إلى المراجعات المخصصة</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grade-grid">
                    {grades.map((grade, index) => (
                        <motion.div
                            key={grade.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                type: 'spring',
                                stiffness: 100
                            }}
                        >
                            <motion.div
                                className="grade-card"
                                onClick={() => handleGradeSelect(grade.id)}
                                style={{
                                    background: grade.color,
                                    boxShadow: `0 4px 15px ${grade.color}50, 0 0 20px ${grade.color}30`
                                }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="grade-card-content">
                                    <h2 className="grade-name">{grade.name}</h2>
                                    <div className="grade-arrow">←</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
