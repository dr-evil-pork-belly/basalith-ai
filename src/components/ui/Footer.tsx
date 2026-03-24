export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(240,237,230,0.12)' }}>

      {/* Ecosystem section */}
      <div style={{
        padding: '2rem 2rem 1.75rem',
        borderBottom: '1px solid rgba(240,237,230,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.42rem',
          letterSpacing: '0.4em',
          color: 'var(--bone4)',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
        }}>
          The Basalith Ecosystem
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
          <div style={{ flex: 1, paddingRight: '2rem' }}>
            <a
              href="https://basalith.life"
              style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--bone2)', textDecoration: 'none', display: 'block', marginBottom: '0.2rem', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--bone)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone2)')}
            >
              basalith.life
            </a>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--bone4)' }}>
              Where you begin
            </span>
          </div>

          <div style={{ width: '1px', background: 'rgba(240,237,230,0.1)', alignSelf: 'stretch', flexShrink: 0 }} />

          <div style={{ flex: 1, padding: '0 2rem' }}>
            <a
              href="https://basalith.xyz"
              style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--bone2)', textDecoration: 'none', display: 'block', marginBottom: '0.2rem', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--bone)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone2)')}
            >
              basalith.xyz
            </a>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--bone4)' }}>
              Where you build
            </span>
          </div>

          <div style={{ width: '1px', background: 'rgba(240,237,230,0.1)', alignSelf: 'stretch', flexShrink: 0 }} />

          <div style={{ flex: 1, paddingLeft: '2rem' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '0.95rem', color: 'var(--bone3)', display: 'block', marginBottom: '0.2rem' }}>
              basalith.ai
            </span>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--bone4)' }}>
              Where you continue
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.9rem', color: 'var(--silver)', letterSpacing: '0.05em' }}>
          BASALITH · <em style={{ fontWeight: 300, color: 'var(--bone3)' }}>ai</em>
        </span>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a
            href="#entity"
            style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'var(--bone4)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--silver)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone4)')}
          >
            The Entity
          </a>
          <a
            href="#founding"
            style={{ fontFamily: 'var(--mono)', fontSize: '0.44rem', letterSpacing: '0.25em', color: 'var(--bone4)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--silver)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone4)')}
          >
            Founding Access
          </a>
        </div>

        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.2em', color: 'rgba(58,56,48,0.4)', textTransform: 'uppercase' }}>
          © 2024 Basalith Sovereign Title Corp.
        </span>
      </div>
    </footer>
  )
}
