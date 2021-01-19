import { Box, Heading, Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Input } from '@chakra-ui/react';

const gainTypes = [
	{
		name: 'Kp',
		increment: 1
	},
	{
		name: 'Ki',
		increment: 0.01
	},
	{
		name: 'Kd',
		increment: 1
	}
];

function GainAdjust({ gains, setGains }) {
	const handleGains = (e, variable, value) => {
		console.log(variable, value);
		setGains({ ...gains, [variable]: Math.round((gains[variable] + value) * 100) / 100 });
	};

	return (
		<Flex
			border="2px"
			borderColor="blue.500"
			borderRadius="md"
			m="3"
			flexWrap="wrap"
			justify="center"
			align="center"
		>
			{gainTypes.map((g) => (
				<Box w="100%" m="1">
					<Text fontSize="xl" mr="1" fontWeight="700">
						{g.name}
					</Text>
					<Flex align="center" name={g.name} justify="space-around" w="100%">
						<Text
							m="2"
							fontWeight="700"
							fontSize="3xl"
							onClick={(e) => {
								handleGains(e, g.name, -g.increment);
							}}
						>
							-
						</Text>
						<Text m="2" fontWeight="700" fontSize="xl" color={gains[g.name] > 0 ? 'teal.500' : 'red.500'}>
							{gains[g.name]}
						</Text>

						<Text
							m="2"
							fontWeight="700"
							fontSize="3xl"
							onClick={(e) => {
								handleGains(e, g.name, g.increment);
							}}
						>
							+
						</Text>
					</Flex>
				</Box>
			))}
		</Flex>
	);
}

export default GainAdjust;
