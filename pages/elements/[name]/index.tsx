import React from 'react';

import Link from 'next/link';

import { useRouter } from 'next/router';

import type {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
} from 'next';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import IconButton from '@mui/joy/IconButton';

import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';

import {
	Optional,
	Argument,
	DeepReadonly,
	capitalize,
} from '@poolofdeath20/util';

import data from '../../../src/web/generated/data';
import Seo from '../../../src/web/components/seo';
import BohrTwoDimensional from '../../../src/web/components/bohr/two-dimensional';
import BohrThreeDimensional from '../../../src/web/components/bohr/three-dimensional';
import { BigTile } from '../../../src/web/components/table/element';
import usePagination from '../../../src/web/hooks/pagination';

import classifications, {
	transformCategory,
} from '../../../src/common/classfication';

type Properties = Record<string, React.ReactNode>;

type GetStaticPropsType = InferGetStaticPropsType<typeof getStaticProps>;

const info = {
	section: 'none',
};

const getStaticPaths = (() => {
	return {
		fallback: false,
		paths: data.map((classification) => {
			return {
				params: {
					name: classification.name_en.toLowerCase(),
				},
			};
		}),
	};
}) satisfies GetStaticPaths;

const getStaticProps = ((context) => {
	const { name } = context.params || {};

	if (typeof name !== 'string') {
		throw new Error('Name is not a string');
	}

	return {
		props: Optional.from(
			data.find((element) => {
				return element.name_en.toLowerCase() === name;
			})
		)
			.map((element) => {
				return {
					section: info.section,
					element: {
						...element,
						path: `/elements/${element.name_en.toLowerCase()}`,
					},
				};
			})
			.unwrapOrThrow(`Element not found: ${name}`),
	};
}) satisfies GetStaticProps<
	Readonly<{
		section: string;
		element: (typeof data)[number] | undefined;
	}>
>;

const titleToId = (name: string) => {
	return name.replace(/ /g, '-').toLowerCase();
};

const filterProperties = (properties: Properties) => {
	return Object.entries(properties).filter(([_, value]) => {
		return value && value !== 'NULL';
	});
};

const Property = (
	props: Readonly<{
		name: string;
		value: React.ReactNode;
	}>
) => {
	const Value = () => {
		switch (typeof props.value) {
			case 'object': {
				return props.value;
			}
			case 'string':
			case 'number': {
				return (
					<Typography textAlign="justify">
						{props.value === '' ? 'N/A' : props.value}
					</Typography>
				);
			}
			default: {
				return null;
			}
		}
	};

	return (
		<Box>
			{props.name === 'None' ? null : (
				<Typography color="neutral">
					{props.name.replace(/_/g, ' ')}
				</Typography>
			)}
			<Value />
		</Box>
	);
};

const Properties = (
	props: DeepReadonly<{
		title: string;
		properties: Properties;
		top: number;
	}>
) => {
	const properties = filterProperties(props.properties);

	switch (properties.length) {
		case 0: {
			return null;
		}
		default: {
			return (
				<Box
					id={titleToId(props.title)}
					sx={{
						scrollMarginTop: props.top,
					}}
				>
					<Typography level="h3">{props.title}</Typography>
					<Stack spacing={3} mt={2}>
						{properties.map(([key, value]) => {
							return (
								<Property key={key} name={key} value={value} />
							);
						})}
					</Stack>
				</Box>
			);
		}
	}
};

const Color = (
	props: Readonly<{
		color: string | number;
	}>
) => {
	return (
		<Box display="flex" gap={2} alignItems="center">
			<Box
				borderRadius="50%"
				width={16}
				height={16}
				sx={{
					backgroundColor:
						typeof props.color === 'number'
							? '#FFF'
							: `#${props.color}`,
				}}
			/>
			<Typography>{`#${typeof props.color === 'number' ? props.color : props.color.toUpperCase()}`}</Typography>
		</Box>
	);
};

