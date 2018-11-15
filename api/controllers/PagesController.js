/**
 * PagesController.js
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	terms_and_conditions: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/terms_and_conditions',{
					status: "OK",
					title: "Terms & Conditions | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/terms_and_conditions',{
				status: "OK",
				title: "Terms & Conditions | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	cookie_policy: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/cookie-policy',{
					status: "OK",
					title: "Cookie Policy | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/cookie-policy',{
				status: "OK",
				title: "Cookie Policy | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	privacy_policy: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/privacy_policy',{
					status: "OK",
					title: "Privacy Policy | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/privacy_policy',{
				status: "OK",
				title: "Privacy Policy | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	user_agreement: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/user_agreement',{
					status: "OK",
					title: "User Agreement | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/user_agreement',{
				status: "OK",
				title: "User Agreement | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	faq: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/faq',{
					status: "OK",
					title: "FAQ | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/faq',{
				status: "OK",
				title: "FAQ | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	rewards: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/rewards',{
					status: "OK",
					title: "Rewards | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/rewards',{
				status: "OK",
				title: "Rewards | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	about_us: function(req,res){
		//console.log("HERE");
		var our_team = [
			{
				'name': 'Arun Kumar',
				'headline': 'Founder & CEO',
				'description': '',
				'link': 'https://lynked.world/profile/arun-kumar-2942',
				'target': '',
				'img': '/themes/frontend/images/arun-kumar.png'
			},
			{
				'name': 'Debasish Biswas',
				'headline': 'Global Strategy Advisor',
				'description': '',
				'link': 'https://www.linkedin.com/in/debasishbiswas/',
				'target': '_blank',
				'img': '/themes/frontend/images/debashish-biswas.jpg'
			},
			{
				'name': 'Owen Maree',
				'headline': 'Business Development',
				'description': '',
				'link': '#',
				'target': '',
				'img': ''
			},
			{
				'name': 'Gary Scot',
				'headline': 'E-Commerce Strategist',
				'description': '',
				'link': '#',
				'target': '',
				'img': '/themes/frontend/images/gary.jpg'
			},
			{
				'name': 'Meenakshi Mehra',
				'headline': 'Sales Executive',
				'description': '',
				'link': '#',
				'target': '',
				'img': '/themes/frontend/images/meenakshi.jpg'
			},
			{
				'name': 'Saravana Kumar Malaichami',
				'headline': 'Blockchain Specialist',
				'description': '',
				'link': 'https://www.linkedin.com/in/saravana-malaichami/',
				'target': '_blank',
				'img': '/themes/frontend/images/saravana-kumar.jpg'
			},
			{
				'name': 'Sunil Kumar',
				'headline': 'Business Development',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/sunil-kumar',
				'img': '/themes/frontend/images/sunil-kumar.png'
			},
			{
				'name': 'Anil Boricha',
				'headline': 'Sr Software Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/anil-boricha',
				'img': '/themes/frontend/images/anil-boricha.png'
			},
			{
				'name': 'Jaydev Vaghela',
				'headline': 'Sr Software Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/jaydevsinh-vaghela',
				'img': '/themes/frontend/images/jaydev-vaghela.png'
			},
			{
				'name': 'Bhavesh Amin',
				'headline': 'Software Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/bhavesh-amin',
				'img': '/themes/frontend/images/bhavesh-amin.png'
			},
			{
				'name': 'Yatin Dhingani',
				'headline': 'Software Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/yatin-dhingani',
				'img': '/themes/frontend/images/yatin-dhingani.png'
			},
			{
				'name': 'Nishant Kansagara',
				'headline': 'Sr UI/UX Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/nishant-kansagra',
				'img': '/themes/frontend/images/nishant-kansagra.png'
			},
			{
				'name': 'Vishal Gohel',
				'headline': 'Sr iOS Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/vishal-gohel',
				'img': '/themes/frontend/images/vishal-gohel.jpg'
			},
			{
				'name': 'Vandan Javiya',
				'headline': 'Sr iOS Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/vandan-javiya',
				'img': '/themes/frontend/images/vandan-javiya.png'
			},
			{
				'name': 'Khader Saleem',
				'headline': 'Sr Android Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/khader-saleem',
				'img': ''
			},
			{
				'name': 'Hardik Viradiya',
				'headline': 'Sr Android Developer',
				'description': '',
				'target': '_blank',
				'link': 'https://www.linkedin.com/in/hardik-viradiya-34755682/',
				'img': '/themes/frontend/images/hardik-viradiya.jpg'
			},
			{
				'name': 'Rajat Jayswal',
				'headline': 'Sr Android Developer',
				'description': '',
				'target': '',
				'link': 'https://lynked.world/profile/rajat-jaswal-1595',
				'img': '/themes/frontend/images/rajat-jaswal.png'
			},
		];
		
		var our_advisors = [
			{
				'name': 'Shailendra Bhushan',
				'headline': 'Rtd. IG Prison (IAS), Govt of Jharkhand, India',
				'description': '',
				'link': '',
				'target': '',
				'img': 'http://attendance.jharkhand.gov.in/getPhoto.aspx?aadhaar=437018813221'
			},
			{
				'name': 'Professor M.L. Mitra',
				'headline': 'Founder National Law College',
				'description': '',
				'link': 'https://www.web.lawyersupdate.co.in/personality-of-the-month/personality-of-the-month-prof-n-l-mitra-law-education-must-be-imparted-for-professional-use-in-all-domains/',
				'target': '_blank',
				'img': '/themes/frontend/images/ML-Mitra.jpg'
			},
			/* {
				'name': 'Prof. Arun K Pujari',
				'headline': 'Vice Chancellor, Central University Of Rajasthan',
				'description': '',
				'link': 'https://www.linkedin.com/in/arun-k-pujari-204bb914/',
				'target': '_blank',
				'img': 'http://www.curaj.ac.in/images/admin/Prof.%20Arun%20K.%20Pujari.jpg'
			}, */
			{
				'name': 'Dr. Santanu Rath',
				'headline': 'Diretor Personal, The Odisha Mining Corporation Limited',
				'description': '',
				'link': 'https://www.linkedin.com/in/dr-santanu-rath-18046718/',
				'target': '_blank',
				'img': '/themes/frontend/images/santanu-rath.jpg'
			},
			{
				'name': 'Arindam Mitra',
				'headline': 'Principal, DELOITTE TAX',
				'description': '',
				'link': 'https://www.linkedin.com/in/arindam-mitra-97a6292/',
				'target': '_blank',
				'img': '/themes/frontend/images/arindam-mitra.jpg'
			},
			{
				'name': 'Aloke Mookherjea',
				'headline': 'Chairman, vice-chairman, director, Advisor',
				'description': '',
				'link': 'https://www.linkedin.com/in/aloke-mookherjea-51962847/',
				'target': '',
				'img': '/themes/frontend/images/aloke-m.jpg'
			},
			/*{
				'name': 'B.P. Pandey',
				'headline': 'Chairman at HRD INDIA',
				'description': '',
				'link': 'https://www.linkedin.com/in/babban-prasad-pandey/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C5603AQEP7_oGaHVFIg/profile-displayphoto-shrink_800_800/0?e=1527494400&v=alpha&t=P4Sqhx0tBaV82kQ9AGWQeNUpmE42YtsrfR44dRlqbSM'
			},*/
			{
				'name': 'Nirmalya Ghosh',
				'headline': 'CEO at DXCorr Design Inc.',
				'description': '',
				'link': 'https://www.linkedin.com/in/nirmalya-ghosh-7445792/',
				'target': '_blank',
				'img': '/themes/frontend/images/nirmalaya-ghosh.jpg'
			},
			{
				'name': 'Debasis Basu Chowdhury',
				'headline': 'Partner at DNTK Services and Solutions LLP, Director & Senior VP, Capgemini & BLS',
				'description': '',
				'link': 'https://www.linkedin.com/in/debasis-basu-chowdhury-8b90132/',
				'target': '_blank',
				'img': '/themes/frontend/images/debasis-basu.jpg'
			},
			{
				'name': 'Pablo Nill',
				'headline': 'Business Excellence SC Customer Service at Nestle, Switzerland',
				'description': '',
				'target': '',
				'link': 'https://www.linkedin.com/in/pablo-nill-9a1a259/',
				'img': '/themes/frontend/images/Pablo-Nill.jpg'
			},
			{
				'name': 'Partha Sarathi Guha Patra',
				'headline': 'Founder at ASADEL Technologies Pvt. Ltd.',
				'description': '',
				'link': 'https://www.linkedin.com/in/psgpdel/',
				'target': '_blank',
				'img': '/themes/frontend/images/partha-sarathi-guha-patra.jpg'
			},
			{
				'name': 'Giorgio Cabai',
				'headline': 'Presidente STS, Switzerland',
				'description': '',
				'link': 'https://www.linkedin.com/in/giorgio-cabai-04589a28/',
				'target': '_blank',
				'img': '/themes/frontend/images/giorgio-cabai.jpg'
			},
			{
				'name': 'Tomaž Jazbec',
				'headline': 'Head of Marketing, RUDIS LLC Trbovlje, Solvania',
				'description': '',
				'link': 'https://www.linkedin.com/in/toma%C5%BE-jazbec-745b4560/',
				'target': '_blank',
				'img': '/themes/frontend/images/tomaz-jazbac.png'
			},
			{
				'name': 'Sandeev Kumar',
				'headline': 'Head & Vice President, Tata Projects Limited',
				'description': '',
				'link': 'https://www.linkedin.com/in/sanjeev-kumar-3b81912a/',
				'target': '_blank',
				'img': '/themes/frontend/images/sandeev-kumar.jpg'
			},
			{
				'name': 'Mikhail Matveev',
				'headline': 'Internation Business Development Director,Mascow Rusia',
				'description': '',
				'link': 'http://en.metprom.net/',
				'target': '_blank',
				'img': ''
			},
			{
				'name': 'Prof. H. K Mallik',
				'headline': 'Professor,Indian Institute of Technology Delhi',
				'description': '',
				'link': 'http://physics.iitd.ac.in/content/prof-hkmalik',
				'target': '_blank',
				'img': '/themes/frontend/images/hkmalik.jpg'
			},
			{
				'name': 'Indrani Chatterjee',
				'headline': 'Director - Human Capital and Chief People Officer at PwC',
				'description': '',
				'link': 'https://www.linkedin.com/in/indrani-chatterjee-0873437/',
				'target': '_blank',
				'img': ''
			},
			{
				'name': 'Shri Pal Singh',
				'headline': 'C.E.O at Brain Technosys Pvt. Ltd',
				'description': '',
				'link': 'https://www.linkedin.com/in/shripalsingh',
				'target': '_blank',
				'img': '/themes/frontend/images/shripal-singh.jpg'
			},
			{
				'name': 'Anuj Goel',
				'headline': 'Executive Advisor, Cybersecurity & Risk, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/goelanuj',
				'target': '_blank',
				'img': '/themes/frontend/images/anuj-goel.jpg'
			},
			{
				'name': 'Kautilya Verma',
				'headline': 'Director - Cognizant Company, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/ktverma78/',
				'target': '_blank',
				'img': '/themes/frontend/images/kautilya-verma.jpg'
			},
			{
				'name': 'Rakesh Kumar',
				'headline': 'Director - Hitachi Consulting, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/rakesh-kumar-b5528b1/',
				'target': '_blank',
				'img': '/themes/frontend/images/rakesh-kumr.jpg'
			},
			{
				'name': 'Akshat Kumar Jain',
				'headline': 'Co-Founder Cyware Labs',
				'description': '',
				'link': 'https://www.linkedin.com/in/akshatkumarjain/',
				'target': '_blank',
				'img': '/themes/frontend/images/akshat-kumar.jpg'
			},
			{
				'name': 'Yogesh Kumar',
				'headline': 'President at NTA General Insurance, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/yogesh-kumar-31212621',
				'target': '_blank',
				'img': '/themes/frontend/images/yogesh-kumar.jpg'
			},
			/* {
				'name': 'Juan Luis Betancourt',
				'headline': 'CEO, Humantelligence, Inc.',
				'description': '',
				'link': 'https://www.linkedin.com/in/juanluisbetancourt',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C4E03AQGpA3ffi7M7cw/profile-displayphoto-shrink_800_800/0?e=1525334400&v=alpha&t=9l3yGeJNCT1yGytNsHf5AfpWRY8GqkWdpc418nAVp-s'
			}, 
			{
				'name': 'Navdeep Agarwal',
				'headline': 'General Manager - Business Intelligence',
				'description': '',
				'link': 'https://www.linkedin.com/in/navdeepagarwal/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C5103AQEM2_AqRbFgRw/profile-displayphoto-shrink_800_800/0?e=1525334400&v=alpha&t=SsJU1F1ERtljI5H2t7RIW_Y4eTVincEmPx3g3mPNFBA'
			},*/
			{
				'name': 'Amit Singh',
				'headline': 'Country Head at IFP, Kuwait',
				'description': '',
				'link': 'https://www.linkedin.com/in/amit-singh-b5096115/',
				'target': '_blank',
				'img': '/themes/frontend/images/amit-singh.jpg'
			},
			{
				'name': 'Tusar Raj',
				'headline': 'Assistant Vice President, Equitas Small Finance Bank Ltd.',
				'description': '',
				'link': 'https://lynked.world/profile/tushar-raj',
				'target': '',
				'img': '/themes/frontend/images/tushar.jpg'
			},
			/*{
				'name': 'Atul Goyal',
				'headline': 'Senior Principal Product Manager at Oracle Corporation, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/goyalatul/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C5603AQG1eQ_tnLjeuw/profile-displayphoto-shrink_800_800/0?e=1525334400&v=alpha&t=M2C-aEXg-CN7qHcMEYyXlZRPYd23IJDv0Rl98H_ckPk'
			},
			{
				'name': 'Vikram Kale',
				'headline': 'GPHR Consultant at Amazon, Lxembourg',
				'description': '',
				'link': 'https://www.linkedin.com/in/kalevikram/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C4E03AQFLElaDzyt9JQ/profile-displayphoto-shrink_800_800/0?e=1525334400&v=alpha&t=_z2I3NFLfTvVCW0HujJlAqIyyEPvrVK6SwYvoSChb0k'
			},
			{
				'name': 'Avaneesh Srivastava',
				'headline': 'Project Delivery Manager, Pactera Pte Singapore',
				'description': '',
				'link': '#',
				'target': '',
				'img': ''
			},
			{
				'name': 'Niteesh Srivastava',
				'headline': 'Founder/Director, Knight Rises Pte Australia',
				'description': '',
				'link': '#',
				'target': '',
				'img': ''
			},
			{
				'name': 'Kaushal Kumar',
				'headline': 'Systems Architect at Tullett Prebon, USA',
				'description': '',
				'link': 'https://www.linkedin.com/in/kaushal-kumar-5b006b6/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C4E03AQFOOA0oTfbwWg/profile-displayphoto-shrink_800_800/0?e=1525453200&v=alpha&t=rvp_Tc0fiMr5h8ad4_HiAdMKELnP_sUNi4uG7fAsZ-A'
			},
			{
				'name': 'Neeraj Tripathi',
				'headline': 'Senior Program Manager at Microsoft',
				'description': '',
				'link': 'https://www.linkedin.com/in/neeraj-tripathi-753ba821/',
				'target': '_blank',
				'img': 'https://media.licdn.com/dms/image/C4D03AQGHJmFcjpIzcA/profile-displayphoto-shrink_800_800/0?e=1525453200&v=alpha&t=6IHO0CGn2Rkb7rE6n4CVRcXulMn2qx0KLvPL1EOV0Zg'
			},*/
		];
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/about_us',{
					status: "OK",
					title: "About Us | Lynked.World",
					userData:userInfo,
					our_team: our_team,
					our_advisors: our_advisors
				});
			});
		} else {
			res.view('pages/about_us',{
				status: "OK",
				title: "About Us | Lynked.World",
				layout: 'layouts/loginLayout',
				our_team: our_team,
				our_advisors: our_advisors
			});
		}
	},

	contact_us: function(req,res){
		//console.log("HERE");
		if (req.user) {
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				res.view('pages/contact_us',{
					status: "OK",
					title: "Contact Us | Lynked.World",
					userData:userInfo
				});
			});
		} else {
			res.view('pages/contact_us',{
				status: "OK",
				title: "Contact Us | Lynked.World",
				layout: 'layouts/loginLayout'
			});
		}
	},

	business_solutions: function(req,res){
		//console.log("HERE");
		res.view('pages/business-solutions',{
			status: "OK",
			title: "Instant Identity And Backgroung Verification Platform on Blockchain | Lynked.World",
			keywords:'Digital Indentity on Blockchain, Instant Identity Verification through Blockchain, Instant Employment Verification through Blockchain, Instant Educational Degree Certificate Verification, Fill Application Through Digital Identity. Build your Digital Identity Based Application.',
			layout: 'layouts/loginLayout'
		});
	},

	awards: function(req,res){
		//console.log("HERE");
		res.view('pages/awards',{
			status: "OK",
			title: "Awards | Lynked.World",
			keywords:'Times Ascent Awards',
			layout: 'layouts/loginLayout'
		});
	},

	inauguration: function(req,res){
		//console.log("HERE");
		res.view('pages/inauguration',{
			status: "OK",
			title: "Inauguration | Lynked.World",
			keywords:'Lynked.World Inauguration',
			layout: 'layouts/loginLayout'
		});
	},

	refer: function(req,res){
		var user_id = (typeof req.user!='undefined' && req.user!='')?req.user.id:0;
		UserDataService.UserDetails(req,user_id).then(function(userInfo){
			res.view('connection/refer-a-friend',{
				status: "OK",
				title: "Refer A Friend | Lynked.World",
				keywords:'',
				userData:userInfo
				// layout: 'layouts/loginLayout'
			});
		});
	},

	referAfriend: function(req,res){
		var friend_email = req.param("friend_email");
		var array = friend_email.split(",");
		
		array.forEach(function(email, index){
			sails.hooks.email.send(
				"referAfriend",
				{
					siteURL: sails.config.appUrlwPort,
					message: req.param("message"),
					referral_code: req.param("referral_code"),
					recipientEmail: email.trim(),
				},
				{
					to: email.trim(),
					subject: "Your friend invited you to join Lynked.World."
				},
				function(err) {
					console.log(err || "It worked!");
				}
			);
		});
		return res.redirect("/refer-a-friend");
	},

	partners: function(req,res){
		//console.log("HERE");
		res.view('pages/partners',{
			status: "OK",
			title: "Partners | Lynked.World",
			layout: 'layouts/loginLayout'
		});
	},

	jobs: function(req,res){
		return res.view('pages/jobs',{
			status: "OK",
			title: 'Find and Post Your Job | Lynked.World',
			keywords:'Find and Post your Job. Find Internship, Part-Time Job, Contract Job, Freelance Job',
			layout: 'layouts/loginLayout'
		});
	},

	help: function(req,res){
		var user_id = (typeof req.user !='undefined' && req.user !='') ? req.user.id : 0;
		Helps.find({status:1}).exec(function(err,data){
			UserDataService.UserDetails(req,user_id).then(function(userInfo){

				if(user_id==0){
					return res.view('pages/help',{
						data:data,
						status: "OK",
						title: 'Help | Lynked.World',
						layout: 'layouts/loginLayout'
					});
				}else{
					return res.view('pages/help',{
						data:data,
						userData:userInfo,
						status: "OK",
						title: 'Help | Lynked.World'
					});
				}
			});
		});
	},

	errorFound: function(req,res){
		var return_arr = {
			status:"OK",
			title:"Error | Lynked.World"
			}

		if(req.isAuthenticated()){
			return_arr['is_login'] = 1;
			return res.view('pages/error',return_arr);
		} else {
			return_arr['is_login'] = 0;
			return_arr['layout'] = 'layouts/loginLayout';
			return res.view('pages/error',return_arr);
		}
	}
};

