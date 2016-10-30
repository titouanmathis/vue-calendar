<template>
	<table :id="id" class="calendar">
		<thead>
			<tr>
				<th>
					<button type="button" @click="prevMonth" class="calendar__nav calendar__nav--prev"><span>➞</span></button>
				</th>
				<th colspan="5" class="calendar__month">
					{{ month }} {{ year }}
				</th>
				<th>
					<button type="button" @click="nextMonth" class="calendar__nav calendar__nav--next"><span>➞</span></button>
				</th>
			</tr>
			<tr>
				<th v-for="weekdayMin in weekdaysMin" class="calendar__weekday">
					{{ weekdayMin }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="week in weeks">
				<td v-for="day in week.days" :class="day.classes()">
					<input type="checkbox"
						:id="day.id"
						:checked="day.isChecked()"
						@change="toggleDay"
						@keydown.up="goUp"
						@keydown.right="goRight"
						@keydown.down="goDown"
						@keydown.left="goLeft"
						:data-date="day.dataDate"
						:data-up="day.dataUp"
						:data-right="day.dataRight"
						:data-down="day.dataDown"
						:data-left="day.dataLeft">
					<label :for="day.id"><span>{{ day.label }} {{ day.weekDayNumber }}</span></label>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import store from '../store'
	import moment from 'moment'

	// Set the locale to FR
	moment.locale('fr')

	export default {
		name: 'form-date',
		data () {
			return {
				weeks: [],
				moment: new moment()
			}
		},
		props: {
			id: {
				type: String
			}
		},
		computed: {
			selected() {
				return store.state.dates
			},
			weekdaysMin() {
				const weekdays = moment.weekdaysMin()
				weekdays.push(weekdays.shift())
				return weekdays
			},
			year() {
				return this.moment.format('YYYY')
			},
			month() {
				return this.moment.format('MMMM')
			}
		},
		methods: {

			goUp(e) {
				console.log('goUp');
				console.time('goUp')
				try {
					this.$el.querySelector(`#${e.target.getAttribute('data-up')}`).focus()
				} catch(something) {
					if (typeof something !== 'undefined') console.log(something);
				}
				console.timeEnd('goUp')
			},

			goRight(e) {
				console.log('goRight');
				console.time('goRight');
				try {
					this.$el.querySelector(`#${e.target.getAttribute('data-right')}`).focus()
				} catch(something) {
					if (typeof something !== 'undefined') console.log(something);
				}
				console.timeEnd('goRight')
			},

			goDown(e) {
				console.log('goDown');
				console.time('goDown');
				try {
					this.$el.querySelector(`#${e.target.getAttribute('data-down')}`).focus()
				} catch(something) {
					if (typeof something !== 'undefined') console.log(something);
				}
				console.timeEnd('goDown');
			},

			goLeft(e) {
				console.log('goLeft');
				console.time('goLeft');
				try {
					this.$el.querySelector(`#${e.target.getAttribute('data-left')}`).focus()
				} catch(something) {
					if (typeof something !== 'undefined') console.log(something);
				}
				console.timeEnd('goLeft');
			},

			/**
			 * Go to previous month
			 * @return {void}
			 */
			prevMonth() {
				this.moment = this.moment.clone().subtract(1, 'months')
			},

			/**
			 * Go to next month
			 * @return {[type]} [description]
			 */
			nextMonth() {
				this.moment = this.moment.clone().add(1, 'months')
			},

			/**
			 * Select/deselect a day
			 * @param  {Object} e The `change` event's object
			 * @return {void}
			 */
			toggleDay(e) {
				store.commit('toggleDate', e.target.getAttribute('data-date'))
			},

			/**
			 * Set all variables with the
			 * component current month data
			 * @return {void}
			 */
			setMonth() {
				const _moment = this.moment.clone().startOf('month')

				// Empty the weeks data
				this.weeks = []

				// Push all weeks in month
				while (_moment.clone().isSame(this.moment, 'month') || _moment.clone().startOf('week').isSame(this.moment, 'month')) {
					this.weeks.push({
						moment: _moment.clone(),
						days: []
					})
					_moment.add(1, 'week')
				}

				// Push days to weeks
				this.weeks.forEach((week) => {
					// Get the start of the week
					const _moment = week.moment.clone().startOf('week')
					// While we are in the same week, push days
					while (_moment.week() === week.moment.week()) {
						// Save the current day
						const day = _moment.clone()
						const date = day.format('YYYY-MM-DD')
						// Push the current day
						week.days.push({
							id: `date-${date}`,
							dataDate: date,
							label: day.format('DD'),
							dataUp: 'date-' + day.clone().subtract(1, 'week').format('YYYY-MM-DD'),
							dataRight: 'date-' + day.clone().add(1, 'days').format('YYYY-MM-DD'),
							dataDown: 'date-' + day.clone().add(1, 'week').format('YYYY-MM-DD'),
							dataLeft: 'date-' + day.clone().subtract(1, 'days').format('YYYY-MM-DD'),
							classes: () => {
								const classes = ['calendar__day']
								if (day.day() === 0 || day.day() === 6) classes.push('calendar__day--weekend')
								if (!day.isSame(this.moment, 'month')) classes.push('calendar__day--not-in-month')
								return classes.join(' ')
							},
							isChecked() {
								return store.state.dates.indexOf(date) > -1
							}
						})
						// Go to the next day
						_moment.add(1, 'days')
					}
				})
			}
		},
		watch: {
			moment: 'setMonth'
		},
		created() {
			// Set the calendar
			this.setMonth()
		}
	}
</script>

<style lang="scss">

	%focus {
		z-index: 1;
		outline: 2px solid -webkit-focus-ring-color;
	}

	%active {
		transform: translate(0, 1px);
	}

	.calendar {
		table-layout: fixed;
		text-align: center;
		border: 1px solid #ccc;
		-webkit-user-select: none;

		td,
		th {
			min-width: 2em;
		}
	}

	.calendar__month {
		font-weight: 700;
		text-transform: capitalize;
	}

	.calendar__nav {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;

		&:hover {
			/*color: #fff;*/
			background: #eee;
			-webkit-font-smoothing: antialiased;
		}

		&:focus {
			@extend %focus;
		}

		&:active {

			span {
				@extend %active;
			}
		}

		span {
			display: inline-block;
		}
	}

	.calendar__nav--prev {
		transform: scale(-1, 1);
	}

	.calendar__weekday {
		font-weight: 500;
	}

	.calendar__day {
		position: relative;
		vertical-align: middle;
		font-feature-settings: "lnum" 1;

		input {
			z-index: -999;
			position: absolute;
			left: -9999px;
			opacity: 0;

			&:focus {

				+ label {
					@extend %focus;
				}
			}

			&:checked {

				+ label {
					color: #fff;
					background: #222;
					-webkit-font-smoothing: antialiased;

					&:hover {
						background: #111;
					}
				}
			}
		}

		label {
			position: relative;
			display: block;
			user-select: none;

			&:hover {
				background: #eee;
			}

			&:active {

				span {
					@extend %active;
				}
			}

			span {
				display: inline-block;
				user-select: none;
			}
		}
	}

	.calendar__day--weekend {

		label {
			background: #f5f5f5;
		}
	}

	.calendar__day--not-in-month {

		label {
			color: #ccc;
			background: none;
		}
	}
</style>
