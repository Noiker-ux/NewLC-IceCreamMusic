// import CanvasThree from '@/components/AuthttorizeAndRegistration/CanvasThree/CanvasThree';

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
			{/*<div className='w-full h-screen'> <CanvasThree /> </div>*/}
			<div className='fixed flex right-0 w-1/2 h-screen text-white border-l-1 border-[#424242] backdrop-filter backdrop-blur-md -z-10'>
>>>>>>> origin/vk-auth
				{children}
			</div>
		</main>
	);
}
