import { Box, Heading, Flex, Text, Image } from '@chakra-ui/react';
import { transform } from 'framer-motion';
import rocket from './images/rocket.png';

function Arrow({ rotation }) {
	const imageRotation = rotation - 50;
	const rotationString = `rotate(${imageRotation}deg)`;
	const imageStyle = { transform: rotationString };

	return (
		<Box>
			<Image boxSize="200px" style={imageStyle} src={rocket} />
			<Heading mt="15">{rotation}</Heading>
		</Box>
	);
}

export default Arrow;
