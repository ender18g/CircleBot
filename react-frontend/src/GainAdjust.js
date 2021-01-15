import { Box, Heading, Flex, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Input } from '@chakra-ui/react';

function GainAdjust({ gains, setGains }) {
	const handleGains = (e) => {
		setGains({ ...gains, [e.target.name]: e.target.value });
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
			<Box m="1">
				<Text mr="1" fontWeight="700">
					Kp
				</Text>
				<Input name="Kp" value={gains.Kp} width="100px" onChange={handleGains} />
			</Box>
			<Box m="1">
				<Text onChange={handleGains} mr="1" fontWeight="700">
					Ki
				</Text>
				<Input name="Ki" value={gains.Ki} width="100px" onChange={handleGains} />
			</Box>
			<Box m="1">
				<Text onChange={handleGains} mr="1" fontWeight="700">
					Kd
				</Text>
				<Input name="Kd" value={gains.Kd} width="100px" onChange={handleGains} />
			</Box>
		</Flex>
	);
}

export default GainAdjust;
