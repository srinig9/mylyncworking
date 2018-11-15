const	passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function(users, cb) {
	cb(null, users.id);
});

passport.deserializeUser(function(id, cb){
	Users.findOne({id}, function(err, users) {
		cb(err, users);
	});
});

passport.use(new LocalStrategy({
	usernameField: 'loginid',
	passportField: 'password'
},function(loginid, password, cb){
	Users.findOne({loginid: loginid.trim()}).populate('company_id').exec(function(err,users){
		if(err) return cb(err);

		if(!users) return cb(null, false, {message: 'Incorrect Login credentials or Login ID'});

		if(users.status=='0'){
			return cb(null, false, {message: 'Your account is closed. Please conact to administrator for reopen your account.'});
		}

		if(users.password == password){
			let userDetails = {
				name: users.name,
				loginid: users.loginid,
				id: users.id
			};
			return cb(null, userDetails, { message: 'Login Succesful'});
		} else {
			bcrypt.compare(password, users.password, function(err, res){
				if(!res) return cb(null, false, { message: 'Invalid Password' });
				var company_id='';

				if(typeof users.company_id!='undefined' && users.company_id!=''){
					company_id=users.company_id
				}

				let userDetails = {
					name: users.name,
					loginid: users.loginid,
					id: users.id,
					company_id: company_id,
				};
				
				return cb(null, userDetails, { message: 'Login Succesful'});
			});
		}
	});
}));