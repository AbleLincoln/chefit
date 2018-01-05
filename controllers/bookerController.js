const nodemailer = require('nodemailer');
const unirest = require('unirest');
const uuidv1 = require('uuid/v1');

const baseURL = "https://chefit.herokuapp.com"

// Mailer transport
const outlookTransport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS
  },
  secureConnection: false,
  tls: { ciphers: 'SSLv3' }
});

function sendMail(mail) {
  outlookTransport.sendMail(mail, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

exports.homePage = (req, res) => {
    res.render('index');
}

exports.submitted = (req, res) => {
  res.render('index', { submitted: 'submitted' })
  
  if(!req.query.name) { // can't send mail without query params
    return;
  }

  // get the data from query params
  const data = req.query;

  // arrays for datetime in English
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  // make JS date
  const date = new Date(data.date);
  // human-readable English format
  const dateString = `${days[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

  // set diet & additional comments to pleasant format
  const diet = (data.diet ? data.diet : "none");
  const additionalComments = (data.additional ? data.additional : "none");

  // send customer email
  sendMail({
    from: process.env.OUTLOOK_USER,
    to: `${data.email}`,
    subject: 'ChefIt Reservation',
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
    Additional comments: ${additionalComments} <br />
    Please have the dishwasher emptied prior to the meal to make the process easier for our chef and have the kitchen clean and ready for our chef to execute the meal. This process requires a functioning kitchen with a working stovetop and oven. Also, please notify us of any specific parking issues that our chef should be made aware of. If you have any further questions or if any of the information on our end is incorrect, please contact us at admin@getchefit.com. Thank you for booking through CHEFIT and we hope you enjoy this one of a kind home dining experience.
    <br /> Please remember
    <ul>
      <li>There is a 48-hour cancellation policy with this reservation.</li>
      <li>Note that the chef will need to ARRIVE an hour and a half before the selected dinner time.</li>
      <li>Please take note of our add-on options for desserts and wine.</li>
      <li>Please allow and plan for an hour of prep time before your first dish is served.</li>
      <li>The CHEFIT team would greatly appreciate it if you would fill out a quick online survey following the meal.</li>
    </ul>`
  })

  // send admin email
  sendMail({
    from: process.env.OUTLOOK_USER,
    to: process.env.OUTLOOK_USER,
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
    Additional comments: ${additionalComments} <br />`,
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
    Additional comments: ${additionalComments} <br />`
  })

  // send Zapier parser email
  sendMail({
    from: process.env.OUTLOOK_USER,
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
  })

  res.render('index', { submitted: 'submitted' })
}

exports.square = (req, res) => {
  const data = req.body;
  // console.log('diet: ' + (data.diet && [].concat(data.diet).join(' ')));
  var price;
  data.package === "Temptation" ? price = 6000 : price = 10000;
  var token = require('crypto').randomBytes(64).toString('hex');
  purchaseParams = {
    "redirect_url": `${baseURL}/submitted?appetizer=${data.appetizer}&salad=${data.salad}&main=${data.main}&package=${data.package}&people=${data.people}&date=${data.date}&time=${data.time}&name=${data.name}&phone=${data.phone}&email=${data.email}&address=${data.address}&diet=${data.diet && [].concat(data.diet).join(' ')}`,
    "idempotency_key": token,
    "ask_for_shipping_address": false,
    "merchant_support_email": process.env.OUTLOOK_USER,

    "order": {
      "reference_id": uuidv1(),
      "line_items": [
        {
          "name": `${data.package} package`,
          "quantity": data.people,
          "base_price_money": {
            "amount": price,
            "currency": "USD"
          },
          "taxes": [
            {
              "name": "Taxes and fees",
              "percentage": "15"
            }
          ]
        }
      ]
    },
    "pre_populate_buyer_email": data.email
  };

  unirest.post(`https://connect.squareup.com/v2/locations/${process.env.SQUARE_LOCATION_ID}/checkouts`)
  .headers({
		'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
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