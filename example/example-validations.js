/**
 * Example validations.
 */
(function() {
  "use strict";

  // # Add validation functions...
  DSValidation.registerValidation('match', function(value, options, accept, reject) {
    if(value === options.matchValue && value !== '') {
      return accept({
        message: 'Looks good!'
      });
    } else {
      return reject({
        message: 'That doesn\'t match.'
      });
    }
  });

  // ## Name
  // Greets the user when they enter their name.
  DSValidation.registerValidation("required", function(string, options, accept, reject) {
    if( string !== "" ) {
      return accept({
        message: 'Looks good!'
      });
    } else {
      return reject({
        message: 'This field is required.'
      });
    }
  });

  DSValidation.registerValidation("min", function(value, params, accept, reject) {
    if(parseInt(value) >= params) {
      return accept({
        message: 'Great!'
      });
    } else {
      return reject({
        message: 'Value must be greater than ' + params + '.'
      });
    }
  });

  DSValidation.registerValidation("max", function(value, params, accept, reject) {
    if(parseInt(value) <= params) {
      return accept({
        message: 'Great!'
      });
    } else {
      return reject({
        message: 'Value must be less than ' + params + '.'
      });
    }
  });

  // ## Birthday
  // Validates correct date input, reasonable birthdate, and says a nice message.
  DSValidation.registerValidation("birthday", function(string, options, accept, reject) {
    var birthday, birthMonth, birthDay, birthYear, format;

    // Parse date from string
    if( /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(string) ) {
      // US formatting
      birthday = string.split("/");
      birthMonth = parseInt(birthday[0]);
      birthDay = parseInt(birthday[1]);
      birthYear = parseInt(birthday[2]);
    } else {
      return reject({
        message: "Enter your birthday MM/DD/YYYY!"
      });
    }

    // fail if incorrect month
    if (birthMonth > 12 || birthMonth === 0) {
      return reject({
        message: "That doesn't seem right."
      });
    }

    //list of last days in months and check for leap year
    var endDates = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(((birthYear % 4 === 0) && (birthYear % 100 !== 0)) || (birthYear % 400 === 0)){
      endDates[2] = 29;
    }

    // fail if incorrect day
    if (birthDay > endDates[birthMonth]) {
      return reject({
        message: "That doesn't seem right."
      });
    }

    // calculate age
    // Source: http://stackoverflow.com/questions/4060004/calculate-age-in-javascript#answer-7091965
    var birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    var now = new Date();
    var age = now.getFullYear() - birthDate.getFullYear();
    var m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0)  {
      return reject({
        message: "Are you a time traveller?"
      });
    } else if( age > 0 && age <= 25  ) {

      if (birthDate.getMonth() === now.getMonth() && now.getDate() === birthDate.getDate() ) {
        return accept({
          message: "Wow, happy birthday!"
        });
      } else if ( age < 10) {
        return accept({
          message: "Wow, you're " + age + "!"
        });
      } else {
        return accept({
          message: "Cool, " + age + "!"
        });
      }

    } else if (age > 25 && age < 130) {
      return accept({
        message: "Got it!"
      });
    } else if (string === "") {
      return reject({
        message: "We need your birthday."
      });
    } else {
      return reject({
        message: "That doesn't seem right."
      });
    }
  });

})();
