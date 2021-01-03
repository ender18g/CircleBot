import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Flex, Text } from '@chakra-ui/react';
import Arrow from './Arrow';
import ThrottleSliders from './ThrottleSliders';

function App() {
	const [ sensorData, setSensorData ] = useState({ sensor: 'loading...', euler: [ 'loading...' ] });
	const getData = () => {
		const res = axios.get('/sensor').then((res) => {
			console.log(res.data);
			setSensorData(res.data);
		});
	};

	useEffect(() => {
		// setInterval(() => {
		// 	getData();
		// }, 200);
		getData();
	}, []);

	return (
		<Box my="3" width="95%" height="95vh" mx="auto" borderRadius="md" className="App" bg="gray.100" pt="3">
			<Box mx="auto" w="500px" borderRadius="md" p="2" bg="blue.600" boxShadow="md">
				<Heading color="gray.100" fontWeight="300" letterSpacing=".2em" fontSize="4xl">
					CircleBot
				</Heading>
			</Box>
			<Flex mt="20" justify="space-around">
				<Arrow rotation={sensorData.euler[0]} />
				<ThrottleSliders throttle={{ Left: 2050, Right: 1500 }} />
			</Flex>
		</Box>
	);
}

export default App;
