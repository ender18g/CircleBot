import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Flex, Text, Button, Input } from '@chakra-ui/react';
import Arrow from './Arrow';
import ThrottleSliders from './ThrottleSliders';
import Video from './Video';
import GainAdjust from './GainAdjust';
import LineChart from './LineChart';

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
	const [ showVideo, setShowVideo ] = useState(false);
	const [ gains, setGains ] = useState({ Kp: 0, Ki: 0, Kd: 0 });
	const [ showPlot, setShowPlot ] = useState(false);
	const [ refInterval, setRefInterval ] = useState(100);

	const getData = () => {
		axios.get('/sensor').then((res) => {
			setSensorData(res.data);
		});
	};

	useEffect(
		() => {
			console.log('setting interval');
			let intID = setInterval(() => {
				getData();
			}, parseInt(refInterval));

			return () => {
				console.log('clearing interval');
				clearInterval(intID);
			};
		},
		[ refInterval ]
	);

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
		console.log(e);
		setPressedkey(e.code);
		switch (e.code) {
			case 'KeyW':
				console.log('max forward', maxThrottle);
				setThrottleCommand({ turn: 0, forward: maxThrottle['forward'] });
				setShowPlot(false);
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
			case 'Space':
				setShowPlot(!showPlot);
				break;
			default:
				break;
		}
	};

	const sendThrottle = () => {
		console.log('sending command:', throttleCommand);
		console.log('max Throttle', maxThrottle);
		console.log('PID', gains);
		const res = axios
			.get(`/throttle/${throttleCommand.forward}/${throttleCommand.turn}/${gains.Kp}/${gains.Ki}/${gains.Kd}`)
			.then((res) => {
				setThrottleData(res.data);
			});
	};

	const handleMaxThrottle = (val) => {
		const newMax = parseInt(val);
		console.log('new max', newMax);
		setMaxThrottle({ turn: 15, forward: newMax });
	};

	return (
		<Box my="3" width="95%" mx="auto" borderRadius="md" className="App" bg="gray.100" p="10">
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
				<Box>
					<Arrow rotation={sensorData.euler[0]} />
					<Flex mt="8" justify="center" align="center">
						<Box w="100%" m="1">
							<Flex align="center" justify="space-around" w="100%">
								<Text
									m="2"
									fontWeight="700"
									fontSize="3xl"
									onClick={(e) => {
										if (refInterval > 20) {
											setRefInterval(refInterval - 10);
										}
									}}
								>
									-
								</Text>
								<Text
									m="2"
									fontWeight="700"
									fontSize="xl"
									color={refInterval > 1000 ? 'red.500' : 'blue.500'}
								>
									{refInterval}ms
								</Text>

								<Text
									m="2"
									fontWeight="700"
									fontSize="3xl"
									onClick={(e) => {
										setRefInterval(refInterval + 10);
									}}
								>
									+
								</Text>
							</Flex>
							<Text
								fontWeight="700"
								fontSize="md"
								onClick={(e) => {
									if (refInterval > 1000) {
										setRefInterval(100);
									} else {
										setRefInterval(10000);
									}
								}}
							>
								Toggle Refresh
							</Text>
						</Box>
					</Flex>
				</Box>
				{showVideo && <Video />}
				<Box width="200px" justify="center">
					<ThrottleSliders
						setMaxThrottle={handleMaxThrottle}
						maxThrottle={maxThrottle}
						throttle={throttleData}
					/>
					<GainAdjust gains={gains} setGains={setGains} />
				</Box>
			</Flex>
			<Button
				onClick={() => {
					setShowPlot(!showPlot);
				}}
				colorScheme="red"
			>
				Show Response Plot
			</Button>
			<Box p="3">{showPlot && <LineChart />}</Box>
		</Box>
	);
}

export default App;
