export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(240,237,230,0.10)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '0.9rem', color: 'var(--silver)', letterSpacing: '0.05em' }}>
          BASALITH · AI
        </span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {[
          { label: 'basalith.life', href: 'https://basalith.life' },
          { label: 'basalith.xyz', href: 'https://basalith.xyz' },
          { label: 'The Entity', href: '#entity' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.44rem',
              letterSpacing: '0.25em',
              color: 'var(--bone4)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--silver)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--bone4)')}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.42rem', letterSpacing: '0.2em', color: 'rgba(58,56,48,0.3)', textTransform: 'uppercase' }}>
          © 2024 Basalith Sovereign Title Corp.
        </span>
      </div>
    </footer>
  )
}
