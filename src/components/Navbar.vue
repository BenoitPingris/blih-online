<template>
    <div>
        <v-navigation-drawer v-model="sideNav" fixed temporary>
			<v-list>
				<v-list-tile v-for="(item, index) in menuItems" :key="index"
				:to="item.link">
					<v-list-tile-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>{{ item.title }}</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar dark class="red darken-4">
			<v-toolbar-side-icon @click="sideNav = !sideNav"
			class="hidden-sm-and-up"></v-toolbar-side-icon>
			<v-toolbar-title>
				<router-link to="/" tag="span" style="cursor: pointer">
				<v-icon>cloud</v-icon>
					Blih Online
				</router-link>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items class="hidden-xs-only">
				<v-btn :to="item.link" flat v-for="(item, index) in menuItems" :key="index">
					<v-icon left>{{ item.icon }}</v-icon>
				{{ item.title }}
				</v-btn>
				<v-btn v-if="isLoggedIn" flat @click="logout">
					<v-icon >keyboard_arrow_right</v-icon>
					Logout
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>
    </div>
</template>

<script>
export default {
	data() {
		return {
			sideNav: false,
		}
	},
	computed: {
		menuItems() {
			if (this.isLoggedIn) {
				return [
					{ title: 'Profile', link: '/profile', icon: 'face'},
				]
			} else {
				return [
					{ title: "Login", link: "/login", icon: "lock_open" }
				]
			}
		},
		isLoggedIn() {
			return this.$store.getters.isLoggedIn;
		},
	},
	methods: {
		logout() {
			this.$store.dispatch('logUserOut');
			this.$router.push('/');
		}
	}
}
</script>

<style>

</style>
