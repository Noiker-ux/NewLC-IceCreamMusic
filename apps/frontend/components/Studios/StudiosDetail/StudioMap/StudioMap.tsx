'use client';
import { useEffect, useState } from 'react';

export default function YMap() {
	const [mapInstance, setMapInstance] = useState<ymaps.Map | null>(null);

	const initMap = () => {
		if (!window.ymaps) return;

		window.ymaps.ready(() => {
			const placemark = new window.ymaps.Placemark([55.75, 37.6], {
				hintContent: 'Жопа коня',
				balloonContent: 'Ебля осьминога',
			});

			const map = new window.ymaps.Map('map', {
				center: [55.75, 37.6],
				zoom: 10,
			});

			map.geoObjects.add(placemark);

			setMapInstance(map);
		});
	};

	useEffect(() => {
		initMap();
	}, []);

	return (
		<>
			<div id='map' style={{ width: '100%', height: '400px' }}></div>
		</>
	);
}
