import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Flex, Text } from '@chakra-ui/react';
import Arrow from './Arrow';
import ThrottleSliders from './ThrottleSliders';

function App() {
	const [ sensorData, setSensorData ] = useState({
		sensor: 'loading...',
		euler: [ 'loading...' ]
	});

	const [ pressedKey, setPressedkey ] = useState('');
	const [ throttleData, setThrottleData ] = useState({ Left: 0, Right: 0 });

	const getData = () => {
		const res = axios.get('/sensor').then((res) => {
			setSensorData(res.data);
		});
	};

	useEffect(() => {
		setInterval(() => {
			getData();
		}, 50);
		getData();
		document.addEventListener('keydown', handleKey);
	}, []);

	const handleKey = (e) => {
		setPressedkey(e.code);
		switch (e.code) {
			case 'KeyW':
				sendThrottle('/forward/100');
				break;
			case 'KeyS':
				//THIS SHOULD TURN IT OFFF
				sendThrottle('/forward/0');
				break;
			case 'KeyA':
				sendThrottle('/turn/-100');
				break;
			case 'KeyD':
				sendThrottle('/turn/100');
				break;
			default:
				break;
		}
	};

	const sendThrottle = (getURL) => {
		const res = axios.get(getURL).then((res) => {
			setThrottleData(res.data);
		});
	};

	return (
		<Box my="3" width="95%" height="95vh" mx="auto" borderRadius="md" className="App" bg="gray.100" pt="3">
			<Box mx="auto" w="500px" borderRadius="md" p="2" bg="blue.600" boxShadow="md">
				<Heading color="gray.100" fontWeight="300" letterSpacing=".2em" fontSize="4xl">
					CircleBot
				</Heading>
				{pressedKey}
			</Box>
			<Flex mt="20" justify="space-around">
				<Arrow rotation={sensorData.euler[0]} />
				<ThrottleSliders throttle={throttleData} />
			</Flex>
		</Box>
	);
}

export default App;
