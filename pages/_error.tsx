import React from 'react';

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';

import { Argument, Optional, Return, isTruthy } from '@poolofdeath20/util';

import { ErrorTile } from '../src/web/components/table/element';
import Seo from '../src/web/components/seo';

const getServerSideProps = (async (context) => {
	return {
		props: {
			statusCode: context.res.statusCode,
		},
	};
}) satisfies GetServerSideProps;

const scrambleAndShowBase = (listOfCharacters: string) => {
	return (
		props: Readonly<{
			count: number;
			content: string;
		}>
	) => {
		const generateWord = () => {
			return listOfCharacters.charAt(
				Math.floor(Math.random() * listOfCharacters.length)
			);
		};

		return Array.from(
			{
				length: props.count,
			},
			() => {
				const generatedContent = props.content
					.split('')
					.map(() => {
						const generatedWord = generateWord();

						return generatedWord !== props.content
							? generatedWord
							: generateWord();
					})
					.join('');

				return {
					content: generatedContent,
					isSame: props.content === generatedContent,
				};
			}
		).concat({
			content: props.content,
			isSame: true,
		});
	};
};

const scrambleAndShow = (
	param: Argument<Return<typeof scrambleAndShowBase>>
) => {
	const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	const lowerCaseAlphabets = alphabets.toLowerCase();

	const number = '0123456789';

	const listOfCharacters = `${alphabets}${lowerCaseAlphabets}${number}`;

	return scrambleAndShowBase(listOfCharacters)(param);
};

const useWordScramble = (
	props: Argument<typeof scrambleAndShow> &
		Readonly<{
			timeOut: number;
		}>
) => {
	type Result = Readonly<
		| {
				status: 'not-started';
		  }
		| {
				status: 'started';
				index: number;
		  }
	>;

	const words = scrambleAndShow({
		count: props.count,
		content: props.content,
	});

	const [result, setResult] = React.useState({
		previous: {
			status: 'not-started',
		} as Result,
		current: {
			status: 'not-started',
		} as Result,
	} as const);

	const ended = isTruthy(
		result.current.status === 'started' &&
			words.at(result.current.index)?.isSame
	);

	const setPreviousResult = (previous: Result) => {
		return setResult((result) => {
			return {
				...result,
				previous,
			};
		});
	};

	const setCurrentResult = (current: Result) => {
		return setResult((result) => {
			return {
				...result,
				current,
			};
		});
	};

	const changeWord = () => {
		const timer = setTimeout(() => {
			setResult((result) => {
				const { current } = result;

				return {
					...result,
					current:
						current.status === 'not-started'
							? current
							: {
									status: 'started',
									index: current.index + (ended ? 0 : 1),
								},
				};
			});
		}, props.timeOut);

		return () => {
			return clearTimeout(timer);
		};
	};

	React.useEffect(() => {
		const { previous, current } = result;

		switch (previous.status) {
			case 'started': {
				setCurrentResult(previous);
				break;
			}
			case 'not-started': {
				if (current.status === 'not-started') {
					setCurrentResult(previous);
				} else {
					if (words.at(current.index)?.isSame) {
						setCurrentResult(previous);
					} else {
						return changeWord();
					}
				}
			}
		}
	}, [result.previous.status]);

	React.useEffect(() => {
		changeWord();
	}, [result.current.status === 'started' && result.current.index]);

	return {
		word: () => {
			return result.current.status !== 'started'
				? props.content
				: words.at(result.current.index)?.content ?? props.content;
		},
		stop: () => {
			return setPreviousResult({
				status: 'not-started',
			});
		},
		start: () => {
			return setPreviousResult({
				status: 'started',
				index: 0,
			});
		},
	};
};

const Error = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	const router = useRouter();

	const name = useWordScramble({
		count: 30,
		timeOut: 30,
		content: 'Error',
	});

	const symbol = useWordScramble({
		count: 30,
		timeOut: 40,
		content: 'Err',
	});

	React.useEffect(() => {
		name.start();
		symbol.start();
	}, []);

	return (
		<Box display="flex" justifyContent="center" alignItems="center" pb={8}>
			<Seo title={Optional.some('Error')} description="" keywords={[]} />
			<Stack
				direction="row"
				spacing={6}
				width="90%"
				height="50vh"
				justifyContent="center"
				alignItems="center"
			>
				<ErrorTile
					index={props.statusCode}
					name={name.word()}
					symbol={symbol.word()}
					mass={props.statusCode}
				/>
				<Stack spacing={2}>
					<Typography level="h1" fontSize="3em" textAlign="justify">
						Element Not Found
					</Typography>
					<Typography textAlign="justify">
						We are discovering new elements right now, you should
						not be here
					</Typography>
					<Stack direction="row" spacing={1} alignItems="center">
						<Button
							variant="outlined"
							onClick={() => {
								router.replace('/');
							}}
						>
							Click here
						</Button>

						<Typography textAlign="justify">
							to go back to look at existing elements
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

export { getServerSideProps };

export default Error;
