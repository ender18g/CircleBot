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
	const [ maxThrottle, setMaxThrottle ] = useState({ forward: 20, turn: 15 });
	const [ showVideo, setShowVideo ] = useState(true);

	const getData = () => {
		axios.get('/sensor').then((res) => {
			setSensorData(res.data);
		});
	};

	useEffect(() => {
		setInterval(() => {
			getData();
		}, 100);
	}, []);

	useEffect(
		() => {
			console.log('SETTING LISTENER', maxThrottle);
			document.addEventListener('keydown', handleKey);

			return () => {
				document.removeEventListener('keydown', handleKey);
				console.log('CLEAN UP!', maxThrottle);
			};
		},
		[ maxThrottle ]
	);

	useEffect(
		() => {
			sendThrottle(throttleCommand);
		},
		[ throttleCommand ]
	);

	const handleKey = (e) => {
		setPressedkey(e.code);
		switch (e.code) {
			case 'KeyW':
				console.log('max forward', maxThrottle);
				setThrottleCommand({ turn: 0, forward: maxThrottle['forward'] });
				break;
			case 'KeyS':
				//THIS SHOULD TURN IT OFFF
				setThrottleCommand({ forward: 0, turn: 0 });
				break;
			case 'KeyA':
				//turn left
				setThrottleCommand({ ...throttleCommand, turn: -maxThrottle['turn'] });
				break;
			case 'KeyD':
				setThrottleCommand({ ...throttleCommand, turn: maxThrottle['turn'] });
				break;
			default:
				break;
		}
	};

	const sendThrottle = () => {
		console.log('sending command:', throttleCommand);
		console.log('max Throttle', maxThrottle);
		const res = axios.get(`/throttle/${throttleCommand.forward}/${throttleCommand.turn}`).then((res) => {
			setThrottleData(res.data);
		});
	};

	const handleMaxThrottle = (val) => {
		const newMax = parseInt(val);
		console.log('new max', newMax);
		setMaxThrottle({ turn: 15, forward: newMax });
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
				<ThrottleSliders setMaxThrottle={handleMaxThrottle} maxThrottle={maxThrottle} throttle={throttleData} />
			</Flex>
		</Box>
	);
}

export default App;
