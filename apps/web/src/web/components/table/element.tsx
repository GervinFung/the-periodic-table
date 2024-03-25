import React from 'react';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography, { type TypographyProps } from '@mui/joy/Typography';

import { type DeepReadonly } from '@poolofdeath20/util';

import useBreakpoint from '../../hooks/break-point';

const EmptyTile = () => {
	return <div />;
};

const Tile = (
	props: DeepReadonly<{
		index: number;
		name: string;
		symbol: string;
		mass: number;
		isHighlighted: boolean;
		isMatch: undefined | boolean;
		color: {
			color: string;
			hover: string;
		};
	}>
) => {
	const breakpoint = useBreakpoint();

	const sx = {
		color: props.isHighlighted ? 'background.level1' : props.color.color,
	};

	const Description = (
		nestProps: Readonly<{
			value: string | number;
		}>
	) => {
		const fontSize = {
			xs: undefined,
			md: '0.40rem',
			lg: '0.50rem',
		} as const satisfies TypographyProps['fontSize'];

		return (
			<Typography
				fontSize={fontSize}
				level={breakpoint?.includes('s') ? 'body-lg' : undefined}
				sx={sx}
			>
				{nestProps.value}
			</Typography>
		);
	};

	return (
		<Card
			variant="soft"
			size="sm"
			sx={{
				opacity: props.isMatch === false ? 0.5 : undefined,
				backgroundColor: props.isHighlighted
					? props.color.color
					: 'background.level1',
				'&:hover':
					props.isMatch === false
						? undefined
						: {
								backgroundColor: props.isHighlighted
									? props.color.hover
									: 'background.level2',
							},
			}}
		>
			<CardContent>
				<Description value={props.index} />
				<Typography
					level={
						breakpoint?.includes('l')
							? 'body-lg'
							: breakpoint?.includes('s')
								? 'h1'
								: 'body-md'
					}
					sx={sx}
				>
					{props.symbol}
				</Typography>
				<Description value={props.name} />
				<Description value={props.mass} />
			</CardContent>
		</Card>
	);
};

const DemoTile = () => {
	const Description = (
		props: Readonly<{
			value: string;
		}>
	) => {
		return (
			<Typography color="neutral" fontSize="0.65rem" fontWeight="normal">
				{' '}
				({props.value})
			</Typography>
		);
	};

	return (
		<Card
			variant="soft"
			size="md"
			sx={{
				width: 'fit-content',
			}}
		>
			<CardContent>
				<Typography level="body-md">
					36 <Description value="index" />
				</Typography>
				<Typography level="h2">
					Ne
					<Description value="symbol" />
				</Typography>
				<Typography level="body-md">
					Neon <Description value="name" />
				</Typography>
				<Typography level="body-md">
					20.17976 <Description value="mass" />
				</Typography>
			</CardContent>
		</Card>
	);
};

const BigTile = (
	props: DeepReadonly<{
		index: number;
		name: string;
		symbol: string;
		mass: number;
		color: string;
	}>
) => {
	const sx = {
		color: 'background.level1',
	} as const satisfies TypographyProps['sx'];

	const Description = (
		props: Readonly<{
			value: string | number;
		}>
	) => {
		return (
			<Typography level="body-lg" sx={sx}>
				{props.value}
			</Typography>
		);
	};

	return (
		<Card
			variant="soft"
			size="md"
			sx={{
				backgroundColor: props.color,
				height: 130,
				width: 130,
			}}
		>
			<CardContent>
				<Description value={props.index} />
				<Typography level="h2" sx={sx}>
					{props.symbol}
				</Typography>
				<Description value={props.name} />
				<Description value={props.mass} />
			</CardContent>
		</Card>
	);
};

const ErrorTile = (
	props: DeepReadonly<{
		index: number;
		name: string;
		symbol: string;
		mass: number;
	}>
) => {
	const Description = (
		props: Readonly<{
			value: string | number;
		}>
	) => {
		return (
			<Typography level="h4" color="neutral">
				{props.value}
			</Typography>
		);
	};

	return (
		<Card
			variant="soft"
			size="lg"
			sx={{
				width: 150,
			}}
		>
			<CardContent>
				<Description value={props.index} />
				<Typography level="h1" fontSize="2.5em">
					{props.symbol}
				</Typography>
				<Description value={props.name} />
				<Description value={props.mass} />
			</CardContent>
		</Card>
	);
};

export { Tile, EmptyTile, BigTile, DemoTile, ErrorTile };
