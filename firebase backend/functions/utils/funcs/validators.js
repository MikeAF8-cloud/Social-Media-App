const isEmpty = (string) => {
    return string.trim() === '' ? true : false;
}

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(emailRegEx) ? true : false;
};

module.exports.validateSignUp = (newUser) => {
    let errors = {};
    
    // Email validation 
    if(isEmpty(newUser.email)) {
        errors.email = "Email must not be empty";
    }else if (!isEmail(newUser.email)) {
        errors.email = "Must be a valid email address";
    }

    //Password Validation
    if (isEmpty(newUser.password)) {
        errors.password = "Must not be empty";
    } else if (newUser.password.length < 7) {
        errors.password = "Must be at least 7 characters long";
    }

    // Confirm Password Validation 
    if (isEmpty(newUser.confirmPassword) || newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    //User Handle Validation
    if (isEmpty(newUser.handle)) {
        errors.handle = "Username must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

module.exports.validateLogin = (user) => {
    let errors = {};

    if (isEmpty(user.email)) {
        errors.email = "Must not be empty";
    }
    if (isEmpty(user.password)) {
        errors.password = "Must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}

module.exports.reduceUserDetails = (userData) => {
    let userDetails = {};
    
    //Checking if a bio was written
    if(!isEmpty(userData.bio.trim())) {
        userDetails.bio = userData.bio;
    }

    //Check to see if a valid website link was provided
    if(!isEmpty(userData.website)) {
        let website = '';
        if(userData.website.substring(0, 4) !== "http") {
           website = "http://";
        }
        website += userData.website;
        userDetails.website = website;
    }

    //Check to see if location was provided
    if(!isEmpty(userData.location.trim())) {
        userDetails.location = userData.location;
    }

    return userDetails;
}