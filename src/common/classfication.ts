import type { Argument } from '@poolofdeath20/util';

type Classification = (typeof classifications)[number];

const transformCategory = (category: string) => {
	return category.toLowerCase().split(' ').join('-');
};

const parseUndefinedCategory = (
	category: string | undefined | ReadonlyArray<string>
) => {
	if (Array.isArray(category)) {
		throw new Error('classification is a string array');
	}

	return classifications.find((classing) => {
		return transformCategory(classing.category) === category;
	});
};

const parseCategory = (category: Argument<typeof parseUndefinedCategory>) => {
	if (typeof category !== 'string') {
		throw new Error('classification is not a string');
	}

	return classifications.find((classing) => {
		return transformCategory(classing.category) === category;
	});
};

const classifications = [
	{
		category: 'Alkaline Metal',
		color: '#FFAF80',
		hover: '#EF9851',
	},
	{
		category: 'Alkaline Earth Metal',
		color: '#80FF8E',
		hover: '#44E053',
	},
	{
		category: 'Lanthanide',
		color: '#C3FF80',
		hover: '#ADFE52',
	},
	{
		category: 'Actinide',
		color: '#80FFFC',
		hover: '#52C5FE',
	},
	{
		category: 'Transition Metal',
		color: '#FFEF80',
		hover: '#C1B45F',
	},
	{
		category: 'Post-Transition Metal',
		color: '#80D5FF',
		hover: '#52C5FE',
	},
	{
		category: 'Metalloid',
		color: '#8095FF',
		hover: '#526EFE',
	},
	{
		category: 'Reactive Nonmetal',
		color: '#FF80D4',
		hover: '#FE52C4',
	},
	{
		category: 'Noble Gas',
		color: '#AA80FF',
		hover: '#8B52FE',
	},
	{
		category: 'Unknown',
		color: '#FFF',
		hover: '#E0E0E0',
	},
] as const;

export type { Classification };

export { transformCategory, parseCategory, parseUndefinedCategory };
export default classifications;
