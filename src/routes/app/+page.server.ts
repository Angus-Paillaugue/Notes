import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const { user } = locals;
	throw redirect(303, `/app/${user.username}`);
}) satisfies PageServerLoad;
