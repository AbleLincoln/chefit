const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChefIt', submitted: req.query.submitted });
});
/* POST book */
router.post('/book', book); // TODO put book in controller
router.post('/square', square);

function square(req, res, next) {
  console.log(req.body);
  const data = req.body;
  var price;
  data.package === "Temptation" ? price = 6000 : price = 10000;
  var token = require('crypto').randomBytes(64).toString('hex');
  purchaseParams = {
    "idempotency_key": token,
    "ask_for_shipping_address": false,
    "merchant_support_email": process.env.OUTLOOK_USER,

    "order": {
      "reference_id": "1",
      "line_items": [
        {
          "name": "package",
          "quantity": data.people,
          "base_price_money": {
            "amount": price,
            "currency": "USD"
          }
        }
      ]
    },
    "pre_populate_buyer_email": data.email
  };

  unirest.post("https://connect.squareup.com/v2/locations/CBASEIxRbg7g-Aqkv1UU3nEuHjQgAQ/checkouts")
  .headers({
		'Authorization': 'Bearer sandbox-sq0atb-xKIDuP2ShOCu_XvvU7HdWg',
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	})
	.send(purchaseParams)
  .end(response => {
    if (response.body.errors){
			res.json({status: 400, errors: response.body.errors})
		}else{
			res.redirect(response.body.checkout.checkout_page_url);
		};
  })
}

function book(req, res, next) {
  // Mailer transport
  const mailtrapTransport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS
    }
  });
  const outlookTransport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: 'admin@getchefit.com',
      pass: 'Kgetchefit01!'
    },
    secureConnection: false,
    tls: { ciphers: 'SSLv3' }
  });

  const data = req.body;
  console.log(data);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const date = new Date(data.date);
  const dateString = `${days[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

  var diet;
  if(data.diet) {
    // let arr = [].concat(data.diet);
    diet = data.diet.join(", ");
  } else {
    diet = "none";
  }

  // customer email
  const customerMail = {
    from: 'admin@getchefit.com',
    to: `${data.email}`,
    subject: 'ChefIt Reservation',
    // text: `Data.date: ${data.date} UTCDate: ${date.getUTCMonth() + 1}/${date.getUTCDate()}`
    html: `Dear ${data.name}, <br />
    This email is to confirm your CHEFIT reservation with the following details: <br />
    Date: ${dateString} <br />
    Time of first course: ${data.time}<br />
    Guests: ${data.people} <br />
    Address: ${data.address} <br />
    Number: ${data.phone} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main} <br />
    Diet: ${diet} <br />
    Additional comments: ${data.additional} <br />
    Please have the dishwasher emptied prior to the meal to make the process easier for our chef and have the kitchen clean and ready for our chef to execute the meal. This process requires a functioning kitchen with a working stovetop and oven. Also, please notify us of any specific parking issues that our chef should be made aware of. If you have any further questions or if any of the information on our end is incorrect, please contact us at admin@getchefit.com. Thank you for booking through CHEFIT and we hope you enjoy this one of a kind home dining experience.
    <br /> Please remember
    <ul>
      <li>There is a 48-hour cancellation policy with this reservation.</li>
      <li>Note that the chef will need to ARRIVE an hour and a half before the selected dinner time.</li>
      <li>Please take note of our add-on options for desserts and wine.</li>
      <li>Please allow and plan for an hour of prep time before your first dish is served.</li>
      <li>The CHEFIT team would greatly appreciate it if you would fill out a quick online survey following the meal.</li>
    </ul>`
  }
  outlookTransport.sendMail(customerMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  // admin email
  const adminMail = {
    from: 'admin@getchefit.com',
    to: `admin@getchefit.com`,
    subject: 'New ChefIt Reservation',
    text: `Hello ChefIt team, You have a new reservation. <br />
    Name: ${data.name} <br />
    Email: ${data.email} <br />
    Number: ${data.phone} <br />
    Guests: ${data.people} <br />
    Time: ${data.time} <br />
    Date: ${data.date} <br />
    Address: ${data.address} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main}
    Diet: ${diet} <br />
    Additional comments: ${data.additional} <br />`,
    html: `Hello ChefIt team, you have a new reservation. <br />
    Name: ${data.name} <br />
    Email: ${data.email} <br />
    Number: ${data.phone} <br />
    Guests: ${data.people} <br />
    Time: ${data.time} <br />
    Date: ${data.date} <br />
    Address: ${data.address} <br />
    Package: ${data.package} <br />
    Appetizer: ${data.appetizer} <br />
    Salad: ${data.salad} <br />
    Main: ${data.main}
    Diet: ${diet} <br />
    Additional comments: ${data.additional} <br />`
  }
  outlookTransport.sendMail(adminMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  // Zapier parser email
  const zapierMail = {
    from: 'admin@getchefit.com',
    to: `v5x2lxdd@robot.zapier.com`,
    subject: 'New ChefIt Reservation',
    text: `Hello ChefIt team, You have a new reservation.
    Name: ${data.name}
    Email: ${data.email}
    Number: ${data.phone}
    Guests: ${data.people}
    Time: ${data.time}
    Date: ${data.date}
    Address: ${data.address}
    Package: ${data.package}
    Appetizer: ${data.appetizer}
    Salad: ${data.salad}
    Main: ${data.main}
    Diet: ${diet}`
  }
  outlookTransport.sendMail(zapierMail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.redirect('/?submitted=submitted');
}

module.exports = router;
