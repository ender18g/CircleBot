import { Box, Heading, Flex, Text, Image } from '@chakra-ui/react';
import { transform } from 'framer-motion';
import rocket from './images/rocket.png';

function Video({ rotation }) {
	return (
		<Flex mx="auto" justifyContent="center">
			<Image
				boxSize="600px"
				objectFit="cover"
				src="https://images.unsplash.com/photo-1528191131649-e5ea2c226f76?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80"
			/>
		</Flex>
	);
}

export default Video;
