/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#5e6ad2',
          text: '#fff',
        },
        
        // Background Colors
        background: {
          primary: '#08090a',
          secondary: '#1c1c1f',
          tertiary: '#232326',
          quaternary: '#28282c',
          quinary: '#282828',
          level0: '#08090a',
          level1: '#0f1011',
          level2: '#141516',
          level3: '#191a1b',
          tint: '#141516',
          marketing: '#010102',
          translucent: 'rgba(255,255,255,.05)',
        },
        
        // Text Colors
        text: {
          primary: '#f7f8f8',
          secondary: '#d0d6e0',
          tertiary: '#8a8f98',
          quaternary: '#62666d',
        },
        
        // Foreground Colors
        foreground: {
          primary: '#f7f8f8',
          secondary: '#d0d6e0',
          tertiary: '#8a8f98',
          quaternary: '#62666d',
        },
        
        // Border Colors
        border: {
          primary: '#23252a',
          secondary: '#34343a',
          tertiary: '#3e3e44',
          translucent: 'rgba(255,255,255,.05)',
        },
        
        // Line Colors
        line: {
          primary: '#37393a',
          secondary: '#202122',
          tertiary: '#18191a',
          quaternary: '#141515',
          tint: '#141516',
        },
        
        // Accent Colors
        accent: {
          primary: '#7170ff',
          hover: '#828fff',
          tint: '#18182f',
          indigo: '#5e6ad2',
        },
        
        // Link Colors
        link: {
          primary: '#828fff',
          hover: '#fff',
        },
        
        // Status Colors
        status: {
          red: '#eb5757',
          orange: '#fc7840',
          yellow: '#f2c94c',
          green: '#4cb782',
          blue: '#4ea7fc',
        },
        
        // Linear Specific Colors
        linear: {
          plan: '#68cc58',
          build: '#d4b144',
          security: '#7a7fad',
        },
        
        // Selection Colors
        selection: {
          bg: '#5e6ad2',
          text: '#fff',
        },
      },
      
      // Typography
      fontFamily: {
        sans: [
          'Inter Variable',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'Berkeley Mono',
          'ui-monospace',
          'SF Mono',
          'Menlo',
          'monospace',
        ],
        serif: [
          'Tiempos Headline',
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
      },
      
      fontSize: {
        // Headings
        'title-9': ['4.5rem', { lineHeight: '1', letterSpacing: '-.022em' }],
        'title-8': ['4rem', { lineHeight: '1.06', letterSpacing: '-.022em' }],
        'title-7': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-.022em' }],
        'title-6': ['3rem', { lineHeight: '1.1', letterSpacing: '-.022em' }],
        'title-5': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-.022em' }],
        'title-4': ['2rem', { lineHeight: '1.125', letterSpacing: '-.022em' }],
        'title-3': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-.012em' }],
        'title-2': ['1.3125rem', { lineHeight: '1.33', letterSpacing: '-.012em' }],
        'title-1': ['1.0625rem', { lineHeight: '1.4', letterSpacing: '-.012em' }],
        
        // Body Text
        'large': ['1.0625rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'regular': ['.9375rem', { lineHeight: '1.6', letterSpacing: '-.011em' }],
        'small': ['.875rem', { lineHeight: '1.5', letterSpacing: '-.013em' }],
        'mini': ['.8125rem', { lineHeight: '1.5', letterSpacing: '-.01em' }],
        'micro': ['.75rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'tiny': ['.625rem', { lineHeight: '1.5', letterSpacing: '-.015em' }],
      },
      
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '510',
        semibold: '590',
        bold: '680',
      },
      
      // Border Radius
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'circle': '50%',
      },
      
      // Box Shadows
      boxShadow: {
        'none': '0px 0px 0px transparent',
        'tiny': '0px 0px 0px transparent',
        'low': '0px 2px 4px rgba(0,0,0,.1)',
        'medium': '0px 4px 24px rgba(0,0,0,.2)',
        'high': '0px 7px 32px rgba(0,0,0,.35)',
        'stack-low': '0px 8px 2px 0px transparent,0px 5px 2px 0px rgba(0,0,0,.01),0px 3px 2px 0px rgba(0,0,0,.04),0px 1px 1px 0px rgba(0,0,0,.07),0px 0px 1px 0px rgba(0,0,0,.08)',
      },
      
      // Spacing
      spacing: {
        'header': '64px',
        'page-inline': '24px',
        'page-block': '64px',
        'min-tap': '44px',
      },
      
      maxWidth: {
        'page': '1024px',
        'prose': '624px',
      },
      
      // Animation
      transitionTimingFunction: {
        'in-quad': 'cubic-bezier(.55,.085,.68,.53)',
        'out-quad': 'cubic-bezier(.25,.46,.45,.94)',
        'in-out-quad': 'cubic-bezier(.455,.03,.515,.955)',
        'in-cubic': 'cubic-bezier(.55,.055,.675,.19)',
        'out-cubic': 'cubic-bezier(.215,.61,.355,1)',
        'in-out-cubic': 'cubic-bezier(.645,.045,.355,1)',
        'in-quart': 'cubic-bezier(.895,.03,.685,.22)',
        'out-quart': 'cubic-bezier(.165,.84,.44,1)',
        'in-out-quart': 'cubic-bezier(.77,0,.175,1)',
        'in-quint': 'cubic-bezier(.755,.05,.855,.06)',
        'out-quint': 'cubic-bezier(.23,1,.32,1)',
        'in-out-quint': 'cubic-bezier(.86,0,.07,1)',
        'in-expo': 'cubic-bezier(.95,.05,.795,.035)',
        'out-expo': 'cubic-bezier(.19,1,.22,1)',
        'in-out-expo': 'cubic-bezier(1,0,0,1)',
        'in-circ': 'cubic-bezier(.6,.04,.98,.335)',
        'out-circ': 'cubic-bezier(.075,.82,.165,1)',
        'in-out-circ': 'cubic-bezier(.785,.135,.15,.86)',
      },
      
      transitionDuration: {
        'quick': '100ms',
        'regular': '250ms',
      },
    },
  },
  plugins: [],
}

