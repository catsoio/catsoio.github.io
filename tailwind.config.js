/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		extend: {
			colors: {
				veraGold: '#d4af37',
				veraBronze: '#b08d57',
				coal: '#0b0b0b',
				ink: '#0f0f10',
			},
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
				],
			},
			letterSpacing: {
				wider2: '0.08em',
			},
		},
	},
	plugins: [],
};
