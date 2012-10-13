var nodemailer = require('nodemailer')
  , mailer = nodemailer.createTransport('Sendmail')

mailer.sendMail(
  { to: 'paul.serby@clock.co.uk'
    , from: 'paul.serby@clock.co.uk'
    , subject: 'Email Integration Test'
    , text: 'Congratulations you received an email'
  }
  , function(error, responseStatus) {
    console.log(error, responseStatus)
  }
)