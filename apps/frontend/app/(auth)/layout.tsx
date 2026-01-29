import CanvasThree from '@/components/CanvasThree/CanvasThree';

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
<<<<<<< HEAD
		<main className='flex bg-black'>
			<div className='w-full h-screen'>{/* <CanvasThree /> */}</div>
			<div className='fixed flex right-0 w-1/2 h-screen text-white border-l-1 border-[#424242] backdrop-filter backdrop-blur-md'>
=======
		<main className=' bg-black'>
<<<<<<< HEAD
			{/*<div className='w-full h-screen'> <CanvasThree /> </div>*/}
			<div className='fixed flex right-0 w-1/2 h-screen text-white border-l-1 border-[#424242] backdrop-filter backdrop-blur-md -z-10'>
>>>>>>> origin/vk-auth
=======
			<div className='w-full h-screen fixed z-10'>
				<CanvasThree />
			</div>
			<div className='fixed flex right-0 w-1/2 h-screen text-white border-l-1 border-[#424242] backdrop-filter backdrop-blur-md z-20'>
>>>>>>> 3ea385da3d404015abbe2908d8e00c3ada67969a
				{children}
			</div>
		</main>
	);
}
