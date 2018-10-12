/* Magic Mirror
 * Node Helper: MMM-Roomba
 *
 * By Reagan Elm
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Dorita980  = require('dorita980');

const REQUIRED_ROOT_FIELDS = ['robots'];
const REQUIRED_ROBOTS_FIELDS = ['username', 'password', 'ipAddress'];
const ROOMBA_STATS = ['bin', 'name', 'batPct', 'cleanMissionStatus'];

module.exports = NodeHelper.create({
	start: function() {
		const self = this;

		self.started = false;
		self.config = [];
		self.stats = {};
	},

	socketNotificationReceived: function(notification, payload) {
		const self = this;

		switch (notification) {
			case 'START':
				self.handleStartNotification(payload);
		}
	},

	handleStartNotification: function(payload) {
		const self = this;

		if (self.started) {
			return;
		}

		self.config = payload;

		if (self.isInvalidConfig()) {
			return;
		}

		self.stats = [];

		self.scheduleUpdates();

		self.started = true;
	},

	updateStats: function(index) {
		const self = this;

		let roomba = new Dorita980.Local(
			self.config.robots[index].username,
			self.config.robots[index].password,
			self.config.robots[index].ipAddress
		);

		roomba.getRobotState(ROOMBA_STATS).then(state => {
			self.stats[index] = self.stats[index] || {};
			Object.assign(self.stats[index], {
				name: state.name,
				binFull: state.bin.full,
				batteryPercent: state.batPct,
				phase: state.cleanMissionStatus.phase,
			});

			roomba.end();
			self.sendSocketNotification('STATS', self.stats);
		}).catch((err) => {
			console.error('Error occurred while fetching stats', err);
			roomba.end();
		});
	},

	isInvalidConfig: function() {
		const self = this;

		let missingRootField = REQUIRED_ROOT_FIELDS.find((field) => {
			return !self.config[field];
		});

		if (missingRootField) {
			self.sendSocketNotification(
				'ERROR',
				`<i>Confg.${missingRootField}</i> is required for module: ${self.name}.`
			);
			return true;
		}

		if (!Array.isArray(self.config.robots)) {
			self.sendSocketNotification(
				'ERROR',
				`<i>Confg.robots</i> is required to be an array for module: ${self.name}.`
			);
			return true;
		}

		let missingRobotsField;
		self.config.robots.forEach(robot => {
			let missingField = REQUIRED_ROBOTS_FIELDS.find(field => !robot[field]);

			if (!!missingField) {
				missingRobotsField = missingField;
			}
		});

		if (missingRobotsField) {
			self.sendSocketNotification(
				'ERROR',
				`<i>Confg.robots[].${missingRobotsField}</i> is required for module: ${self.name}.`
			);
			return true;
		}

		return false;
	},

	scheduleUpdates() {
		const self = this;

		for (let index = 0; index < self.config.robots.length; index++) {
			self.updateStats(index);
			setInterval(function() {
				self.updateStats(index);
			}, self.config.updateInterval);
		}
	}
});
