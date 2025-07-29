'use server';

export async function action(ark: unknown) {
	ark.roles = JSON.stringify(ark.roles);
	ark.platforms = JSON.stringify(ark.platforms);
	ark.area = JSON.stringify(ark.area);
	ark.confirmed = false; // спросить что это такое
	ark.status = 'moderating';
	ark.tracks.forEach((track: any) => {
		track.roles = JSON.stringify(track.roles);
	});

	console.log(ark);
}
