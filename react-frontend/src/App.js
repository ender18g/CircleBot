import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Flex, Text, Button } from '@chakra-ui/react';
import Arrow from './Arrow';
import ThrottleSliders from './ThrottleSliders';
import Video from './Video';

function App() {
	const [ sensorData, setSensorData ] = useState({
		sensor: 'loading...',
		euler: [ 'loading...' ]
	});

	const [ pressedKey, setPressedkey ] = useState(' ');
	const [ throttleData, setThrottleData ] = useState({ Left: 0, Right: 0 });
	const [ throttleCommand, setThrottleCommand ] = useState({ forward: 0, turn: 0 });
	//initially, 0 for 0 turn
	const [ maxThrottle, setMaxThrottle ] = useState({ forward: 30, turn: 15 });
	const [ showVideo, setShowVideo ] = useState(true);

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
			sendThrottle(throttleCommand);
		},
		[ throttleCommand ]
	);

	const handleKey = (e) => {
		setPressedkey(e.code);
		const normForward = maxThrottle.forward;
		const normTurn = maxThrottle.turn;
		switch (e.code) {
			case 'KeyW':
				setThrottleCommand({ ...throttleCommand, forward: normForward });
				break;
			case 'KeyS':
				//THIS SHOULD TURN IT OFFF
				setThrottleCommand({ forward: 0, turn: 0 });
				break;
			case 'KeyA':
				//turn left
				setThrottleCommand({ ...throttleCommand, turn: -normTurn });
				break;
			case 'KeyD':
				setThrottleCommand({ ...throttleCommand, turn: normTurn });
				break;
			default:
				break;
		}
	};

	const sendThrottle = () => {
		console.log('sending commandt', throttleCommand);
		const res = axios.get(`/throttle/${throttleCommand.forward}/${throttleCommand.turn}`).then((res) => {
			setThrottleData(res.data);
		});
	};

	return (
		<Box my="3" width="95%" mx="auto" borderRadius="md" className="App" bg="gray.100" pt="3">
			<Box mx="auto" w="500px" borderRadius="md" p="2" bg="blue.600" boxShadow="md">
				<Heading color="gray.100" fontWeight="300" letterSpacing=".2em" fontSize="4xl">
					CircleBot
				</Heading>
			</Box>
			<Text>{pressedKey}</Text>
			<Button
				mt="4"
				colorScheme="teal"
				onClick={() => {
					setShowVideo(!showVideo);
				}}
			>
				Show Video
			</Button>
			<Flex mt="10" justify="space-around" flexWrap="wrap" align="center">
				<Arrow rotation={sensorData.euler[0]} />
				{showVideo && <Video />}
				<ThrottleSliders throttle={throttleData} />
			</Flex>
		</Box>
	);
}

export default App;
