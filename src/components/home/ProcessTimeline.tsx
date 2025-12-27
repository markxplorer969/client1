'use client'

import {
  UserCircle2,
  ShoppingBag,
  CreditCard,
  DownloadCloud,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'

const steps = [
  {
    icon: UserCircle2,
    title: 'Daftar Akun',
    description: 'Buat akun dengan Google',
    color: 'cyan'
  },
  {
    icon: ShoppingBag,
    title: 'Pesan Produk',
    description: 'Pilih produk yang diinginkan',
    color: 'blue'
  },
  {
    icon: CreditCard,
    title: 'Pembayaran',
    description: 'Lunasi dengan berbagai metode',
    color: 'purple'
  },
  {
    icon: DownloadCloud,
    title: 'Unduh Produk',
    description: 'Akses produk setelah bayar',
    color: 'emerald'
  }
]

const colorClasses = {
  cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
}

export default function ProcessTimeline() {
  return (
    <section className="relative py-24">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-gray-300 tracking-[0.2em] uppercase">
              Alur Kerja
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Proses Mudah & Cepat
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto">
            Dapatkan produk Anda dalam 4 langkah simpel. Tanpa ribet, langsung pakai.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Dashed Line */}
          <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-px bg-white/10 border-l border-dashed border-white/10 hidden md:block" />
          <div className="absolute left-8 top-8 w-px h-px hidden md:block" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1
              const colorClass = colorClasses[step.color as keyof typeof colorClasses]

              return (
                <div key={index} className="relative flex items-start gap-4 md:gap-0">
                  {/* Left - Icon Circle */}
                  <div className="relative z-20 flex-shrink-0">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${colorClass} backdrop-blur-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Connector */}
                    {!isLast && (
                      <div className="absolute left-1/2 top-16 w-px h-8 -translate-x-1/2 bg-white/5 border-l border-dashed border-white/10 hidden md:block" />
                    )}

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-1 w-8 h-8 rounded-full bg-[#0f0f0f] border-2 border-white/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Right - Content Card */}
                  <div className="flex-grow pt-4 md:pt-2 md:ml-12">
                    <div className="group relative bg-[#0f0f0f]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:ml-8 transition-all duration-300 hover:border-white/10 hover:bg-[#0f0f0f]/70">
                      {/* Hover Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="flex items-start gap-4">
                        {/* Mini Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colorClass} border opacity-50`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {step.title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-base text-gray-400 leading-relaxed font-light">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-emerald-400/20 bg-[#0f0f0f]/50 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-400 uppercase tracking-[0.15em] mb-0.5">
                100% Otomatis
              </p>
              <p className="text-xs text-gray-500">
                Produk dikirim instan setelah pembayaran
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
