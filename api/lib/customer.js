var Person = require('./person');

function Customer(fitstName, lastName, dateOfBirth, companyName, mobilePhone, workPhone, companyName, skype){
  Person.apply(this, fitstName, lastName, dateOfBirth);
  this.companyName = companyName;

  this.phone = {};
  this.phone.mobile = mobilePhone;
  this.phone.work = workPhone;
  this.skype = skype
}

module.exports = Customer;