<template>
	<table class="calendar">
		<thead>
			<tr>
				<th>
					<button @click="prevMonth" class="calendar__nav calendar__nav--prev"><span>➞</span></button>
				</th>
				<th colspan="5" class="calendar__month">
					{{ month }} {{ year }}
				</th>
				<th>
					<button @click="nextMonth" class="calendar__nav calendar__nav--next"><span>➞</span></button>
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
				<td v-for="day in week.days" :class="`calendar__day${!day.isInMonth ? ' calendar__day--not-in-month' : '' }`">
					<input type="checkbox" :id="day.id" :checked="day.isChecked" @change="toggleDay">
					<label :for="day.id"><span>{{ day.label }}</span></label>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import moment from 'moment'

	export default {
		name: 'calendar',
		data () {
			return {
				selected: [],
				weeks: [],
				moment: new moment()
			}
		},
		computed: {
			weekdaysMin() {
				return moment.weekdaysMin()
			},
			year() {
				return this.moment.format('YYYY')
			},
			month() {
				return this.moment.format('MMMM')
			}
		},
		methods: {
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
				const day = e.target.id
				const index = this.selected.indexOf(day)
				index < 0 && this.selected.push(day)
				index > -1 && this.selected.splice(index, 1)
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
						const id = day.format('YYYY-MM-DD')
						// Push the current day
						week.days.push({
							id,
							label: day.format('DD'),
							isChecked: this.selected.indexOf(id) > -1,
							isInMonth: day.isSame(this.moment, 'month')
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
		beforeCreate() {
			// Set the locale to FR
			moment.locale('fr')
			// Update the week days order
			moment.updateLocale('fr', {
				weekdays: 'Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi_Dimanche'.split('_'),
				weekdaysShort: 'Lun._Mar._Mer._Jeu._Ven._Sam._Dim.'.split('_'),
				weekdaysMin: 'Lu_Ma_Me_Je_Ve_Sa_Di'.split('_'),
			})
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
		width: 100%;
		/*height: 100%;*/
		text-align: center;

		th,
		td {
			vertical-align: middle;
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
				}
			}
		}

		label {
			position: relative;
			display: block;


			&:active {

				span {
					@extend %active;
				}
			}

			span {
				display: inline-block;
			}
		}
	}

	.calendar__day--not-in-month {

		label {
			color: #ccc;
		}
	}

	* {
					-webkit-font-smoothing: antialiased;

	}
</style>
