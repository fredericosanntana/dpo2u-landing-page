import type { Config } from 'tailwindcss';

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
				brand: {
					sapphire: {
						'50': '#f0f7ff',
						'100': '#e0efff',
						'200': '#c7e4ff',
						'300': '#a5d4ff',
						'400': '#84c5ff',
						'500': '#4F46E5', /* LEANN Enhanced: DPO2U primary blue */
						'600': '#4338CA', /* LEANN Enhanced: darker blue */
						'700': '#3730A3',
						'800': '#312E81',
						'900': '#1E1B4B'
					},
					platinum: {
						'50': '#fcfcfd',
						'100': '#f8fafc',
						'200': '#f1f5f9',
						'300': '#e2e8f0',
						'400': '#cbd5e1',
						'500': '#8892a6',
						'600': '#64748b',
						'700': '#475569',
						'800': '#334155',
						'900': '#1e293b'
					},
					emerald: {
						'50': '#ecfdf5',
						'100': '#d1fae5',
						'200': '#a7f3d0',
						'300': '#6ee7b7',
						'400': '#34d399',
						'500': '#00d494',
						'600': '#00b377',
						'700': '#00925f',
						'800': '#006b47',
						'900': '#004430'
					},
					purple: {
						'50': '#faf5ff',
						'100': '#f3e8ff',
						'200': '#e9d5ff',
						'300': '#d8b4fe',
						'400': '#c084fc',
						'500': '#7C3AED', /* LEANN Enhanced: DPO2U primary purple */
						'600': '#6D28D9', /* Fixed: was brown #7C2D12 */
						'700': '#6B21A8',
						'800': '#581C87',
						'900': '#4C1D95'
					},
					ocean: {
						'50': '#f0f9ff',
						'100': '#e0f2fe',
						'200': '#bae6fd',
						'300': '#7dd3fc',
						'400': '#38bdf8',
						'500': '#0ea5e9',
						'600': '#0284c7',
						'700': '#0369a1',
						'800': '#075985',
						'900': '#0c4a6e'
					},
					chrome: {
						'50': '#fafafa',
						'100': '#f4f4f5',
						'200': '#e4e4e7',
						'300': '#d4d4d8',
						'400': '#a1a1aa',
						'500': '#71717a',
						'600': '#52525b',
						'700': '#3f3f46',
						'800': '#27272a',
						'900': '#18181b'
					}
				},
				primary: {
					'50': '#eff6ff',
					'500': '#0066CC',
					'900': '#003366',
					DEFAULT: '#0066CC',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#10b981',
					foreground: '#ffffff'
				},
				accent: {
					DEFAULT: '#a855f7',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#f1f5f9',
					foreground: '#334155'
				},
				background: '#ffffff',
				foreground: '#0f172a',
				'brand-blue': {
					'50': '#f2f7fd',
					'100': '#e6f0fb',
					'200': '#bfd7f3',
					'300': '#99bdec',
					'400': '#3385d9',
					'500': '#0066CC',
					'600': '#005bb8',
					'700': '#004c99',
					'800': '#003a73',
					'900': '#00264d'
				},
				'brand-green': {
					'50': '#ecfdf5',
					'100': '#d1fae5',
					'200': '#a7f3d0',
					'300': '#6ee7b7',
					'400': '#34d399',
					'500': '#00d494',
					'600': '#00b377',
					'700': '#00925f',
					'800': '#006b47',
					'900': '#004430'
				},
				'brand-purple': {
					'50': '#f5f3ff',
					'100': '#ede9fe',
					'200': '#ddd6fe',
					'300': '#c4b5fd',
					'400': '#a78bfa',
					'500': '#6b46c1',
					'600': '#5b3aa7',
					'700': '#4c2f8c',
					'800': '#3d2471',
					'900': '#2e1a57'
				},
				'brand-gray': {
					'50': '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a'
				},
				success: '#10b981',
				warning: '#f59e0b',
				error: '#ef4444',
				info: '#3b82f6'
			},
			fontFamily: {
				serif: [
					'Playfair Display',
					'Times New Roman',
					'serif'
				],
				sans: [
					'Inter',
					'system-ui',
					'sans-serif'
				]
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'slide-down': 'slideDown 0.6s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				float: 'float 3s ease-in-out infinite',
				'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				slideUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideDown: {
					'0%': {
						opacity: '0',
						transform: 'translateY(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				scaleIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				pulseSubtle: {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			backgroundImage: {
				'gradient-hero': 'linear-gradient(135deg, #006dff 0%, #00d494 100%)',
				'gradient-premium': 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
				'gradient-chrome': 'linear-gradient(135deg, #71717a 0%, #27272a 100%)',
				'gradient-ocean': 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
				'gradient-luxury': 'linear-gradient(135deg, #8892a6 0%, #334155 100%)',
				'gradient-tech': 'linear-gradient(135deg, #006dff 0%, #0369a1 100%)',
				'gradient-success': 'linear-gradient(135deg, #00d494 0%, #00b377 100%)',
				'gradient-card': 'linear-gradient(145deg, #fcfcfd 0%, #f8fafc 100%)',
				'gradient-dark': 'linear-gradient(135deg, #18181b 0%, #27272a 100%)'
			},
			boxShadow: {
				card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				hero: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
			},
			borderRadius: {
				xl: '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem'
			},
			container: {
				center: true,
				padding: '1rem',
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1280px',
					'2xl': '1400px'
				}
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
} satisfies Config;

export default config;
