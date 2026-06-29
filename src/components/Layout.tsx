import React from 'react';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
    showLogo?: boolean;
    directorName?: string;
}

export function Layout({ children, showFooter = false, showLogo = true, directorName = 'عيد بن قيران العنزي' }: LayoutProps) {
    return (
        <div className="layout">
            <main className="layout-main">
                <div className="layout-content">
                    {showLogo && (
                        <div className="layout-logo-container">
                            <div className="layout-logo-wrapper">
                                <img 
                                    src="/school_logo.png" 
                                    alt="شعار المدرسة" 
                                    className="layout-logo-image"
                                    loading="eager"
                                />
                                <div className="layout-logo-glow"></div>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </main>
            {showFooter && (
                <footer className="layout-footer">
                    <div className="footer-content">
                        <div className="footer-text-wrapper">
                            <span className="footer-label">مدير المدرسة</span>
                            <span className="footer-name">{directorName}</span>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
