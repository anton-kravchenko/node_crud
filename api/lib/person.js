function Person(firstName, lastName, dateOfBirth) = {
	this.name = {};
	this.name.first = firstName;
	this.name.last = lastName;
    this.dateOfBirth = dateOfBirth;
}

module.exports = Person;