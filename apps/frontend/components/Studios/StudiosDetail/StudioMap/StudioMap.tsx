'use client';
import { useEffect, useState } from 'react';

export default function YMap({
	lattitude,
	longitude,
	address,
}: {
	lattitude: number;
	longitude: number;
	address: string;
}) {
	const [mapInstance, setMapInstance] = useState<ymaps.Map | null>(null);

	const initMap = () => {
		if (!window.ymaps) return;

		window.ymaps.ready(() => {
			const placemark = new window.ymaps.Placemark([lattitude, longitude], {
				hintContent: `${address}`,
				balloonContent: `${address}`,
			});

			const map = new window.ymaps.Map('map', {
				center: [lattitude, longitude],
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
