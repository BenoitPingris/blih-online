import Vue from 'vue'
import Vuex from 'vuex'
import Blih from 'blih';

Vue.use(Vuex)

function saveUserInLocalStorage(user) {
	localStorage.setItem('blihOnlineAccount', JSON.stringify({
		...user,
		timestamp: new Date().getTime()
	}));
}

function removeUserFromLocalStorage() {
	localStorage.removeItem('blihOnlineAccount');
}

async function getBlihRepos(email, password) {
	const res = await fetch('http://localhost:3000/login', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});
	// Error occured (bad credentials)
	// TODO better error handling
	if (!res.ok) {
		return null;
	}
	const json = await res.json();
	return json;
}

function getCredentials() {
	const credentials = localStorage.getItem('blihOnlineAccount');

	return credentials === null ? null : JSON.parse(credentials);
}

export default new Vuex.Store({
	state: {
		user: {
			loggedIn: false,
			repos: []
		}
	},
	getters: {
		isLoggedIn: state => state.user.loggedIn,
		getRepos: state => state.user.repos,
		user: state => state.user,
	},
	mutations: {
		setUser(state, payload) {
			state.user = payload;
		},
	},
	actions: {
		logUserIn({commit}, payload) {
			(async () => {
			const repos = await getBlihRepos(payload.email, payload.password);
			if (repos !== null) {
				saveUserInLocalStorage(payload);
				commit('setUser', { loggedIn: true, repos });
			}
			})()
		},
		logUserOut({commit}, payload) {
			removeUserFromLocalStorage();
			commit('setUser', {loggedIn: false, repos: []});
		},
		autoLogIn({ commit }, payload) {
			let user = localStorage.getItem('blihOnlineAccount');

			if (user !== null) {
				(async () => {
					user = JSON.parse(user);
					const repos = await getBlihRepos(user.email, user.password);
					commit('setUser', { loggedIn: true, repos });
				})()
			}
		},
	},
});
