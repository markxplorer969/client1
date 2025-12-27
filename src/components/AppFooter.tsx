'use client'

import Link from 'next/link'
import { Mail, Instagram, Send, ExternalLink } from 'lucide-react'

interface Contact {
  name: string
  url: string
  icon: 'mail' | 'instagram' | 'send'
}

interface LinkItem {
  name: string
  url: string
  icon: 'telegram' | 'info' | 'helper' | 'github'
}

const iconComponents = {
  mail: Mail,
  instagram: Instagram,
  send: Send,
  telegram: Send,
  info: Send,
  helper: Send,
  github: ExternalLink
}

export default function AppFooter() {
  const contacts: Contact[] = [
    { name: 'WhatsApp', url: 'https://wa.me/6281359123789', icon: 'send' },
    { name: 'Instagram', url: 'https://instagram.com/Yilzi_dominan', icon: 'instagram' },
    { name: 'Email', url: 'mailto:owner@yilziii.com', icon: 'mail' }
  ]

  const links: LinkItem[] = [
    { name: 'Telegram', url: 'https://t.me/Yilziii', icon: 'telegram' },
    { name: 'Yilzi Information', url: 'https://info.yilziii.com', icon: 'info' },
    { name: 'Helper (Portfolio)', url: 'https://yilziii.com', icon: 'helper' },
    { name: 'Script WhatsApp Bot', url: 'https://github.com/YilziiHCT', icon: 'github' }
  ]

  return (
    <footer className="relative border-t border-white/5 bg-transparent md:bg-[#202121]">
      {/* Footer Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] hidden md:block" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(229, 231, 235, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229, 231, 235, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              <span className="text-[#E5E7EB]">Yilzi</span>
              <span className="text-cyan-400">Digitalz</span>
            </h3>
            <p className="text-[#94A3B8] mb-6 leading-relaxed font-light text-sm">
              Platform produk digital premium. Script, bot, dan website dengan kualitas terbaik untuk kebutuhan bisnis Anda.
            </p>
            <div className="flex gap-3">
              {contacts.map((contact) => {
                const Icon = iconComponents[contact.icon]
                return (
                  <Link
                    key={contact.name}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center group"
                    aria-label={contact.name}
                  >
                    <Icon className="w-5 h-5 text-[#64748B] group-hover:text-cyan-400 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-[#E5E7EB] mb-4 uppercase tracking-[0.15em]">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Beranda', url: '/' },
                { name: 'Produk', url: '/products' },
                { name: 'Dashboard', url: '/dashboard' },
                { name: 'Login', url: '/login' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-[#94A3B8] hover:text-cyan-400 transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#64748B] group-hover:bg-cyan-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-semibold text-[#E5E7EB] mb-4 uppercase tracking-[0.15em]">
              Resources
            </h4>
            <ul className="space-y-3">
              {links.map((link) => {
                const Icon = iconComponents[link.icon]
                return (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#94A3B8] hover:text-purple-400 transition-colors flex items-center gap-3 group text-sm"
                    >
                      <Icon className="w-4 h-4 text-[#64748B] group-hover:text-purple-400 transition-colors" />
                      {link.name}
                      <ExternalLink className="w-3 h-3 text-[#475569] opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-12 pt-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center relative z-10">
            <p className="text-xs text-[#64748B] font-light">
              © 2025 Yilzi Digitalz. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link
                href="/privacy"
                className="text-[#64748B] hover:text-cyan-400 transition-colors font-light"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[#64748B] hover:text-cyan-400 transition-colors font-light"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
