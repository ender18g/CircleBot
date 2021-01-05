import { Box, Heading, Flex, Text } from '@chakra-ui/react';

function ThrottleSliders({ throttle }) {
	const maxHex = 65535;
	const LeftPercent = Math.floor(throttle.Left * 100 / maxHex);
	const RightPercent = Math.floor(throttle.Right * 100 / maxHex);

	const LeftHeight = `${200 - LeftPercent / 100 * 200}px`;
	const RightHeight = `${200 - RightPercent / 100 * 200}px`;

	return (
		<Flex width="200px" justifyContent="space-between">
			<Box>
				<Box
					boxShadow="lg"
					mx="auto"
					bg={throttle.Diff >= 0 ? 'green.500' : 'red.500'}
					width="50px"
					height="200px"
				>
					<Box bg="gray.400" width="50px" height={LeftHeight} zIndex="-1" />
				</Box>
				<Text fontWeight="600">Left Motor</Text>
			</Box>
			<Box>
				<Box
					boxShadow="lg"
					mx="auto"
					bg={throttle.Diff <= 0 ? 'green.500' : 'red.500'}
					width="50px"
					height="200px"
				>
					<Box bg="gray.400" width="50px" height={RightHeight} zIndex="-1" />
				</Box>
				<Text fontWeight="600">Right Motor</Text>
			</Box>
		</Flex>
	);
}

export default ThrottleSliders;
