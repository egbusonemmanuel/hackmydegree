import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LegalPage() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('terms');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['terms', 'privacy', 'rights'].includes(tab)) {
            setActiveTab(tab);
        }
        window.scrollTo(0, 0);
    }, [location]);

    const tabs = [
        { id: 'terms', label: 'Terms of Service', icon: '⚖️' },
        { id: 'privacy', label: 'Privacy Policy', icon: '🛡️' },
        { id: 'rights', label: 'Resource Rights', icon: '📝' }
    ];

    const Section = ({ title, children }) => (
        <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--primary)', fontWeight: 800 }}>{title}</h3>
            <div style={{ color: 'var(--on-surface-variant)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500 }}>
                {children}
            </div>
        </div>
    );

    return (
        <div className="page-container" style={{ maxWidth: '1000px' }}>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 className="gradient-text" style={{ fontSize: 'max(3.5rem, 5vw)', marginBottom: '1.25rem', fontWeight: 900, letterSpacing: '-0.06em' }}>Legal Center</h1>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.25rem', fontWeight: 500 }}>
                    Our commitment to transparency, security, and academic excellence.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1, minWidth: '220px', padding: '1.75rem', borderRadius: '24px',
                            background: activeTab === tab.id ? 'var(--on-surface)' : 'var(--surface-variant)',
                            border: `1px solid var(--outline-variant)`,
                            color: activeTab === tab.id ? 'var(--surface)' : 'var(--on-surface-variant)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                            cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontFamily: 'var(--font-header)', fontWeight: 800
                        }}>
                        <span style={{ fontSize: '1.5rem' }}>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="glass" style={{ borderRadius: '40px', padding: '4.5rem', border: '1px solid var(--outline-variant)' }}>
                {activeTab === 'terms' && (
                    <div className="animate-fade-in">
                        <Section title="1. Acceptance of Terms">
                            By accessing or using HackMyDegree, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. Our mission is to facilitate academic collaboration while maintaining the highest standards of integrity.
                        </Section>
                        <Section title="2. User Obligations">
                            Users must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </Section>
                        <Section title="3. Prohibited Content">
                            HackMyDegree strictly prohibits the upload of:
                            <ul>
                                <li>Copyrighted material without explicit permission.</li>
                                <li>Actual exam papers from ongoing or future examination cycles.</li>
                                <li>Harmful, discriminatory, or illegal content.</li>
                                <li>Plagiarized work presented as original.</li>
                            </ul>
                        </Section>
                        <Section title="4. Monetization & Fees">
                            Creators earn 70% of the net sale price of their resources. HackMyDegree retains a 30% commission for platform maintenance, hosting, and payment processing fees. Payments are processed through vetted providers (e.g., Paystack).
                        </Section>
                    </div>
                )}

                {activeTab === 'privacy' && (
                    <div className="animate-fade-in">
                        <Section title="1. Data Collection">
                            We collect minimal information required to provide our services: name, email, university affiliation, and professional credentials for tutors. We never sell your personal data to third parties.
                        </Section>
                        <Section title="2. Usage Data">
                            We analyze platform usage to improve our recommendation engine and ensure content quality. This includes download history, search queries, and session duration.
                        </Section>
                        <Section title="3. Payment Security">
                            We do not store credit card or bank account details on our servers. All financial transactions are handled securely by our payment partners who comply with PCIDSS standards.
                        </Section>
                        <Section title="4. Account Deletion">
                            Users may request account deletion at any time through the dashboard. Upon deletion, personal data is scrubbed, though anonymized transaction history may be retained for accounting purposes.
                        </Section>
                    </div>
                )}

                {activeTab === 'rights' && (
                    <div className="animate-fade-in">
                        <Section title="1. Ownership Statement">
                            Uploaders represent and warrant that they own or have the necessary licenses, rights, and permissions to distribute the content they upload. Uploading stolen or unauthorized material is a violation of these rights.
                        </Section>
                        <Section title="2. Licensing to HackMyDegree">
                            By uploading content, you grant HackMyDegree a non-exclusive, worldwide, royalty-free license to host, display, and distribute your material to authorized users.
                        </Section>
                        <Section title="3. Buyer Rights">
                            Purchasing or downloading a resource grants the buyer a single-user license for personal, non-commercial educational use. Redistributing, reselling, or publicly hosting downloaded materials is strictly prohibited.
                        </Section>
                        <Section title="4. Takedown Requests">
                            If you believe your intellectual property has been uploaded without permission, please contact our legal team immediately via the support channel. We act swiftly on all valid DMCA-style takedown requests.
                        </Section>
                    </div>
                )}
            </div>

            <style>{`
        ul { padding-left: 1.5rem; margin-top: 1rem; }
        li { margin-bottom: 0.5rem; }
      `}</style>
        </div>
    );
}
