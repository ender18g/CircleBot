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
	const [ command, setCommand ] = useState({ forward: 0, turn: 0 }); //initially, 0 for 0 turn

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

	useEffect(
		() => {
			console.log(command);
			sendThrottle(command);
		},
		[ command ]
	);

	const handleKey = (e) => {
		setPressedkey(e.code);
		const normForward = 30;
		const normTurn = 15;
		switch (e.code) {
			case 'KeyW':
				setCommand({ ...command, forward: normForward });
				return;
			case 'KeyS':
				//THIS SHOULD TURN IT OFFF
				setCommand({ forward: 0, turn: 0 });
				return;
			case 'KeyA':
				//turn left
				setCommand({ ...command, turn: -normTurn });
				return;
			case 'KeyD':
				setCommand({ ...command, turn: normTurn });
				return;
			default:
				return;
		}
	};

	const sendThrottle = () => {
		console.log(command);
		const res = axios.get(`/throttle/${command.forward}/${command.turn}`).then((res) => {
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
