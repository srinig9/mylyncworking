/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system: for example, this would be a good place
 * to store database or email passwords that apply only to you, and shouldn't
 * be shared with others in your organization.
 *
 * These settings take precedence over all other config files, including those
 * in the env/ subfolder.
 *
 * PLEASE NOTE:
 *		local.js is included in your .gitignore, so if you're using git
 *		as a version control solution for your Sails app, keep in mind that
 *		this file won't be committed to your repository!
 *
 *		Good news is, that means you can specify configuration for your local
 *		machine in this file without inadvertently committing personal information
 *		(like database passwords) to the repo.  Plus, this prevents other members
 *		of your team from commiting their local configuration changes on top of yours.
 *
 *    In a production environment, you probably want to leave this file out
 *    entirely and leave all your settings in env/production.js
 *
 *
 * For more information, check out:
 * http://sailsjs.org/#!/documentation/anatomy/myApp/config/local.js.html
 */

module.exports = {

  /***************************************************************************
   * Your SSL certificate and key, if you want to be able to serve HTTP      *
   * responses over https:// and/or use websockets over the wss:// protocol  *
   * (recommended for HTTP, strongly encouraged for WebSockets)              *
   *                                                                         *
   * In this example, we'll assume you created a folder in your project,     *
   * `config/ssl` and dumped your certificate/key files there:               *
   ***************************************************************************/

  // ssl: {
  //   ca: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl_gd_bundle.crt'),
  //   key: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.key'),
  //   cert: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.crt')
  // },

  /***************************************************************************
   * The `port` setting determines which TCP port your app will be           *
   * deployed on.                                                            *
   *                                                                         *
   * Ports are a transport-layer concept designed to allow many different    *
   * networking applications run at the same time on a single computer.      *
   * More about ports:                                                       *
   * http://en.wikipedia.org/wiki/Port_(computer_networking)                 *
   *                                                                         *
   * By default, if it's set, Sails uses the `PORT` environment variable.    *
   * Otherwise it falls back to port 1337.                                   *
   *                                                                         *
   * In env/production.js, you'll probably want to change this setting       *
   * to 80 (http://) or 443 (https://) if you have an SSL certificate        *
   ***************************************************************************/

  // port: process.env.PORT || 1337,

  /***************************************************************************
   * The runtime "environment" of your Sails app is either typically         *
   * 'development' or 'production'.                                          *
   *                                                                         *
   * In development, your Sails app will go out of its way to help you       *
   * (for instance you will receive more descriptive error and               *
   * debugging output)                                                       *
   *                                                                         *
   * In production, Sails configures itself (and its dependencies) to        *
   * optimize performance. You should always put your app in production mode *
   * before you deploy it to a server.  This helps ensure that your Sails    *
   * app remains stable, performant, and scalable.                           *
   *                                                                         *
   * By default, Sails sets its environment using the `NODE_ENV` environment *
   * variable.  If NODE_ENV is not set, Sails will run in the                *
   * 'development' environment.                                              *
   ***************************************************************************/

   // environment: process.env.NODE_ENV || 'development'
   
   appUrl: 'http://localhost',

   appUrlwPort: 'http://localhost:1337',
   
   portSoketIo: '2087',
   
   profile_image_url : '/uploads/users/',

   feedmedia_url : '/uploads/feeds/',

   doc_url : '/download_document/',

   pdfDock : '/pdfs/',
   
   froala_key : 'EhC-11hlmmB15C-22cE-13bk==',
   
   clickatell_user : 'koinworx@gmail.com',
   clickatell_pass : 'Lynked.World2018',
   clickatell_key  : 'Mc_3DTUvRNSbioT_MFC-zg==',
   FCM_key : 'AAAA4M-V8Hk:APA91bFUfccJgfPjcvY5bletQUgqf7b3_7K2aXF9om8KCbOKarSjnhHTAIKaWEzIo79JjgvV3sDUxNwTEvylIptpXKRd83BfMpf_AM35RVhdYlsdq6qrfNWQh5yOaPTP-9JuWyJvOsfO',
   age_restrict : 13,
   
   // For Local : 521363700039-vrmbj75pch40ta2sulujq0qgokc90ad9.apps.googleusercontent.com
   // For Dev : 639486735123-a3j0o5n3iveej2un2acqop6bktaj4goo.apps.googleusercontent.com
   
   google_client_id : '521363700039-vrmbj75pch40ta2sulujq0qgokc90ad9.apps.googleusercontent.com',
   
   /* appEtherUrl: 'http://18.218.84.141',
   portEtherIo: '2096',
   eth_adminAddress : '0x6259c159d8fe78339c3e3646d6e3eefdbf561e5e',
   eth_adminEthPass : 'e5daaf1ec10d03d4c5ac42e1c381aa68',
   eth_timeout : 50,
   contract_file : 'LynkedWorldContract.json',
   ether_lieve_server : 'https://etherscan.io/tx/',
   eth_gas : 3000000,
   eth_gas_price : 1000000000,
   network_addr_num : 1, */
   
   appEtherUrl: 'http://52.14.40.43',
   portEtherIo: '2096',
   eth_adminAddress : '0x54c7577181f31c3e297c51c50898ca63e48efc2e',
   eth_adminEthPass : '4a2391381e5a52f5fe65f903b0a812cab1b0324b43973bb0c51da013e205cd9d',
   eth_timeout : 1000,
   contract_file : 'myContract.json',
   ether_lieve_server : 'https://rinkeby.etherscan.io/tx/',
   eth_gas : 3000000,
   eth_gas_price : 1000000000,
   network_addr_num : 4,

   iso_app_url:"https://itunes.apple.com/us/app/lynked-world/id1363700735?ls=1&mt=8",
   android_app_url:"https://play.google.com/store/apps/details?id=com.world.lynkedworld",
   
};