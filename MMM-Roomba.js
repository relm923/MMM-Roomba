/* global Module */

/* Magic Mirror
 * Module: MMM-Roomba
 *
 * By Reagan Elm
 * MIT Licensed.
 */

Module.register('MMM-Roomba', {
	defaults: {
		username: '',
		password: '',
		ipAddress: '',
		updateInterval: 60 * 1000, // 1 miniute
		animationSpeed: 2 * 1000, // 2 seconds
	},

	requiresVersion: '2.1.0',

	start() {
		const self = this;

		self.loaded = false;
		self.stats = {};

		self.sendSocketNotification('START', self.config);
		Log.info('Starting module: ' + self.name);
	},

	getDom() {
		const self = this;

		if (self.error) {
			return self.renderError();
		}

		if (!self.loaded) {
			return self.renderLoading();
		}

		return self.renderStats();
	},

	renderError() {
		const self = this;

		let wrapper = document.createElement('div');
		wrapper.className = 'dimmed light small';
		wrapper.innerHTML = self.error;
		return wrapper;
	},

	renderLoading() {
		const self = this;

		let wrapper = document.createElement('div');
		wrapper.className = 'dimmed light small';
		wrapper.innerHTML = self.translate('LOADING');

		return wrapper;
	},

	renderStats() {
		const self = this;

		let wrapper = document.createElement('table');
		wrapper.className = 'small';
		wrapper.innerHTML = `
			<tr>
				${self.renderName()}
				${self.renderPhase()}
				${self.renderBinStatus()}
				${self.renderBatteryStatus()}
			</tr>
		`;

		return wrapper;
	},

	renderName() {
		return `<td class="name">${this.stats.name}</td>`;
	},

	renderPhase() {
		const self = this;

		let phaseText;
		switch (self.stats.phase) {
			case 'charge':
				phaseText = self.translate('CHARGING');
				break;
			case 'hmUsrDock':
				phaseText = self.translate('RETURNING_HOME');
				break;
			case 'run':
				phaseText = self.translate('CLEANING');
				break;
			case 'stop':
				phaseText = self.translate('PAUSED');
				break;
			case 'stuck':
				phaseText = self.translate('STUCK');
				break;
			default:
				phaseText = `${self.translate('UNKNOWN')}: ${self.stats.phase}`;
		}

		return `<td class="phase title bright">${phaseText}</td>`;
	},

	renderBinStatus() {
		const self = this;

		let statusHtml = '';
		if (self.stats.binFull) {
			statusHtml = `
				<td class="bin title bright">
					<i class="fa fa-trash"></i> ${self.translate('FULL')}
				</td>
			`;
		}

		return statusHtml;
	},

	renderBatteryStatus() {
		return `
			<td class="battery">
				<i class="fa fa-bolt"></i> ${this.stats.batteryPercent}%
			</td>`;
	},

	socketNotificationReceived(notification, payload) {
		const self = this;

		switch (notification) {
			case 'STATS':
				self.loaded = true;
				self.stats = payload;
				break;
			case 'ERROR':
				self.error = payload;
				break;
		}

		this.updateDom(self.config.animationSpeed);
	},

	getScripts() {
		return [];
	},

	getStyles() {
		return [
			'MMM-Roomba.css',
			'font-awesome.css',
		];
	},

	getTranslations() {
		return {
			en: 'translations/en.json',
			es: 'translations/es.json',
			fr: 'translations/fr.json',
			sv: 'translations/sv.json'
		};
	},
});
