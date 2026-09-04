import React from 'react';

/**
 * Barrière d'erreur.
 *
 * Sans elle, une exception dans n'importe quel composant fait démonter tout
 * l'arbre React : le visiteur se retrouve devant une page entièrement blanche,
 * sans explication ni moyen de repartir. C'est le symptôme le plus déroutant
 * qui soit, parce qu'il ne laisse aucune trace visible.
 *
 * Ici, l'erreur est interceptée, affichée lisiblement, et le visiteur garde
 * deux issues : recharger, ou revenir à l'accueil. Le détail technique reste
 * accessible pour le diagnostic, replié par défaut.
 */

interface Props {
  children: React.ReactNode;
}

interface State {
  erreur: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { erreur: null };

  static getDerivedStateFromError(erreur: Error): State {
    return { erreur };
  }

  componentDidCatch(erreur: Error, info: React.ErrorInfo) {
    // Conservé en console : c'est ce qui permet de comprendre l'incident
    // quand un visiteur le signale.
    console.error('Erreur interceptée par la barrière :', erreur, info.componentStack);
  }

  render() {
    const { erreur } = this.state;
    if (!erreur) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', padding: '24px',
        fontFamily: 'system-ui, "Segoe UI", sans-serif',
      }}>
        <div style={{
          maxWidth: '540px', width: '100%', background: '#fff', borderRadius: '20px',
          padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,.07)', textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '30px',
          }}>⚠️</div>

          <h1 style={{
            margin: '0 0 12px', fontSize: '24px', color: '#0f172a',
            fontFamily: 'Georgia, serif',
          }}>
            Cette page n'a pas pu s'afficher
          </h1>

          <p style={{ margin: '0 0 28px', color: '#475569', lineHeight: 1.7, fontSize: '15px' }}>
            Un incident technique est survenu de notre côté. Le reste du site
            fonctionne : rechargez la page, ou revenez à l'accueil.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#0f172a', color: '#fff', border: 0, padding: '13px 26px',
                borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}
            >
              Recharger la page
            </button>
            <a
              href="/"
              style={{
                background: '#fff', color: '#0f172a', border: '2px solid #e2e8f0',
                padding: '11px 26px', borderRadius: '10px', fontWeight: 700,
                fontSize: '14px', textDecoration: 'none',
              }}
            >
              Retour à l'accueil
            </a>
          </div>

          <details style={{ marginTop: '28px', textAlign: 'left' }}>
            <summary style={{
              cursor: 'pointer', color: '#94a3b8', fontSize: '12px',
              textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700,
            }}>
              Détail technique
            </summary>
            <pre style={{
              marginTop: '12px', padding: '14px', background: '#f1f5f9', borderRadius: '8px',
              fontSize: '11px', color: '#475569', overflowX: 'auto', whiteSpace: 'pre-wrap',
            }}>{erreur.message}</pre>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
              Si le problème persiste, transmettez ce message à kongoscience25@gmail.com.
            </p>
          </details>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
