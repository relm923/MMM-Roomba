/* Magic Mirror
 * Node Helper: MMM-Roomba980
 *
 * By Reagan Elm
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Dorita980  = require('dorita980');

const REQUIRED_FIELDS = ['username', 'password', 'ipAddress'];
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

		self.Roomba = new Dorita980.Local(
			self.config.username,
			self.config.password,
			self.config.ipAddress
		);

		self.scheduleUpdates();

		self.started = true;
	},

	updateStats: function() {
		const self = this;

		self.Roomba.getRobotState(ROOMBA_STATS).then((state) => {
			Object.assign(self.stats, {
				name: state.name,
				binFull: state.bin.full,
				batteryPercent: state.batPct,
				phase: state.cleanMissionStatus.phase,
			});

			self.Roomba.end();
			self.sendSocketNotification('STATS', self.stats);
		}).catch((err) => {
			console.error('Error occurred while fetching stats', err);
			self.Roomba.end();
		});
	},

	isInvalidConfig: function() {
		const self = this;

		let missingField = REQUIRED_FIELDS.find((field) => {
			return !self.config[field];
		});

		if (missingField) {
			self.sendSocketNotification(
				'ERROR',
				`<i>Confg.${missingField}</i> is required for module: ${self.name}.`
			);
		}

		return !!missingField;
	},

	scheduleUpdates() {
		const self = this;

		self.updateStats();
		setInterval(function() {
			self.updateStats();
		}, self.config.updateInterval);
	},
});
