import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { navigateTo } from '@/lib/navigation';
import './TermsScreen.css';

export function TermsScreen() {
    const [isAccepted, setIsAccepted] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAccepted(e.target.checked);
    };

    const handleContinue = () => {
        navigateTo('grade');
    };

    const instructions = [
        {
            type: 'paragraph',
            content: 'عزيزي وليّ الأمر:'
        },
        {
            type: 'paragraph',
            content: 'نودّ التأكيد على أن هذه المراجعات شاملة لجميع أجزاء المنهج الدراسي، وقد تم إعدادها لتكون مرجعًا أساسيًا يساعد الطالب على الإلمام الكامل بالمادة الدراسية.'
        },
        {
            type: 'paragraph',
            content: 'ورغبةً من إدارة المدرسة في تعويد الطالب على الاختبارات الوزارية، فقد تم تصميم المراجعات بهذا الشكل الشامل والميسّر للمادة الدراسية بالكامل.'
        },
        {
            type: 'paragraph',
            content: 'ونظرًا لأن الاختبارات أصبحت الآن اختبارات وزارية تُعدّ مركزيًا من قبل إدارة التعليم، ولا علاقة للمدرسة بوضع أسئلة الاختبار،'
        },
        {
            type: 'paragraph',
            content: 'عليه، فإننا نؤكد على أهمية قيام الطالب بـ:'
        },
        {
            type: 'list',
            items: [
                'مراجعة جميع أوراق المراجعات المرسلة عبر هذه المنصة بشكل كامل ودقيق'
            ]
        },
        
    ];

    return (
        <Layout showFooter directorName=" عيد بن قيران العنزي" showLogo={false}>
            <div className="terms-screen">
                <BackButton />
                <motion.div
                    className="terms-main-card card-enhanced border-glow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo */}
                    <div className="terms-logo">
                        <img 
                            src="/school_logo.png" 
                            alt="شعار المدرسة" 
                            className="terms-logo-image"
                            loading="eager"
                        />
                        <div className="terms-logo-glow"></div>
                    </div>

                    {/* Header */}
                    <h1 className="terms-title heading-shadow">تعليمات ولي الأمر</h1>
                    <p className="terms-subtitle">يرجى قراءة التعليمات بعناية قبل المتابعة</p>

                    {/* Content */}
                    <div className="terms-content">
                        {instructions.map((instruction, index) => (
                            instruction.type === 'paragraph' ? (
                                <p key={index} className="term-paragraph text-enhanced">{instruction.content}</p>
                            ) : instruction.type === 'list' && instruction.items ? (
                                <ul key={index} className="term-list">
                                    {instruction.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="term-list-item">{item}</li>
                                    ))}
                                </ul>
                            ) : null
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="terms-actions">
                        <motion.div
                            className="terms-checkbox-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label className="terms-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="terms-checkbox"
                                    checked={isAccepted}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="terms-checkbox-text">
                                    أقر بأنني قرأت وفهمت جميع التعليمات المذكورة أعلاه
                                </span>
                            </label>
                        </motion.div>

                        {isAccepted && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handleContinue}
                                    className="continue-button button-enhanced ripple-effect"
                                >
                                    المتابعة
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
