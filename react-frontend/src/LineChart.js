import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Heading, Flex, Box, Text } from '@chakra-ui/react';
import axios from 'axios';

const LineChart = () => {
	const [ lineData, setLineData ] = useState({
		labels: [ 'January', 'February', 'March', 'April', 'May' ],
		datasets: [
			{
				label: 'Heading',
				fill: false,
				lineTension: 0.4,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgba(75,192,192,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [ 65, 59, 80, 81, 56, 55, 40 ]
			}
		]
	});

	const [ requestedHeading, setRequestedHeading ] = useState(180);

	const getData = () => {
		axios.get('/history').then((res) => {
			const headings = res.data.history;
			const requested = res.data.requested;
			setRequestedHeading(requested);
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
	};

	useEffect(() => {
		getData();
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
					},
					scales: {
						yAxes: [
							{
								ticks: {
									min: requestedHeading - 30,
									max: requestedHeading + 30
								}
							}
						]
					}
				}}
			/>
		</Box>
	);
};

export default LineChart;