const generatePostfix = () => {
	const valueWithSpace = (
		prop: Readonly<{
			value: string | number;
			postfix: string;
		}>
	) => {
		return valueWithoutSpace({
			value: prop.value,
			postfix: ` ${prop.postfix}`,
		});
	};

	const valueWithoutSpace = (
		prop: Readonly<{
			value: string | number;
			postfix: string;
		}>
	) => {
		if (!prop.value) {
			return '';
		}

		return `${prop.value}${prop.postfix}`;
	};

	const temperature = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: '°K',
		});
	};

	const density = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'kg/cm³',
		});
	};

	const heat = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'kJ/mol',
		});
	};

	const heatjoule = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'J/gK',
		});
	};

	const elastic = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'GPa',
		});
	};

	const speed = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'm/s',
		});
	};

	const electrical = (value: string | number) => {
		return valueWithSpace({
			value,
			postfix: 'nΩm',
		});
	};

	return {
		valueWithSpace,
		valueWithoutSpace,
		temperature,
		density,
		heat,
		heatjoule,
		elastic,
		speed,
		electrical,
	};
};
const PaginationButton = (
	props: Readonly<{
		value: string | number;
		path: string;
		isCurrent: boolean;
	}>
) => {
	if (typeof props.value === 'string') {
		return <Typography>{props.value}</Typography>;
	}

	return (
		<Link
			href={`${props.path}/list-of-compounds?page=${props.value}`}
			style={{
				textDecoration: 'none',
			}}
		>
			<Button
				color="neutral"
				variant="plain"
				size="sm"
				sx={{
					backgroundColor: props.isCurrent
						? 'neutral.700'
						: undefined,
				}}
			>
				<Typography>{props.value}</Typography>
			</Button>
		</Link>
	);
};

const DirectionPaginationButton = (
	props: Readonly<{
		direction: 'left' | 'right';
		path: string;
		current: number;
		total: number;
	}>
) => {
	const Direction =
		props.direction === 'left'
			? MdOutlineChevronLeft
			: MdOutlineChevronRight;

	const Button = (
		props: Readonly<{
			isDisabled?: true;
		}>
	) => {
		return (
			<IconButton
				color="neutral"
				variant="plain"
				size="sm"
				disabled={props.isDisabled}
			>
				<Direction />
			</IconButton>
		);
	};

	switch (props.direction) {
		case 'left': {
			if (props.current === 1) {
				return <Button isDisabled />;
			} else {
				return (
					<Link
						href={`${props.path}/list-of-compounds?page=${props.current - 1}`}
						style={{
							textDecoration: 'none',
						}}
					>
						<Button />
					</Link>
				);
			}
		}
		case 'right': {
			if (props.current === props.total) {
				return <Button isDisabled />;
			} else {
				return (
					<Link
						href={`${props.path}/list-of-compounds?page=${props.current + 1}`}
						style={{
							textDecoration: 'none',
						}}
					>
						<Button />
					</Link>
				);
			}
		}
	}
};

