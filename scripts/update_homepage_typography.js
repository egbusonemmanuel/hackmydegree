const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Hero Eyebrow
content = content.replace(
  `            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '1.75rem',
            border: '1px solid rgba(188, 149, 92, 0.25)',
            letterSpacing: '0.5px'`,
  `            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(188, 149, 92, 0.25)',
            letterSpacing: '0.06em'`
);

// 2. Hero H1
content = content.replace(
  `          <h1 style={{
            fontSize: 'clamp(2.4rem, 7vw, 4.4rem)',
            lineHeight: 1.06,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-header)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--on-surface)'
          }}>`,
  `          <h1 style={{
            fontSize: 'clamp(2.1rem, 5vw, 2.85rem)',
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-header)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--on-surface)'
          }}>`
);

// 3. Hero Lead paragraph
content = content.replace(
  `          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            lineHeight: 1.6
          }}>`,
  `          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
            maxWidth: '620px',
            margin: '0 auto 2rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            lineHeight: 1.6
          }}>`
);

// 4. Hero CTA buttons
content = content.replace(
  `                padding: '0.95rem 2rem',
                fontSize: '0.96rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 800,`,
  `                padding: '0.85rem 1.85rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 600,`
);

content = content.replace(
  `                padding: '0.95rem 1.85rem',
                fontSize: '0.96rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <SparklesIcon size={16} color="var(--primary)" />
                <span>Launch DegreeAI</span>`,
  `                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.25s ease'
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <SparklesIcon size={16} color="var(--primary)" />
                <span>Launch DegreeAI</span>`
);

content = content.replace(
  `                padding: '0.95rem 1.85rem',
                fontSize: '0.96rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.35)';
              }}
            >
              <span>💡 What is HackMyDegree? (App Guide)</span>`,
  `                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-header)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.35)';
              }}
            >
              <span>💡 What is HackMyDegree? (App Guide)</span>`
);

// 5. Dual Engine Specification section
content = content.replace(
  `                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                <span>⚡ PLATFORM SPECIFICATION & ARCHITECTURE</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)',
                fontFamily: 'var(--font-header)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                margin: '0 0 1rem',
                lineHeight: 1.15
              }}>`,
  `                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.85rem',
                letterSpacing: '0.06em'
              }}>
                <span>⚡ PLATFORM SPECIFICATION & ARCHITECTURE</span>
              </div>
              <h2 style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
                fontFamily: 'var(--font-header)',
                fontWeight: 700,
                letterSpacing: '-0.015em',
                margin: '0 0 0.85rem',
                lineHeight: 1.25
              }}>`
);

// 6. Dual Engine Card Titles & Badges
content = content.replace(
  `                      color: '#60A5FA',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '100px'
                    }}>
                      ENGINE 1 • FOR ALL UNDERGRADUATES
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>
                    Academic Excellence
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#60A5FA', fontWeight: 700, margin: '0 0 1rem' }}>`,
  `                      color: '#60A5FA',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.7rem',
                      borderRadius: '100px'
                    }}>
                      ENGINE 1 • FOR ALL UNDERGRADUATES
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.4rem', color: 'var(--on-surface)' }}>
                    Academic Excellence
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#60A5FA', fontWeight: 500, margin: '0 0 1rem' }}>`
);

content = content.replace(
  `                      color: '#FBBF24',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '100px'
                    }}>
                      ENGINE 2 • EARN WHILE YOU LEARN
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 0.5rem', color: 'var(--on-surface)' }}>
                    Student Financial Freedom
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#FBBF24', fontWeight: 700, margin: '0 0 1rem' }}>`,
  `                      color: '#FBBF24',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.7rem',
                      borderRadius: '100px'
                    }}>
                      ENGINE 2 • EARN WHILE YOU LEARN
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.4rem', color: 'var(--on-surface)' }}>
                    Student Financial Freedom
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#FBBF24', fontWeight: 500, margin: '0 0 1rem' }}>`
);

// Engine list item title weights (from 800 to 600)
content = content.replace(
  `<div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--on-surface)' }}>{item.t}</div>`,
  `<div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-surface)' }}>{item.t}</div>`
);
content = content.replace(
  `<div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--on-surface)' }}>{item.t}</div>`,
  `<div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-surface)' }}>{item.t}</div>`
);

// Engine buttons weight (from 800 to 600)
content = content.replace(`fontWeight: 800,\n                      fontSize: '0.88rem',\n                      cursor: 'pointer',\n                      textAlign: 'center'\n                    }}>\n                      Open Academic Vault →`, `fontWeight: 600,\n                      fontSize: '0.875rem',\n                      cursor: 'pointer',\n                      textAlign: 'center'\n                    }}>\n                      Open Academic Vault →`);
content = content.replace(`fontWeight: 800,\n                      fontSize: '0.88rem',\n                      cursor: 'pointer',\n                      textAlign: 'center'\n                    }}>\n                      Sell Your Notes →`, `fontWeight: 600,\n                      fontSize: '0.875rem',\n                      cursor: 'pointer',\n                      textAlign: 'center'\n                    }}>\n                      Sell Your Notes →`);
content = content.replace(`fontWeight: 700,\n                      fontSize: '0.88rem',\n                      cursor: 'pointer'\n                    }}>\n                      DegreeAI Copilot`, `fontWeight: 600,\n                      fontSize: '0.875rem',\n                      cursor: 'pointer'\n                    }}>\n                      DegreeAI Copilot`);
content = content.replace(`fontWeight: 700,\n                      fontSize: '0.88rem',\n                      cursor: 'pointer'\n                    }}>\n                      Skills Hub`, `fontWeight: 600,\n                      fontSize: '0.875rem',\n                      cursor: 'pointer'\n                    }}>\n                      Skills Hub`);

