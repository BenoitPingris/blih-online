<template>
	<v-container>
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<v-card v-if="repo.valid">
					<v-img height="200px" src="https://loremflickr.com/320/240"></v-img>
					<v-card-title primary-title>
					<div>
						<h3 class="headline mb-0">{{ repo.name }}</h3>
					</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-list>
						<v-list-tile>
							<v-list-tile-content class="title font-weight-black">URL</v-list-tile-content>
							<v-list-tile-content class="align-end">{{ repo.url }}</v-list-tile-content>
						</v-list-tile>
						<v-list-tile>
							<v-list-tile-content class="title font-weight-black">UUID</v-list-tile-content>
							<v-list-tile-content class="align-end">{{ repo.uuid }}</v-list-tile-content>
						</v-list-tile>
						</v-list>
						<v-divider></v-divider>
					<v-list>
					<v-list-tile
						v-for="item in repo.rights"
						:key="item.title"
						avatar>
						<v-list-tile-action>
							<v-icon x-large>account_circle</v-icon>
						</v-list-tile-action>

						<v-list-tile-content>
							<v-list-tile-title v-text="item.name"></v-list-tile-title>
						</v-list-tile-content>

						<v-list-tile-avatar>
							<span class="font-weight-bold">{{ item.rights }}</span>
						</v-list-tile-avatar>
					</v-list-tile>
					</v-list>

					<v-card-actions>
						<v-dialog v-model="dialog" width="500">
						<v-btn slot="activator" color="red darken-1" dark>
							Set ACL
						</v-btn>
						<v-card>
							<v-card-title
							class="headline grey lighten-2" primary-title>
								ACL Rights
							</v-card-title>
							<v-card-text>
								<v-container>
									<form @submit.prevent="setAcl">
										<v-layout row>
											<v-flex xs12>
												<v-text-field name="email"
													label="Email"
													id="email"
													type="email" v-model="userEmail" required></v-text-field>
											</v-flex>
										</v-layout>
										<v-layout row>
											<v-flex xs12>
												<v-select
												:items="aclRights"
												label="Standard"
												v-model="selectedAcl"
												></v-select>
											</v-flex>
										</v-layout>
										<v-layout>
											<v-flex xs12>
												<v-btn type="submit">Add</v-btn>
											</v-flex>
										</v-layout>
									</form>
								</v-container>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="primary"
									flat
									@click="dialog = false">
								Close
							</v-btn>
							</v-card-actions>
						</v-card>
						</v-dialog>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			repo: {
				name: this.$route.params.name,
				rights: [],
				valid: false
			},
			dialog: false,
			aclRights: ['Read-Write', 'Read', 'Admin', 'None'],
			selectedAcl: '',
			userEmail: ''
		}
	},
	created() {
		this.getRepo();
	},
	methods: {
		...mapGetters(['getRepos']),
		getAcl() {
			const cred = JSON.parse(localStorage.getItem('blihOnlineAccount'));

			if (!cred)
				return;
			fetch('http://localhost:3000/getacl', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email: cred.email, password: cred.password, repo: this.repo.name })
				})
				.then(response => {
					if (!response.ok) {
						throw Error("Error");
					}
					return response.json();
				})
				.then(json => this.repo.rights = json)
				.catch(console.log);
		},
		getRepo() {
			const item = this.getRepos().find(element => element.name === this.repo.name);

			if (item !== undefined) {
				this.repo.valid = true;
				this.repo = {
					...this.repo,
					url: item.url,
					uuid: item.uuid
				}
			} else {
				this.repo.valid = false;
			}
		},
		setAcl() {
			const cred = JSON.parse(localStorage.getItem('blihOnlineAccount'));
			if (!cred)
				return;
			fetch('http://localhost:3000/setacl', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: cred.email,
						password: cred.password,
						repo: this.repo.name,
						user:  this.userEmail,
						rights: this.selectedAcl
					})
				})
				.then(response => {
					if (!response.ok) {
						throw Error("Error");
					}
					this.getAcl();
				})
				.catch(console.log);
		}
	},
	computed: {
		repos() {
			return this.getRepos();
		}
	},
	watch: {
		repos() {
			this.getRepo();
		},
		'repo.valid'() {
			this.getAcl();
		}
	}
}
</script>

<style>

</style>
