import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
	const [ sensorData, setSensorData ] = useState({});
	const getData = () => {
		const res = axios.get('/sensor').then((res) => {
			console.log(res);
			setSensorData(res);
		});
	};
	useEffect(() => {
		getData();
	}, []);
	return (
		<div className="App">
			<h1> My React frontend</h1>
		</div>
	);
}

export default App;
