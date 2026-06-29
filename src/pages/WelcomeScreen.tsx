import { useEffect, useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { navigateTo } from '@/lib/navigation';
import './WelcomeScreen.css';

export function WelcomeScreen() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const screenRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        // Loading animation simulation
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsLoaded(true), 100);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Parallax effect on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!screenRef.current || !logoRef.current) return;
            const scrolled = window.scrollY;
            const logoCard = logoRef.current;
            logoCard.style.transform = `translateY(${scrolled * 0.3}px)`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Swipe gesture detection
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;

        if (isLeftSwipe) {
            navigateTo('terms');
        }
    };

    const handleStartClick = () => {
        navigateTo('terms');
    };

    return (
        <Layout showFooter showLogo={false}>
            <div 
                className="welcome-screen"
                ref={screenRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Animated Background */}
                <div className="animated-background">
                    <div className="bg-particle"></div>
                    <div className="bg-particle"></div>
                    <div className="bg-particle"></div>
                    <div className="bg-particle"></div>
                    <div className="bg-particle"></div>
                </div>

                {/* Gradient Overlay */}
                <div className="gradient-overlay"></div>

                {/* Loading Animation */}
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                {/* Main Content - Single Card */}
                <div className={`welcome-content-wrapper ${isLoaded ? 'loaded' : ''}`}>
                    <div className="welcome-main-card" ref={logoRef}>
                        {/* Logo */}
                        <div className="welcome-logo">
                            <img 
                                src="/school_logo.png" 
                                alt="شعار المدرسة" 
                                className="logo-image"
                                loading="eager"
                            />
                            <div className="logo-glow"></div>
                        </div>

                        {/* Content */}
                        <h1 className="welcome-title">
                            <span className="welcome-title-line1">أهلًا ومرحبًا بكم في</span>
                            <br />
                            <span className="welcome-title-line2">منصة النخبة للمراجعات النهائية</span>
                            <span className="welcome-title-line3">للفترة الثانية من الفصل الدراسي الثاني</span>
                        </h1>

                        

                        {/* Start Button */}
                        <div className="start-dots">
                            <div className="start-dot"></div>
                            <div className="start-dot"></div>
                            <div className="start-dot"></div>
                        </div>
                        <Button 
                            variant="primary" 
                            fullWidth 
                            className="start-button"
                            onClick={handleStartClick}
                        >
                           
                            ابدأ
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
