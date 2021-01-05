import { Box, Heading, Flex, Text, Image } from '@chakra-ui/react';
import { transform } from 'framer-motion';
import rocket from './images/rocket.png';

function Video({ rotation }) {
	return (
		<Flex mx="auto" justifyContent="center">
			<Image boxSize="600px" objectFit="cover" src="/video" />
		</Flex>
	);
}

export default Video;
