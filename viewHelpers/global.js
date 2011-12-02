var
	markdown = require('markdown').markdown,
	dateTime = require('../lib/utils/date.format'),
	condensedWeekdayList = require('../lib/utils/condenseWeekdayList');

module.exports.createHelpers = function(properties, app) {

	app.configure(function() {
		app
			// Application level helpers.
			.dynamicHelpers({
				session: function(req, res) {
					return req.session;
				},
				properties: function() {
					return properties;
				}
			})
			.helpers({
				dateTime: function(date) {
					return (new Date(date)).format('d mmm yyyy @ H:m:s');
				},
				date: function(date) {
					var d = new Date(date);
					return d.toDateString();
				},
				time: function(date) {
					//TODO: This should be time only
					var d = new Date(date);
					return d.toDateString();
				},
				getQuantitive: function(singular, plural, count) {
					return count === 1 ? count + ' ' + singular : count + ' ' + plural;
				},
				booleanFormatter: function(bool) {
					return (bool) ? "Yes" : "No";
				},
				markdown: function(text) {
					return markdown.toHTML(text);
				},
				addressList: function(addressArray) {
					var formattedAddress = [];
					addressArray.forEach(function(address) {
						if (address) {
							address = ' ' + address;
							formattedAddress.push(address);
						}
					});
					return formattedAddress;
				},
				numberTruncator: function(number, decimalPoints) {
					return number.toFixed(decimalPoints);
				},
				telephoneNumberFormatter: function(number) {
					var
						formattedNumber,
						matches;

					// Removing spaces
					formattedNumber = number.replace(/\s/g, '');
					matches = formattedNumber.match(/(^[\d]{5})([\d]{3})([\d]{3})/);

					// If the telephone number does not match the expected format.
					if (matches !== null && matches.length > 3) {
						formattedNumber = '(' + matches[1] + ') ' + matches[2] + ' ' + matches[3];
					}

					return formattedNumber;
				},
				condensedWeekdayList: condensedWeekdayList
			});
	});
};