const Compounds = (props: GetStaticPropsType) => {
	const { compounds } = props.element;

	if (!compounds) {
		return <Typography>There are no compound known</Typography>;
	}

	const router = useRouter();

	const [current, setCurrent] = React.useState(1);

	React.useEffect(() => {
		if (router.query.page) {
			setCurrent(
				Optional.from(router.query.page)
					.map((page) => {
						if (typeof page === 'string') {
							return parseInt(page);
						}

						throw new Error('Page is not a string');
					})
					.unwrapOrGet(1)
			);
		}
	}, [router.query.page]);

	const step = 10;

	const total = Math.ceil(compounds.matches.length / step);

	const pagination = usePagination({
		current,
		total,
		siblingCount: 1,
	});

	const range = {
		start: (current - 1) * 10,
		end: current * 10,
	};

	return (
		<Stack spacing={4}>
			<Typography textAlign="justify">
				There are total of {compounds.matches.length} compounds
				available
			</Typography>
			<Table aria-label="basic table">
				<thead>
					<tr>
						<th>Number</th>
						<th>Molecular Formula</th>
						<th>Names</th>
					</tr>
				</thead>
				<tbody>
					{compounds.matches
						.slice(range.start, range.end)
						.map((match, index) => {
							return (
								<tr key={index}>
									<td>{range.start + index + 1}</td>
									<td>{match.molecularformula}</td>
									<td>
										{match.allnames.map((name) => {
											const article = match.articles.find(
												(article) => {
													return (
														article.toLowerCase() ===
														name
													);
												}
											);

											if (!article) {
												return (
													<Typography key={name}>
														{name}
													</Typography>
												);
											}

											return (
												<Link
													key={name}
													href={`https://en.wikipedia.org/wiki/${article.replace(/ /g, '-')}`}
													style={{
														color: 'inherit',
													}}
												>
													<Typography>
														{name}
													</Typography>
												</Link>
											);
										})}
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
			<Box display="flex" justifyContent="center" gap={2}>
				<DirectionPaginationButton
					direction="left"
					path={props.element.path}
					current={current}
					total={total}
				/>
				{pagination.map((page, index) => {
					return (
						<PaginationButton
							key={index}
							value={page}
							path={props.element.path}
							isCurrent={page === current}
						/>
					);
				})}
				<DirectionPaginationButton
					direction="right"
					path={props.element.path}
					current={current}
					total={total}
				/>
			</Box>
		</Stack>
	);
};

const listOfPropertiesTitle = () => {
	return [
		'Basic Information',
		'Bohr Model',
		'Descriptive Numbers',
		'Mass',
		'Periodic Position',
		'Classification',
		'Abundance',
		'Color',
		'Atomic Radius',
		'Temperature',
		'Density',
		'Heat',
		'Speed of Sound',
		'Electrical Resistance',
		'Magnetic Properties',
		'Elasticity',
		'Hardness',
		'Etymology',
		'Discovery & Isolation',
		'Production & Use',
		'Radioactivity',
		'Electron Affinity',
		'Dipole Polarity',
		'Lattice',
		'Electron & Quantum',
		'List of Compounds',
	] as const;
};

const listOfProperties = (props: GetStaticPropsType) => {
	const { element } = props;

	const postfix = generatePostfix();

	const titles = listOfPropertiesTitle();

	return [
		{
			title: titles[0],
			properties: {
				Name: element.name_en,
				Alternative_Name: element.alternate_name,
				Atomic_Number: element.number,
				Gas_Phase: element.gas_phase,
				Allotropes: element.allotrope_names,
				Appearance: element.appearance,
				Refractive_Index: element.refractive_index,
				Phase_At_STP: element.phase_at_stp,
				Wikipedia: (
					<Link
						href={element.wikipedia}
						style={{
							textDecoration: 'none',
						}}
					>
						<Typography
							sx={{
								width: 'fit-content',
								borderBottom: '1px solid',
							}}
						>
							{element.wikipedia}
						</Typography>
					</Link>
				),
			},
		},
		{
			title: titles[1],
			properties: {
				Static: (
					<Box>
						{!element.bohrModel.static ? null : (
							<BohrTwoDimensional
								src={element.bohrModel.static}
								alt={element.name_en}
							/>
						)}
					</Box>
				),
				Interactive: (
					<Box
						sx={(theme) => {
							return {
								width: 'fit-content',
								border: `1px solid ${theme.colorSchemes.dark.palette.neutral[700]}`,
							};
						}}
					>
						{!element.bohrModel.interactive ? null : (
							<BohrThreeDimensional
								src={element.bohrModel.interactive}
								alt={element.name_en}
							/>
						)}
					</Box>
				),
			},
		},
		{
			title: titles[2],
			properties: {
				CAS_Number: element.cas_number,
				CID_Number: element.cid_number,
				DOT_Number: element.dot_number,
				RTECS_Number: element.rtecs_number,
				Mendeleev_Number: element.mendeleev_number,
				Pettifor_Number: element.pettifor_number,
				Eu_Number: element.eu_number,
				Space_Group_Number: element.space_group_number,
				Glawe_Number: element.glawe_number,
			},
		},
		{
			title: titles[3],
			properties: {
				Atomic_Mass: `${element.atomic_mass} Da`,
				Uncertainty: element.atomic_mass_uncertainty,
			},
		},
		{
			title: titles[4],
			properties: {
				X_Position: element.xpos,
				Y_Position: element.ypos,
				Period: element.period,
				Group: element.group,
			},
		},
		{
			title: titles[5],
			properties: {
				Block: element.block,
				Category: element.category_code
					.split('_')
					.map(capitalize)
					.join(' '),
				Geochemical: element.geochemical_class,
				Goldschmidt: element.goldschmidt_class,
				Electrical_Type: element.electrical_type,
			},
		},
		{
			title: titles[6],
			properties: {
				Urban_Soil: postfix.valueWithSpace({
					value: element.abundance_urban_soil,
					postfix: 'mg/kg',
				}),
				Seawater: postfix.valueWithSpace({
					value: element.abundance_seawater_w1,
					postfix: 'kg/L',
				}),
				Sun: postfix.valueWithSpace({
					value: element.abundance_sun_s1,
					postfix: 'mole ratio to silicon',
				}),
				Earth_Crust: postfix.valueWithSpace({
					value: element.abundance_in_earth_crust_c1,
					postfix: 'g',
				}),
				Human_Body: postfix.valueWithSpace({
					value: element.abundance_humans,
					postfix: '%',
				}),
				Solar_System: postfix.valueWithSpace({
					value: element.abundance_solar_system_y1,
					postfix: 'mole ratio to silicon',
				}),
				Meteorites: postfix.valueWithSpace({
					value: element.abundance_meteorite,
					postfix: '%',
				}),
			},
		},
		{
			title: titles[7],
			properties: {
				Jmol: <Color color={element.jmol_color} />,
				Molcas_Gv: <Color color={element.molcas_gv_color} />,
				CPK: <Color color={element.cpk_color} />,
			},
		},
		{
			title: titles[7],
			properties: {
				Empirical: element.atomic_radius_empirical,
				Calculated: element.atomic_radius_calculated,
				Van_Der_Waals: element.atomic_radius_vanderwaals,
				Bonding: element.vdw_radius_bondi,
				Room_Temperature: element.vdw_radius_rt,
				Batsanov: element.vdw_radius_batsanov,
				Rahm: element.atomic_radius_rahm,
				Dreiding: element.vdw_radius_dreiding,
				Uff: element.vdw_radius_uff,
				Mm3: element.vdw_radius_mm3,
				Alvarez: element.vdw_radius_alvarez,
				Bragg: element.covalent_radius_bragg,
				Truhlar: element.vdw_radius_truhlar,
				'Covalent (Single Bound)':
					element.atomic_radius_covalent_single_bond,
				'Covalent (Triple Bound)':
					element.atomic_radius_covalent_triple_bond,
				'Covalent (Cordero)': element.covalent_radius_cordero,
				'Covalent (Pyykko)': element.covalent_radius_pyykko,
				'Covalent (Pyykko Double)':
					element.covalent_radius_pyykko_double,
				'Covalent (Pyykko Triple)':
					element.covalent_radius_pyykko_triple,
				Mendeleev: element.metallic_radius_mendeleev,
				C12: element.metallic_radius_c12,
				Metallic: element.atomic_radius_metallic,
			},
		},
		{
			title: titles[9],
			properties: {
				'Melting/Freeze (USE)': postfix.temperature(element.melt_use),
				'Melting/Freeze (WEL)': postfix.temperature(element.melt_WEL),
				'Melting/Freeze (CRC)': postfix.temperature(element.melt_CRC),
				'Melting/Freeze (LNG)': postfix.temperature(element.melt_LNG),
				'Boiling/Density (USE)': postfix.temperature(element.boil_use),
				'Boiling/Density (WEL)': postfix.temperature(element.boil_WEL),
				'Boiling/Density (CRC)': postfix.temperature(element.boil_CRC),
				'Boiling/Density (LNG)': postfix.temperature(element.boil_LNG),
				'Boiling/Density (Zhang)': postfix.temperature(
					element.boil_Zhang
				),
				Curie_Point: postfix.valueWithSpace({
					value: element.curie_point,
					postfix: 'Tc',
				}),
				Superconducting_Point: postfix.temperature(
					element.superconducting_point
				),
				'Critical Temperature': postfix.temperature(
					element.critical_temperature
				),
				Flashpoint: postfix.temperature(element.flashpoint),
				Autoignition_Point: postfix.temperature(
					element.autoignition_point
				),
				Critical_Pressure: postfix.valueWithSpace({
					value: element.critical_pressure,
					postfix: 'MPa',
				}),
			},
		},
		{
			title: titles[10],
			properties: {
				STP: postfix.density(element.density_rt),
				'Solid (WEL)': postfix.density(element.density_solid_WEL),
				'Solid (CRC)': postfix.density(element.density_solid_CRC),
				'Solid (LNG)': postfix.density(element.density_solid_LNG),
				'Liquid (CR2)': postfix.density(element.density_liquid_cr2),
				Gas: postfix.density(element.density_gas),
			},
		},
		{
			title: titles[11],
			properties: {
				Molar_Volume: postfix.valueWithSpace({
					value: element.molar_volume,
					postfix: 'cm³/mol',
				}),
				Atomic_Volume: postfix.valueWithSpace({
					value: element.atomic_volume,
					postfix: 'cm³',
				}),
				Heat_Of_Fusion_USE: postfix.heat(element.enthalpy_of_fusion),
				Heat_Of_Fusion_CRC: postfix.heat(element.heat_of_fusion_crc),
				Heat_Of_Fusion_LNG: postfix.heat(element.heat_of_fusion_lng),
				Heat_Of_Fusion_WEL: postfix.heat(element.heat_of_fusion_wel),
				Evaporation_USE: postfix.heat(element.evaporation_heat),
				Evaporation_CRC: postfix.heat(element.heat_of_vaporization_crc),
				Evaporation_LNG: postfix.heat(element.heat_of_vaporization_lng),
				Evaporation_WEL: postfix.heat(element.heat_of_vaporization_wel),
				Evaporation_Zhang: postfix.heat(
					element.heat_of_vaporization_zhang
				),
				Combustion: postfix.valueWithSpace({
					value: element.heat_of_combustion,
					postfix: 'kJ/mol',
				}),
				Molar_Heat: postfix.valueWithSpace({
					value: element.molar_heat,
					postfix: 'J/molK',
				}),
				Heat_Capacity_USE: postfix.heatjoule(
					element.specific_heat_capacity
				),
				Heat_Capacity_CRC: postfix.heatjoule(element.specific_heat_crc),
				Heat_Capacity_LNG: postfix.heatjoule(element.specific_heat_lng),
				Heat_Capacity_WEL: postfix.heatjoule(element.specific_heat_wel),
				Thermal_Conductivity: postfix.valueWithSpace({
					value: element.thermal_conductivity,
					postfix: 'W/m*K',
				}),
				Thermal_Expansion: postfix.valueWithSpace({
					value: element.thermal_expansion,
					postfix: '1/K',
				}),
				Adiabatic_Index: element.adiabatic_index,
			},
		},
		{
			title: titles[12],
			properties: {
				Longitudinal: postfix.speed(
					element.speed_of_sound_longitudinal
				),
				Transversal: postfix.speed(element.speed_of_sound_transversal),
				Extensional: postfix.speed(element.speed_of_sound_extensional),
				Fluid: postfix.speed(element.speed_of_sound_fluid),
			},
		},
		{
			title: titles[13],
			properties: {
				'80k': postfix.electrical(element.electrical_resistivity_80K),
				'273k': postfix.electrical(element.electrical_resistivity_273K),
				'293k': postfix.electrical(element.electrical_resistivity_293K),
				'298k': postfix.electrical(element.electrical_resistivity_298K),
				'300k': postfix.electrical(element.electrical_resistivity_300K),
				'500k': postfix.electrical(element.electrical_resistivity_500K),
			},
		},
		{
			title: titles[14],
			properties: {
				Order: element.magnetic_ordering,
				Neel_Point: postfix.valueWithSpace({
					value: element.neel_point,
					postfix: 'Tn',
				}),
				Susceptibility: postfix.valueWithSpace({
					value: element.magnetic_susceptibility,
					postfix: 'm3/kg',
				}),
			},
		},
		{
			title: titles[15],
			properties: {
				Shear_Modulus: postfix.elastic(element.shear_modulus),
				Bulk_Modulus: postfix.elastic(element.bulk_modulus),
				Poisson_Ratio: postfix.valueWithSpace({
					value: element.poisson_ratio,
					postfix: 'ν',
				}),
				Youngs_Modulus: postfix.elastic(element.youngs_modulus),
			},
		},
		{
			title: titles[16],
			properties: {
				Mohs: element.mohs_hardness,
				Brinell: element.brinell_hardness,
				Vickers: element.vickers_hardness,
			},
		},
		{
			title: titles[17],
			properties: {
				Description: element.description,
				Language_Of_Origin: element.language_of_origin,
				Origin_Of_Word: element.origin_of_word,
				Meaning: element.meaning,
				Symbol_Origin: element.symbol_origin,
				Etymological_Description: element.etymological_description,
			},
		},
		{
			title: titles[18],
			properties: {
				'Observed/Predicted By': element.observed_predicted_by,
				'Observed/Discovery Year':
					element.observation_or_discovery_year,
				Discovery_Location: element.discovery_location,
				Isolated_Sample_By: element.isolated_sampled_by,
				Isolated_Sample_Year: element.isolation_sample_year,
				Named_By: element.named_by,
			},
		},
		{
			title: titles[19],
			properties: {
				Sources: element.sources,
				Uses: element.uses,
			},
		},
		{
			title: titles[20],
			properties: {
				Half_Life: element.half_life,
				Lifetime: element.lifetime,
				Decay_Mode: element.decay_mode,
				Neutron_Mass_Absorption: element.neutron_mass_absorption,
				Neutron_Cross_Section: element.neutron_cross_section,
			},
		},
		{
			title: titles[21],
			properties: {
				Proton_Affinity: element.proton_affinity,
				'Electron_Affinity (eV)': element.electron_affinity_eV,
				'Electron_Affinity (kJ/mol)': element.electron_affinity_kJmol,
				'Electron_Affinity (pauling)':
					element.electronegativity_pauling,
				'Electron_Affinity (allen)': element.electronegativity_allen,
				'Electron_Affinity (ghosh)': element.electronegativity_ghosh,
			},
		},
		{
			title: titles[22],
			properties: {
				Accepted: element.dipole_polarizability,
				Uncertainty: element.dipole_polarizability_unc,
				'C6 GB': element.c6_gb,
				'C6 Coefficient': element.c6_coeff,
			},
		},
		{
			title: titles[23],
			properties: {
				Constant_Internal_Default_Radius:
					element.lattice_constant_internal_default_radii,
				Constant: element.lattice_constant,
				Strucutre: element.lattice_structure,
				Angles: element.lattice_angles,
			},
		},
		{
			title: titles[24],
			properties: {
				Oxidation_States: element.oxidation_states,
				Electron_Configuration: element.electron_configuration,
				Quantum_Number: element.quantum_number,
				Electron_Configuration_Semantic:
					element.electron_configuration_semantic,
				...Array.from({ length: 8 }, (_, index) => {
					return {
						[`Shells-${index}`]: element[`shells-${index}`],
					};
				}).reduce((accumulator, value) => {
					return {
						...accumulator,
						...value,
					};
				}, {}),
				...Array.from({ length: 30 }, (_, index) => {
					return {
						[`Ionization Energies-${index}`]:
							element[`ionization_energies-${index}`],
					};
				}).reduce((accumulator, value) => {
					return {
						...accumulator,
						...value,
					};
				}, {}),
			},
		},
		{
			title: titles[25],
			properties: {
				None: <Compounds {...props} />,
			},
		},
	] as const satisfies ReadonlyArray<
		Omit<Argument<typeof Properties>, 'top'>
	>;
};

const Element = (props: GetStaticPropsType) => {
	const { element, section } = props;

	const sectionValid = section !== info.section;

	const properties = listOfProperties(props);

	const color =
		classifications.find((classification) => {
			return element.category_code
				.replace(/_/g, '-')
				.startsWith(transformCategory(classification.category));
		}) ?? classifications[9];

	const style = {
		table: {
			top: 24,
		},
	} as const;

	React.useEffect(() => {
		if (sectionValid) {
			document.getElementById(section)?.scrollIntoView();
		}
	}, [element]);

	return (
		<Box display="flex" justifyContent="center" alignItems="center" pb={8}>
			<Seo
				title={Optional.some(element.name_en)}
				description={element.description}
				keywords={[
					element.name_en,
					element.symbol,
					element.number,
					element.category_code,
					element.group,
					element.period,
					element.atomic_mass,
				]}
			/>
			<Stack spacing={6} width="90%">
				<Grid
					container
					sx={{
						position: 'relative',
					}}
				>
					<Grid
						xs={2}
						sx={() => {
							const { top } = style.table;

							return {
								overflowY: 'auto',
								position: 'sticky',
								top,
								height: `calc(100vh - ${top * 2}px)`,
							};
						}}
					>
						<Stack spacing={4}>
							<BigTile
								color={color.color}
								index={element.number}
								name={element.name_en}
								symbol={element.symbol}
								mass={element.atomic_mass}
							/>
							<Stack spacing={2}>
								{properties
									.filter((props) => {
										return filterProperties(
											props.properties
										).length;
									})
									.map((props) => {
										const id = titleToId(props.title);

										return (
											<Link
												key={id}
												href={`${element.path}/${encodeURIComponent(id)}`}
												style={{
													textDecoration: 'none',
													display: 'flex',
													gap: 5,
													alignItems: 'center',
												}}
											>
												<Typography
													sx={(theme) => {
														const borderColour =
															section === id
																? theme
																		.colorSchemes
																		.dark
																		.palette
																		.neutral[300]
																: 'transparent';

														return {
															width: 'fit-content',
															borderBottom: `1px solid ${borderColour}`,
															'&:hover': {
																color: theme
																	.colorSchemes
																	.dark
																	.palette
																	.neutral[100],
															},
														};
													}}
												>
													{props.title}
												</Typography>
											</Link>
										);
									})}
							</Stack>
						</Stack>
					</Grid>
					<Grid
						xs={9}
						sx={{
							marginLeft: 8,
						}}
					>
						<Stack spacing={6}>
							{properties.map((props, index) => {
								return (
									<Properties
										key={index}
										{...props}
										top={style.table.top}
									/>
								);
							})}
						</Stack>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
};

export { listOfPropertiesTitle, titleToId };
export { getStaticProps, getStaticPaths };

export default Element;
