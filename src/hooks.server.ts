import { auth } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const { cookies, locals, url } = event;
	const token = cookies.get('token') || false;

	// Check if the user is logged in, and if so, retrieve the user data
	if (token) {
		try {
			const user = await auth(token);
			if (user) {
				locals.user = user;
			} else {
				cookies.delete('token', { path: '/' });
				delete locals.user;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_error) {
			delete locals.user;
			cookies.delete('token', { path: '/' });
		}
	}

  if(url.pathname.startsWith('/auth') && ('user' in locals)) {
    throw redirect(303, '/app');
  }

  if (url.pathname.startsWith('/api') && !('user' in locals)) {
		throw error(401, 'Unauthorized');
	}


	return await resolve(event);
};
