var nodemailer = require('nodemailer')
  , mailer = nodemailer.createTransport('Sendmail')
  , assert = require('assert')

mailer.sendMail(
  { to: 'paul.serby@clock.co.uk'
    , from: 'paul.serby@clock.co.uk'
    , subject: 'Email Integration Test'
    , text: 'Congratulations you received an email'
  }
  , function(error, responseStatus) {
    assert(responseStatus)
  }
)