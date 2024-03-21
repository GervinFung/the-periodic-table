import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import ExternalLink from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import { CiMenuBurger } from 'react-icons/ci';
import { SiGithub } from 'react-icons/si';

import { Defined } from '@poolofdeath20/util';

import constants from '../../../constant';

import useBreakpoint from '../../../hooks/break-point';
import { useHeight } from '../../../hooks/dimension';

const useHeaderHeight = () => {
	const [height, setHeight] = React.useState(0);

	React.useEffect(() => {
		setHeight(
			Defined.parse(document.getElementById(constants.header.id)).orThrow(
				'Header is not defined'
			).clientHeight
		);
	}, []);

	return height;
};

const Header = () => {
	const size = 32;

	const height = useHeight();

	const breakpoint = useBreakpoint();

	const links = [
		{
			name: 'Home',
			href: '/',
			isExternal: false,
		},
		{
			name: 'Compounds',
			href: '/compounds',
			isExternal: false,
		},
		{
			href: constants.repo,
			isExternal: true,
		},
	];

	return (
		<Box
			id={constants.header.id}
			display="flex"
			justifyContent="center"
			width="100%"
			sx={(theme) => {
				return {
					position: {
						xs: 'sticky',
						sm: undefined,
					},
					top: {
						xs: 0,
						sm: undefined,
					},
					backgroundColor: 'inherit',
					zIndex: 2,
					borderBottom: height
						? `1px solid ${theme.palette.background.level2}`
						: undefined,
				};
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				pt={1}
				pb={1}
				width="90%"
			>
				<Box
					sx={{
						pt: {
							xs: 1,
							sm: undefined,
						},
						pr: {
							xs: 2,
							sm: undefined,
						},
					}}
				>
					<Link
						href="/"
						style={{
							textDecoration: 'none',
						}}
					>
						<Box>
							<Image
								alt="logo"
								src="/images/icons/android/android-launchericon-144-144.png"
								width={size}
								height={size}
							/>
						</Box>
					</Link>
				</Box>
				{breakpoint === 'xs' ? (
					<Dropdown>
						<MenuButton
							variant="plain"
							sx={{
								py: 1,
								pl: 2,
								pr: 0,
							}}
						>
							<CiMenuBurger fontSize="1.50em" />
						</MenuButton>
						<Menu variant="soft" size="sm">
							{links.map((link) => {
								switch (link.isExternal) {
									case false: {
										return (
											<MenuItem key={link.href}>
												<Link
													href={link.href}
													style={{
														textDecoration: 'none',
													}}
												>
													<Typography level="body-lg">
														{link.name}
													</Typography>
												</Link>
											</MenuItem>
										);
									}
									case true: {
										return (
											<MenuItem key={link.href}>
												<ExternalLink
													href={link.href}
													target="_blank"
													rel="external nofollow noopener noreferrer"
												>
													<Typography level="body-lg">
														Github
													</Typography>
												</ExternalLink>
											</MenuItem>
										);
									}
								}
							})}
						</Menu>
					</Dropdown>
				) : (
					<Stack spacing={6} direction="row" alignItems="center">
						{links.map((link) => {
							switch (link.isExternal) {
								case false: {
									return (
										<Link
											key={link.href}
											href={link.href}
											style={{
												textDecoration: 'none',
											}}
										>
											<Typography>{link.name}</Typography>
										</Link>
									);
								}
								case true: {
									return (
										<ExternalLink
											key={link.href}
											href={link.href}
											target="_blank"
											rel="external nofollow noopener noreferrer"
										>
											<IconButton size="sm">
												<SiGithub
													fontSize="1.65em"
													textDecoration="none"
												/>
											</IconButton>
										</ExternalLink>
									);
								}
							}
						})}
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export { useHeaderHeight };

export default Header;
