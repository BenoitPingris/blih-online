<template>
	<v-app>
		<app-navbar></app-navbar>
		<main>
			<router-view></router-view>
		</main>
	</v-app>
</template>

<script>

import NavbarVue from '@/components/Navbar.vue';

export default {
	name: 'App',
	data () {
		return {
		}
	},
	components: {
		appNavbar: NavbarVue
	}
}
</script>
