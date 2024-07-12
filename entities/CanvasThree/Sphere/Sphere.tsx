import { useRef } from 'react';

const Sphere = () => {
	const cubeRef = useRef();

	return (
		<mesh ref={cubeRef}>
			<sphereGeometry args={[1.5, 16, 16]} />
			<meshBasicMaterial />
		</mesh>
	);
};
export default Sphere;
