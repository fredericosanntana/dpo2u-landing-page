import type { Config } from 'tailwindcss';

/**
 * DPO2U Design System — Tailwind Configuration
 *
 * Paleta de cores da marca:
 *   brand-sapphire  → azul primário (#006dff)
 *   brand-emerald   → verde/teal (#00d494)
 *   brand-purple    → roxo (#7C3AED)
 *   brand-ocean     → azul oceano (#0ea5e9)
 *   brand-platinum  → cinza claro (superfícies light)
 *   brand-chrome    → cinza escuro (superfícies dark)
 *   brand-gray      → cinza neutro (textos e bordas)
 *
 * Tokens semânticos:
 *   primary   → brand-sapphire-500 (#006dff)
 *   secondary → brand-emerald-500 (#00d494)
 *   accent    → brand-purple-500 (#7C3AED)
 *
 * NOTA: brand-blue, brand-green, brand-purple (flat) são aliases legados
 * mantidos para compatibilidade retroativa. Novos componentes devem usar
 * brand-sapphire, brand-emerald e brand-purple (nested).
 */

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: ['class'],
	theme: {
		extend: {
			colors: {
				// ── Paleta de marca (nested, uso preferido) ──────────────────────
				brand: {
					sapphire: {
						'50':  '#f0f7ff',
						'100': '#e0efff',
						'200': '#c7e4ff',
						'300': '#a5d4ff',
						'400': '#5ca8ff',
						'500': '#006dff', // DPO2U primary blue
						'600': '#005ce6',
						'700': '#004cbf',
						'800': '#003d99',
						'900': '#002e73',
						'950': '#001a4d',
					},
					emerald: {
						'50':  '#ecfdf5',
						'100': '#d1fae5',
						'200': '#a7f3d0',
						'300': '#6ee7b7',
						'400': '#34d399',
						'500': '#00d494', // DPO2U primary green
						'600': '#00b377',
						'700': '#00925f',
						'800': '#006b47',
						'900': '#004430',
						'950': '#002b1e',
					},
					purple: {
						'50':  '#faf5ff',
						'100': '#f3e8ff',
						'200': '#e9d5ff',
						'300': '#d8b4fe',
						'400': '#c084fc',
						'500': '#7C3AED', // DPO2U primary purple
						'600': '#6D28D9',
						'700': '#5B21B6',
						'800': '#4C1D95',
						'900': '#3B0764',
						'950': '#2e0552',
					},
					ocean: {
						'50':  '#f0f9ff',
						'100': '#e0f2fe',
						'200': '#bae6fd',
						'300': '#7dd3fc',
						'400': '#38bdf8',
						'500': '#0ea5e9',
						'600': '#0284c7',
						'700': '#0369a1',
						'800': '#075985',
						'900': '#0c4a6e',
					},
					platinum: {
						'50':  '#fcfcfd',
						'100': '#f8fafc',
						'200': '#f1f5f9',
						'300': '#e2e8f0',
						'400': '#cbd5e1',
						'500': '#8892a6',
						'600': '#64748b',
						'700': '#475569',
						'800': '#334155',
						'900': '#1e293b',
					},
					chrome: {
						'50':  '#fafafa',
						'100': '#f4f4f5',
						'200': '#e4e4e7',
						'300': '#d4d4d8',
						'400': '#a1a1aa',
						'500': '#71717a',
						'600': '#52525b',
						'700': '#3f3f46',
						'800': '#27272a',
						'900': '#18181b',
						'950': '#0d0d0f',
					},
				},

				// ── Tokens semânticos (shadcn/Radix compatível) ──────────────────
				primary: {
					'50':      '#f0f7ff',
					'500':     '#006dff',
					'900':     '#002e73',
					DEFAULT:   '#006dff',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT:   '#00d494',
					foreground: '#ffffff',
				},
				accent: {
					DEFAULT:   '#7C3AED',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT:   '#f1f5f9',
					foreground: '#334155',
				},
				background: '#ffffff',
				foreground:  '#0f172a',

				// ── Aliases legados (flat) — compatibilidade retroativa ───────────
				'brand-blue': {
					'50':  '#f0f7ff',
					'100': '#e0efff',
					'200': '#c7e4ff',
					'300': '#a5d4ff',
					'400': '#5ca8ff',
					'500': '#006dff',
					'600': '#005ce6',
					'700': '#004cbf',
					'800': '#003d99',
					'900': '#002e73',
				},
				'brand-green': {
					'50':  '#ecfdf5',
					'100': '#d1fae5',
					'200': '#a7f3d0',
					'300': '#6ee7b7',
					'400': '#34d399',
					'500': '#00d494',
					'600': '#00b377',
					'700': '#00925f',
					'800': '#006b47',
					'900': '#004430',
				},
				'brand-purple': {
					'50':  '#faf5ff',
					'100': '#f3e8ff',
					'200': '#e9d5ff',
					'300': '#d8b4fe',
					'400': '#c084fc',
					'500': '#7C3AED',
					'600': '#6D28D9',
					'700': '#5B21B6',
					'800': '#4C1D95',
					'900': '#3B0764',
				},
				'brand-gray': {
					'50':  '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
				},
				// Sobrescrever gray padrão do Tailwind (evita aparência marrom)
				gray: {
					'50':  '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
				},
				// Cor semântica para textos escuros em títulos
				'brand-text-dark': '#0f172a',

				// ── APEX Liquid Glass palette ────────────────────────────────────
				apex: {
					bg:         '#050510',
					surface:    '#0a0a1a',
					accent:     '#006dff',
					'accent-dim':'#005ce6',
					heading:    '#fafafa',
					muted:      '#a1a1aa',
				},

				// ── Editorial / Cryptographic Modernism palette ──────────────────
				// Inspired by cryptography papers + Brazilian modernist architecture.
				ink: {
					DEFAULT: '#0C0D10',  // warm near-black
					soft:    '#14161B',  // slightly lighter
					deeper:  '#06070A',  // for voids
				},
				paper: {
					DEFAULT: '#F1ECE3',  // cream paper
					warm:    '#E8E1D4',  // slightly more ochre
					cold:    '#EDEDE5',  // neutral cream
				},
				cobalt: {
					'50':  '#EEF1F9',
					'100': '#D5DDF0',
					'200': '#A9B8DE',
					'300': '#7A8EC7',
					'400': '#4C66AE',
					'500': '#1E3A8F',  // primary cobalt (deep, serious)
					'600': '#182E72',
					'700': '#112256',
					'800': '#0B173B',
					'900': '#06102B',
				},
				terracotta: {
					'50':  '#FBEEE9',
					'100': '#F5D8CC',
					'200': '#ECB39A',
					'300': '#E08B69',
					'400': '#D46D47',
					'500': '#C85C3B',  // primary warm accent
					'600': '#A24A2E',
					'700': '#7D3823',
					'800': '#552518',
					'900': '#30140D',
				},
				verdigris: {
					'50':  '#EDF2F1',
					'100': '#D3DEDC',
					'200': '#A9BDB9',
					'300': '#7F9C97',
					'400': '#5E827C',
					'500': '#4A7C74',  // quiet teal-green accent
					'600': '#3A635C',
					'700': '#2C4B45',
					'800': '#1D322F',
					'900': '#0F1A18',
				},
				concrete: {
					'50':  '#F4F4F3',
					'100': '#E5E5E2',
					'200': '#C9C9C4',
					'300': '#A7A7A0',
					'400': '#7F7F76',
					'500': '#5E5E55',  // warm gray — the "concrete" of Brutalism
					'600': '#4A4A42',
					'700': '#36362F',
					'800': '#26261F',
					'900': '#17170F',
				},

				// ── Status colors ────────────────────────────────────────────────
				success: '#00d494',
				warning: '#f59e0b',
				error:   '#ef4444',
				info:    '#006dff',
			},

			fontFamily: {
				display:   ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
				editorial: ['Instrument Serif', 'Fraunces', 'Georgia', 'serif'],
				heading:   ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
				sans:      ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
				mono:      ['JetBrains Mono', 'Fira Code', 'monospace'],
				serif:     ['Fraunces', 'Georgia', 'serif'],
				geist:     ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
			},

			spacing: {
				'18':  '4.5rem',
				'88':  '22rem',
				'128': '32rem',
			},

			animation: {
				'fade-in':       'fadeIn 0.5s ease-in-out',
				'slide-up':      'slideUp 0.6s ease-out',
				'slide-down':    'slideDown 0.6s ease-out',
				'scale-in':      'scaleIn 0.3s ease-out',
				float:           'float 3s ease-in-out infinite',
				'pulse-subtle':  'pulseSubtle 2s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up':   'accordion-up 0.2s ease-out',
				marquee:         'marquee 30s linear infinite',
				shimmer:         'shimmer 3s linear infinite',
			},

			keyframes: {
				fadeIn: {
					'0%':   { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%':   { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				slideDown: {
					'0%':   { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				scaleIn: {
					'0%':   { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%':      { transform: 'translateY(-10px)' },
				},
				pulseSubtle: {
					'0%, 100%': { opacity: '1' },
					'50%':      { opacity: '0.8' },
				},
				'accordion-down': {
					from: { height: '0' },
					to:   { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to:   { height: '0' },
				},
				marquee: {
					'0%':   { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				},
				shimmer: {
					'0%':   { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},

			backgroundImage: {
				'gradient-hero':    'linear-gradient(135deg, #006dff 0%, #00d494 100%)',
				'gradient-premium': 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
				'gradient-chrome':  'linear-gradient(135deg, #71717a 0%, #27272a 100%)',
				'gradient-ocean':   'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
				'gradient-luxury':  'linear-gradient(135deg, #8892a6 0%, #334155 100%)',
				'gradient-tech':    'linear-gradient(135deg, #006dff 0%, #0369a1 100%)',
				'gradient-success': 'linear-gradient(135deg, #00d494 0%, #00b377 100%)',
				'gradient-card':    'linear-gradient(145deg, #fcfcfd 0%, #f8fafc 100%)',
				'gradient-dark':    'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
				'gradient-midnight':'linear-gradient(135deg, #0d0d0f 0%, #18181b 50%, #002e73 100%)',
			},

			boxShadow: {
				card:       '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
				'card-hover':'0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
				hero:       '0 25px 50px -12px rgba(0,0,0,0.25)',
				subtle:     '0 1px 2px 0 rgba(0,0,0,0.05)',
				brand:      '0 4px 14px 0 rgba(0,109,255,0.2)',
				'brand-lg': '0 8px 30px 0 rgba(0,109,255,0.3)',
			},

			borderRadius: {
				xl:   '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},

			container: {
				center: true,
				padding: '1rem',
				screens: {
					sm:   '640px',
					md:   '768px',
					lg:   '1024px',
					xl:   '1280px',
					'2xl':'1400px',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
} satisfies Config;

export default config;
