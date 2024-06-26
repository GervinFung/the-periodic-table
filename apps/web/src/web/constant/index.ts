const constants = {
	repo: 'https://github.com/GervinFung/the-periodic-table',
	header: {
		id: 'header',
	},
	images: {
		generated: {
			bohr: {
				interactive: '/images/generated/bohr/interactive',
				static: '/images/generated/bohr/static',
			},
			spectrum: '/images/generated/spectrum',
			country: '/images/generated/country',
		},
	},
} as const;

export default constants;
