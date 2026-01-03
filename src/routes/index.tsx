import { createFileRoute } from '@tanstack/react-router'
import {
  Zap,
  Server,
  Route as RouteIcon,
  Shield,
  Waves,
  Sparkles,
} from 'lucide-react'
import './index.css'

export const Route = createFileRoute('/')({ component: App })

/**
 * Home page component displaying TanStack Start features.
 */
function App() {
  const features = [
    {
      icon: <Zap className="feature-card__icon" />,
      title: 'Powerful Server Functions',
      description:
        'Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.',
    },
    {
      icon: <Server className="feature-card__icon" />,
      title: 'Flexible Server Side Rendering',
      description:
        'Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.',
    },
    {
      icon: <RouteIcon className="feature-card__icon" />,
      title: 'API Routes',
      description:
        'Build type-safe API endpoints alongside your application. No separate backend needed.',
    },
    {
      icon: <Shield className="feature-card__icon" />,
      title: 'Strongly Typed Everything',
      description:
        'End-to-end type safety from server to client. Catch errors before they reach production.',
    },
    {
      icon: <Waves className="feature-card__icon" />,
      title: 'Full Streaming Support',
      description:
        'Stream data from server to client progressively. Perfect for AI applications and real-time updates.',
    },
    {
      icon: <Sparkles className="feature-card__icon" />,
      title: 'Next Generation Ready',
      description:
        'Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.',
    },
  ]

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg"></div>
        <div className="hero__content">
          <div className="hero__header">
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className="hero__logo"
            />
            <h1 className="hero__title">
              <span className="hero__title-prefix">TANSTACK</span>{' '}
              <span className="hero__title-highlight">START</span>
            </h1>
          </div>
          <p className="hero__subtitle">
            The framework for next generation AI applications
          </p>
          <p className="hero__description">
            Full-stack framework powered by TanStack Router for React and Solid.
            Build modern applications with server functions, streaming, and type
            safety.
          </p>
          <div className="hero__cta">
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn"
            >
              Documentation
            </a>
            <p className="hero__hint">
              Begin your TanStack Start journey by editing{' '}
              <code className="hero__code">/src/routes/index.tsx</code>
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features__grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div>{feature.icon}</div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
