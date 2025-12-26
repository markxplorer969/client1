'use client'

import Link from 'next/link'
import { Mail, Instagram, Send } from 'lucide-react'

interface Contact {
  name: string
  url: string
}

interface LinkItem {
  name: string
  url: string
}

export default function AppFooter() {
  const contacts: Contact[] = [
    { name: 'WhatsApp', url: 'https://wa.me/6281359123789' },
    { name: 'Instagram', url: 'https://instagram.com/Yilzi_dominan' },
    { name: 'Email', url: 'mailto:owner@yilziii.com' }
  ]

  const links: LinkItem[] = [
    { name: 'Telegram', url: 'https://t.me/Yilziii' },
    { name: 'Yilzi Information', url: 'https://info.yilziii.com' },
    { name: 'Helper (Portfolio)', url: 'https://yilziii.com' },
    { name: 'Script WhatsApp Bot', url: 'https://github.com/YilziiHCT' }
  ]

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Yilzi Digitalz
            </h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Website Shop resmi, khusus untuk menjual Kebutuhan Digital dari Yilzi.
              Solusi digital terbaik untuk kebutuhan bisnis Anda.
            </p>
            <div className="flex gap-4">
              {contacts.map((contact) => {
                const Icon = contact.name === 'Email' ? Mail : contact.name === 'Instagram' ? Instagram : Send
                return (
                  <Link
                    key={contact.name}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={contact.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 Yilzi Digitalz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
