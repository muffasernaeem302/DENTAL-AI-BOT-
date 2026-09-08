import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { ArrowRight, MessageSquare, Calendar, Shield, Sparkles } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4c-3 0-6 3-6 7 0 3 2 5 4 6v1a1 1 0 001 1h2a1 1 0 001-1v-1c2-1 4-3 4-6 0-4-3-7-6-7z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-neutral-900">DentalAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
              <Link to="/login"><Button>Get Started</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> AI-Powered Dental Assistant
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">Smarter dental care for your clinic</h1>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
            Streamline patient intake, automate scheduling, and provide intelligent assistance with our AI-powered platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login"><Button size="lg">Start Free Trial <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">View Demo</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-neutral-600">Intelligent chatbot for patient questions and pre-visit guidance</p>
            </Card>
            <Card hover className="text-center">
              <div className="w-12 h-12 rounded-xl bg-dental-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-dental-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-neutral-600">Automated booking and reminders to reduce no-shows</p>
            </Card>
            <Card hover className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-neutral-600">HIPAA-conscious design with enterprise security</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your practice?</h2>
        <p className="text-primary-100 mb-8">Join hundreds of dental clinics using DentalAI</p>
        <Link to="/login"><Button variant="secondary" size="lg" className="bg-white text-primary-700">Get Started <ArrowRight className="w-4 h-4" /></Button></Link>
      </section>

      <footer className="bg-neutral-900 text-neutral-400 py-8 text-center">
        <p className="text-sm">© 2024 DentalAI. <strong>Disclaimer:</strong> DentalAI assists with admin tasks only, not medical advice.</p>
      </footer>
    </div>
  )
}
