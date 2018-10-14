<template>
	<v-container grid-list-lg>
		<v-layout row wrap>
			<v-flex xs12 sm6 md4 v-if="i < repos.length" v-for="i in nbItemsShowed" :key="i">
				<v-card>
					<v-card-title>
						<div :style="{'overflow': 'hidden'}">
							<h3>{{ repos[i].name }}</h3>
							<div>{{ repos[i].url }}</div>
						</div>
					</v-card-title>
					<v-card-actions class="text-center">
						<v-btn  outline flat color="orange" :to="`/repo/${repos[i].name}`">Explore</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
		<div v-if="nbItemsShowed < repos.length" class="text-xs-center">
			<v-btn @click="addItems" fab dark color="indigo">
				<v-icon dark>add</v-icon>
			</v-btn>
		</div>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			nbItemsShowed: 10
		};
	},
	computed: {
		repos() {
			return this.$store.getters.getRepos;
		}
	},
	methods: {
		addItems() {
			this.nbItemsShowed += 10;
		}
	}
}
</script>

<style>

</style>
