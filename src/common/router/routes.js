
const routes = [

    {
        path: '/',
        redirect: '/login'
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login.vue')
    },
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/views/register.vue')
	},
	{
		path: '/room',
		name: 'Room',
		component: () => import('@/views/room.vue')
	},

];

export const existsRoute = (path) => {
    for (let i = 0; i < routes.length; i++) {
        const r = routes[i];
        if (r.path == path) {
            return true;
        }
        if (r.children && r.children.length) {
            for (let j = 0; j < r.children.length; j++) {
                const sr = r.children[j];
                if (sr.path == path) {
                    return true;
                }

                if (sr.children && sr.children.length) {
                    for (let k = 0; k < sr.children.length; k++) {
                        const ssr = sr.children[k];
                        if (ssr.path == path) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

export default routes;