// 7. DegreeAI Showcase Section
content = content.replace(
  `                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)',
                  fontFamily: 'var(--font-header)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.15
                }}>`,
  `                <h2 style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)',
                  fontFamily: 'var(--font-header)',
                  fontWeight: 700,
                  letterSpacing: '-0.015em',
                  margin: '0 0 0.85rem 0',
                  lineHeight: 1.25
                }}>`
);
content = content.replace(
  `fontWeight: 800,\n                      fontSize: '0.92rem',\n                      cursor: 'pointer',\n                      display: 'flex',\n                      alignItems: 'center',\n                      gap: '0.5rem',`,
  `fontWeight: 600,\n                      fontSize: '0.92rem',\n                      cursor: 'pointer',\n                      display: 'flex',\n                      alignItems: 'center',\n                      gap: '0.5rem',`
);
content = content.replace(
  `<div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>{feat.title}</div>`,
  `<div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>{feat.title}</div>`
);

// 8. Categories Grid
content = content.replace(
  `<span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.75rem' }}>Browse</span>\n              <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', marginTop: '0.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Core Categories</h2>`,
  `<span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Browse</span>\n              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', marginTop: '0.4rem', fontWeight: 700, letterSpacing: '-0.015em' }}>Core Categories</h2>`
);
content = content.replace(
  `<h3 style={{ fontSize: '1.15rem', color: 'var(--on-surface)', fontWeight: 800, fontFamily: 'var(--font-header)' }}>{cat.name}</h3>`,
  `<h3 style={{ fontSize: '1.15rem', color: 'var(--on-surface)', fontWeight: 600, fontFamily: 'var(--font-header)' }}>{cat.name}</h3>`
);

// 9. Latest Resources
content = content.replace(
  `<span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Hot</span>\n                <h2 style={{ fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', marginTop: '0.5rem' }}>Latest Resources</h2>`,
  `<span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Hot</span>\n                <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', marginTop: '0.4rem', fontWeight: 700 }}>Latest Resources</h2>`
);
content = content.replace(
  `background: 'var(--primary-container)', fontWeight: 800, fontSize: '0.9rem',`,
  `background: 'var(--primary-container)', fontWeight: 600, fontSize: '0.9rem',`
);
content = content.replace(
  `<h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>{res.title}</h3>`,
  `<h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.35 }}>{res.title}</h3>`
);

// 10. Elite Tutors
content = content.replace(
  `<span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem' }}>Mentorship</span>\n              <h2 style={{ fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', marginTop: '0.5rem' }}>Elite Tutors</h2>`,
  `<span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Mentorship</span>\n              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', marginTop: '0.4rem', fontWeight: 700 }}>Elite Tutors</h2>`
);
content = content.replace(
  `<h3 style={{ fontSize: '1.2rem' }}>{tutor.profile?.full_name || tutor.profile?.username}</h3>`,
  `<h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{tutor.profile?.full_name || tutor.profile?.username}</h3>`
);
content = content.replace(
  `fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'\n                        }}>Reserve Session</button>`,
  `fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'\n                        }}>Reserve Session</button>`
);

// 11. High-Income Digital Skills section
content = content.replace(
  `<h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15 }}>\n                  High-Income Digital Skills <br />\n                  <span style={{ color: 'var(--primary)' }}>To Fund Your University Degree.</span>\n                </h2>`,
  `<h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.25 }}>\n                  High-Income Digital Skills <br />\n                  <span style={{ color: 'var(--primary)' }}>To Fund Your University Degree.</span>\n                </h2>`
);
content = content.replace(
  `fontWeight: 800,\n                    fontSize: '0.92rem',\n                    cursor: 'pointer',\n                    display: 'flex',\n                    alignItems: 'center',\n                    gap: '0.4rem',`,
  `fontWeight: 600,\n                    fontSize: '0.92rem',\n                    cursor: 'pointer',\n                    display: 'flex',\n                    alignItems: 'center',\n                    gap: '0.4rem',`
);
content = content.replace(
  `<h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>{item.title}</h3>`,
  `<h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>{item.title}</h3>`
);

// 12. Empower Your Course Mates & Footer
content = content.replace(
  `<h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Empower Your Course Mates</h2>`,
  `<h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 700, marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>Empower Your Course Mates</h2>`
);
content = content.replace(
  `<span style={{ fontFamily: 'var(--font-header)', fontWeight: 900, fontSize: '2rem', color: 'var(--primary)', letterSpacing: '-0.04em' }}>`,
  `<span style={{ fontFamily: 'var(--font-header)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated HomePage.jsx typography to Coursera scale!');
