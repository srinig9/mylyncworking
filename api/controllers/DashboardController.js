/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	default: function(req, res){
		//console.log(req.user.id);
		//console.log(req.user.name);
		return res.view('dashboard',{
			status: 'OK',
			title: 'Welcome | Lynked.World'
		})
	},	
};

