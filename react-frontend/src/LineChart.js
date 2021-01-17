import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Heading, Flex, Box, Text } from '@chakra-ui/react';
import axios from 'axios';

const LineChart = () => {
	const [ lineData, setLineData ] = useState({
		labels: [ 'January', 'February', 'March', 'April', 'May' ],
		datasets: [
			{
				label: 'Rainfall',
				fill: false,
				lineTension: 0.5,
				backgroundColor: 'rgba(75,192,192,1)',
				borderColor: 'rgba(75,192,192,1)',
				borderWidth: 1,
				data: [ 65, 59, 80, 81, 56 ]
			}
		]
	});

	useEffect(() => {
		axios.get('/history').then((res) => {
			const headings = res.data.history;
			const requested = res.data.requested;
			const labels = Array.from(Array(headings.length).keys());
			setLineData({
				...lineData,
				labels: labels,
				datasets: [
					{
						...lineData.datasets[0],
						data: headings
					}
				]
			});
		});
	}, []);

	return (
		<Box>
			<Line
				data={lineData}
				options={{
					title: {
						display: true,
						text: 'Heading Response',
						fontSize: 20
					},
					legend: {
						display: false,
						position: 'right'
					}
				}}
			/>
		</Box>
	);
};

export default LineChart;
