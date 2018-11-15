/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': {
	controller: 'auth',
	action: "login",
  },

  'GET /load_more_feeds/:page_no': {
    controller: 'auth',
    action: "load_more_feeds"
  },

  'POST /logoutFromAll': 'AuthController.logoutFromAll',
  '/logout': 'AuthController.logout',
  '/socket_io_server': 'AuthController.socket_io_server',
  'POST /qr_code': 'AuthController.qr_code',
  'POST /AttemptQRLogin': 'AuthController.AttemptQRLogin',
  
  'POST /api/login_with_qr': 'AuthController.login_with_qr',
  'POST /login_with_id': 'AuthController.login_with_id',

  'POST /': {
    controller: 'auth',
    action: "AttemptLogin"
  },
  
  'POST /updateSocketId': {
    controller: 'users',
    action: "updateSocketId"
  },  

  'POST /register': {
    controller: 'users',
    action: "create"
  },
  
  /* Forgot Password */
  'get /scan-to-forgot-password': {
    controller: 'users',
    action: "scantoforgotPassword"
  },

  'get /forgot-password': {
    controller: 'users',
    action: "forgotPassword"
  },
  
  'POST /forgot-password': {
    controller: 'users',
    action: "postForgotPassword"
  },
  
  'get /change-password': {
    controller: 'users',
    action: "changePassword"
  },
  
  'POST /change-password-after-login': {
    controller: 'users',
    action: "ChangePasswordAfterLogin"
  },
  
  'POST /change-password': {
    controller: 'users',
    action: "postChangePassword"
  },
  
  /* Referral Screen */
  'get /referral': {
    controller: 'referral',
    action: "getReferral"
  },
  
  'get /referral/:code': {
    controller: 'referral',
    action: "getReferral"
  },

  'POST /use-referral': {
    controller: 'referral',
    action: "useReferral"
  },
  
  'get /referral/used': {
    controller: 'referral',
    action: "getUsedReferral"
  },
  
  'GET /load_more_referral/:page_no': {
    controller: 'referral',
    action: "load_more_referral"
  },
  
  'GET /load_more_referral_second/:page_no': {
    controller: 'referral',
    action: "load_more_referral_second"
  },
  
   'GET /load_more_referral_third/:page_no': {
    controller: 'referral',
    action: "load_more_referral_third"
  },

  /* My Wallet */
  'GET /wallet':{
    controller: 'users',
    action: "mywallet"
  },
  
  /* Import connection */
  'get /import-from-mail': {
    controller: 'connection',
    action: "importFromMail"
  },

  'POST /import-connection-found': {
    controller: 'connection',
    action: "importFromMailFound"
  },

  'get /import-connection-found': {
    controller: 'connection',
    action: "importFromMailFound"
  },

  'POST /import-connection-not-found': {
    controller: 'connection',
    action: "importFromMailNotFound"
  },

  'get /import-connection-not-found': {
    controller: 'connection',
    action: "importFromMailNotFound"
  },

  'POST /sendinvitation': {
    controller: 'connection',
    action: "sendinvitation"
  },

  'POST /bulkSendRequest': {
    controller: 'connection',
    action: "bulkSendRequest"
  },

  'get /thank-you': {
    controller: 'connection',
    action: "importThankYou"
  },
  
  /* Send request */
  'POST /sendRequest': {
    controller: 'userConnection',
    action: "send"
  },

  'get /cancelsentRequest/:to_user_id': {
    controller: 'userConnection',
    action: "cancel",
  },

  'get /rejectRequest/:user_id': {
    controller: 'userConnection',
    action: "reject",
  },

  'get /acceptRequest/:user_id': {
    controller: 'userConnection',
    action: "accept",
  },

  'GET /connections': {
    controller: 'connection',
    action: "default"
  },

  'GET /load_more_request/:page_no': {
    controller: 'connection',
    action: "load_more_request"
  },

  'POST /load_more_request': {
    controller: 'connection',
    action: "load_more_request"
  },

  'GET /load_more_sent/:page_no': {
    controller: 'connection',
    action: "load_more_sent"
  },

  'POST /load_more_sent': {
    controller: 'connection',
    action: "load_more_sent"
  },

  'GET /load_more_invitation/:page_no': {
    controller: 'connection',
    action: "load_more_invitation"
  },

  'GET /connections/list': {
    controller: 'connection',
    action: "list"
  },

  'GET /connections/list/:slug': {
    controller: 'connection',
    action: "findConnectionbySlug"
  },

  'POST /searchmyconnection': {
    controller: 'connection',
    action: "searchmyconnection"
  },

  /* Feed */
  'POST /createFeed': {
    controller: 'feeds',
    action: "create"
  },

  'POST /feedspams': {
    controller: 'feeds',
    action: "createfeedspams"
  },

  'POST /UpdateFeed': {
    controller: 'feeds',
    action: "update"
  },

  'POST /uploadFiles': {
    controller: 'feeds',
    action: "uploadFiles"
  },

  'GET /getfeeddata/:id': {
    controller: 'feeds',
    action: "getfeeddata"
  },

  'POST /deleteFeedmedia': {
    controller: 'feeds',
    action: "deleteFeedmedia"
  },

  'GET /post/:id': {
    controller: 'feeds',
    action: "feedDetails"
  },

  'GET /deleteFeed/:id': {
    controller: 'feeds',
    action: "delete"
  },

  'GET /getjjobcompanyname/:id': {
    controller: 'feeds',
    action: "getjjobcompanyname"
  },

  /* Feed Comment */
  'POST /updateComment': {
    controller: 'feedComment',
    action: "updateComment"
  },

  'POST /feedComment': {
    controller: 'feedComment',
    action: "create"
  },

  'GET /deleteComment/:id': {
    controller: 'feedComment',
    action: "deleteComment"
  },

  'POST /like/:feed_id/:status': {
    controller: 'feedlike',
    action: "like",
  },

  'POST /likecomment/:feed_id/:comment_id/:status': {
    controller: 'feedlike',
    action: "likecomment",
  },

  'GET /help': {
    controller: 'pages',
    action: "help"
  },

  'GET /helps/list': {
    controller: 'helps',
    action: "list"
  },

  'GET /helps/edit/:id': {
    controller: 'helps',
    action: "edit"
  },

  'POST /helps/edit/:id': {
    controller: 'helps',
    action: "update"
  },

  'GET /helps/create': {
    controller: 'helps',
    action: "create"
  },

  'POST /helps/create': {
    controller: 'helps',
    action: "store"
  },

  'GET /terms-and-conditions': {
    controller: 'pages',
    action: "terms_and_conditions"
  },

  'GET /privacy-policy': {
    controller: 'pages',
    action: "privacy_policy"
  },

  'GET /user-agreement': {
    controller: 'pages',
    action: "user_agreement"
  },

  'GET /faq': {
    controller: 'pages',
    action: "faq"
  },

  'GET /rewards': {
    controller: 'pages',
    action: "rewards"
  },

  'GET /about-us': {
    controller: 'pages',
    action: "about_us"
  },

  'GET /contact-us': {
    controller: 'pages',
    action: "contact_us"
  },

  'GET /cookie-policy': {
    controller: 'pages',
    action: "cookie_policy"
  },

  'GET /business-solutions': {
    controller: 'pages',
    action: "business_solutions"
  },

  'GET /awards': {
    controller: 'pages',
    action: "awards"
  },

  'GET /inauguration': {
    controller: 'pages',
    action: "inauguration"
  },

  'GET /refer-a-friend': {
    controller: 'pages',
    action: "refer"
  },

  'POST /refer-a-friend': {
    controller: 'pages',
    action: "referAfriend"
  },

  'GET /partners': {
    controller: 'pages',
    action: "partners"
  },

  'GET /job-posting': {
    controller: 'pages',
    action: "jobs"
  },

  /* Company Related Routes */
  'GET /company/signup': {
    controller: 'companies',
    action: "register"
  },

  'GET /profile/administration': {
    controller: 'companies',
    action: "useradministration"
  },

  'POST /profile/searchUsers': {
    controller: 'users',
    action: "searchUsers"
  },

  'POST /addorganization': {
    controller: 'companies',
    action: "addorganization"
  },

  'POST /linkOrganization': {
    controller: 'companies',
    action: "linkOrganization"
  },

  'POST /swipeuser': {
    controller: 'users',
    action: "swipeuser"
  },

  'POST /switchuser': {
    controller: 'users',
    action: "switchuser"
  },

  'POST /job-posting/register': {
    controller: 'companies',
    action: "create"
  },

  'POST /job-posting/edit': {
    controller: 'companies',
    action: "update"
  },
  
  'GET /company/authorized': {
    controller: 'follow',
    action: "authorizedFollower"
  },
  
  'POST /company/lordMoreFollowList': {
    controller: 'follow',
    action: "lordMoreFollowList"
  },
  
  'POST /company/lordMoreAuthorizedList': {
    controller: 'follow',
    action: "lordMoreAuthorizedList"
  },

  'GET /company/acceptauthorized/:id': {
    controller: 'follow',
    action: "acceptauthorized"
  },

  'GET /company/rejectauthorized/:id': {
    controller: 'follow',
    action: "rejectauthorized"
  },

  'GET /company/:slug': {
    controller: 'companies',
    action: "details",
  },

  'GET /company/:slug/:type': {
    controller: 'companies',
    action: "details",
  },

  'GET /dev-test': {
    controller: 'auth',
    action: "testdata"
  },

  'POST /fetch_url': {
    controller: 'auth',
    action: "fetch_url"
  },

  'GET /profile': {
    controller: 'users',
    action: "profile"
  },
  
  'GET /profile/edit': {
    controller: 'users',
    action: "edit"
  },
  
  'GET /profile/savepdf/:id': {
    controller: 'users',
    action: "savepdf"
  },
  
  'POST /profile/updateprofile': {
    controller: 'users',
    action: "editprofile"
  },

  'POST /getstates': {
    controller: 'users',
    action: "getstates"
  },

  'POST /getcities': {
    controller: 'users',
    action: "getcities"
  },
  
  'POST /update_profile_cover': {
    controller: 'users',
    action: "updateProfileCover"
  },

  'POST /update_profile_image': {
    controller: 'users',
    action: "updateProfileImage"
  },

  'POST /store_education': {
    controller: 'userprofile',
    action: "CreateEducation"
  },

  'POST /update_education': {
    controller: 'userprofile',
    action: "UpdateEducation"
  },
  
  'GET /get_one_education/:id': {
    controller: 'userprofile',
    action: "getOneEducation"
  },
  
  'GET /delete_education/:id': {
    controller: 'userprofile',
    action: "deleteEducation"
  },
  
 'POST /store_project': {
    controller: 'userprofile', 
    action: "addProject"
  },

  'POST /update_project': {
    controller: 'userprofile',
    action: "updateProject"
  },
  
  'GET /get_one_project/:id': {
    controller: 'userprofile',
    action: "getOneProject"
  },

  'GET /delete_project/:id': {
    controller: 'userprofile',
    action: "deleteProject"
  },
  
  'POST /store_experience': {
    controller: 'userprofile',
    action: "addExperience"
  },

  'POST /update_experience': {
    controller: 'userprofile',
    action: "updateExperience"
  },

  'GET /get_one_experience/:id': {
    controller: 'userprofile',
    action: "getOneExperience"
  },

  'GET /delete_experience/:id': {
    controller: 'userprofile',
    action: "deleteExperience"
  },
  
  'POST /store_social': {
    controller: 'userprofile',
    action: "addSocial"
  },  

  /****** RECOMMENDATION ******/
  'POST /sent_recommendation': {
    controller: 'userprofile',
    action: "sentRecommendation"
  },
 
  'GET /decline_recommendation/:id': {
    controller: 'userprofile',
    action: "DeclineRecommendation"
  },

  'POST /accept_recommendation': {
    controller: 'userprofile',
    action: "AcceptRecommendation"
  },

  'GET /hide_recommendation/:id': {
    controller: 'userprofile',
    action: "HideRecommendation"
  },

  /* Follow unfollow company */
  'GET /followCompany/:company_id': {
    controller: 'follow',
    action: "followUnfollow"
  },

  'GET /myfollowers': {
    controller: 'follow',
    action: "myfollowers"
  },
 
 'GET /load_more_follows': {
    controller: 'follow',
    action: "load_more_follows"
  },

  'GET /search/:keyword':{
    controller: 'search',
    action: "index"
  },

  'POST /load_more_searchusers':{
    controller: 'search',
    action: "load_more_searchusers"
  },

  'POST /load_more_searchcompanies':{
    controller: 'search',
    action: "load_more_searchcompanies"
  },

  'POST /load_more_searchblogs':{
    controller: 'search',
    action: "load_more_searchblogs"
  },

  'POST /load_more_jobs':{
    controller: 'search',
    action: "load_more_jobs"
  },

  'GET /profile/privacy': {
    controller: 'userprofile',
    action: "privacySetting"
  },

  'GET /profile/:slug': {
    controller: 'users',
    action: "findUserBySlug"
  },
  
  'GET /profile/:slug/:type': {
    controller: 'users',
    action: "findUserBySlug"
  },
  
  'POST /store_privacy_setting': {
    controller: 'userprofile',
    action: "StorePrivacySetting"
  },

  'GET /remove_profile_image/:id': {
    controller: 'userprofile',
    action: "RemoveProfileImage"
  },

  'GET /remove_cover_image/:id': {
    controller: 'userprofile',
    action: "RemoveCoverImage"
  },

  /* Blogs */

  'GET /blogs':{
    controller: 'blogs',
    action: "index"
  },

  'GET /blogs/create':{
    controller: 'blogs',
    action: "create"
  },

  'GET /blogs/edit/:id':{
    controller: 'blogs',
    action: "edit"
  },

  'POST /blogs/fileupload':{
    controller: 'blogs',
    action: "uploadFiles"
  },

  'POST /blogs/update':{
    controller: 'blogs',
    action: "update"
  },

  'POST /wysiwygUpload':{
    controller: 'blogs',
    action: "wysiwygUpload"
  },

  'GET /blogs/delete/:id':{
    controller: 'blogs',
    action: "delete"
  },

  'POST /blogs/create':{
    controller: 'blogs',
    action: "store"
  },
  
  'GET /blogs/myblogs':{
    controller: 'blogs',
    action: "myblogs"
  },

  'GET /blogs/:slug':{
    controller: 'blogs',
    action: "details"
  },

  'GET /load_more_blog/:page_no/:type':{
    controller: 'blogs',
    action: "load_more_blog"
  },

  /* Groups */

  'GET /group':{
    controller: 'groups',
    action: "index"
  },

  'GET /group/create':{
    controller: 'groups',
    action: "create"
  },

  'POST /group/create':{
    controller: 'groups',
    action: "store"
  },

  'GET /group/discover':{
    controller: 'groups',
    action: "discover"
  },

  'GET /group/:slug':{
    controller: 'groups',
    action: "details"
  },

  'GET /leftgroup/:group_id':{
    controller: 'groups',
    action: "leftgroup"
  },

  'GET /joingroup/:group_id':{
    controller: 'groups',
    action: "joingroup"
  },

  /*  Poll Routes */

  'GET /polls':{
    controller: 'poll',
    action: "index"
  },

  'GET /polls/create':{
    controller: 'poll',
    action: "create"
  },


  'POST /polls/create':{
    controller: 'poll',
    action: "store"
  },

  'GET /pollanswer/:feed_id/:option_id':{
    controller: 'poll',
    action: "pollanswer"
  },

  'GET /polls/delete/:id':{
    controller: 'poll',
    action: "delete"
  },

  'GET /polls/edit/:id':{
    controller: 'poll',
    action: "edit"
  },

  'POST /polls/edit/:id':{
    controller: 'poll',
    action: "update"
  },

  'GET /load_more_poll/:page_no': {
    controller: 'poll',
    action: "load_more_poll"
  },

  
  /*  Event Routes */

  'GET /events':{
    controller: 'event',
    action: "index"
  },

  'GET /event/create':{
    controller: 'event',
    action: "create"
  },

  'POST /event/create':{
    controller: 'event',
    action: "store"
  },

  'GET /load_more_event/:page_no': {
    controller: 'event',
    action: "load_more_event"
  },

  'GET /event/edit/:id':{
    controller: 'event',
    action: "edit"
  },

  'GET /event/delete/:id':{
    controller: 'event',
    action: "delete"
  },

  'POST /event/edit/:id':{
    controller: 'event',
    action: "update"
  },

  'GET /event/:slug':{
    controller: 'event',
    action: "details"
  },

  /* Notifications */

  'GET /notifications':{
    controller: 'notifications',
    action: "list"
  },
  
  'POST /load_more_notification':{
    controller: 'notifications',
    action: "load_more_notification"
  },
  
  'GET /unreadNotificationCount':{
    controller: 'notifications',
    action: "unreadNotificationCount"
  },
  

  /* Messages*/

  'GET /messages':{
    controller: 'messages',
    action: "index"
  },
  'GET /messages/:slug':{
    controller: 'messages',
    action: "index"
  },

  'POST /getconversion':{
    controller: 'messages',
    action: "getconversion"
  },
  'POST /messages_send':{
    controller: 'messages',
    action: "create"
  },
  '/message_user':{
    controller: 'users',
    action: "message_user"
  },
  'POST /read_message':{
    controller: 'messages',
    action: "read_message"
  },
  'GET /getUnreadmessage':{
    controller: 'messages',
    action: "getUnreadmessage"
  },

  /* Apply job */
  'POST /applyjob':{
    controller: 'applyjob',
    action: "apply"
  },

  'GET /deleteAppliedJob/:id':{
    controller: 'applyjob',
    action: "delete"
  },

  /* Block Users*/

  '/blockuser/:to_user_id':{
    controller: 'BlockUser',
    action: "bloguser"
  },

  '/unblockuser/:id':{
    controller: 'BlockUser',
    action: "unblockuser"
  },

  '/connection/blocklist':{
    controller: 'BlockUser',
    action: "list"
  },

  '/close-account':{
    controller: 'users',
    action: "closeAccount"
  },

  'POST /closeMyAccount':{
    controller: 'users',
    action: "closeMyAccount"
  },
  'POST /user_is_block':{
    controller: 'BlockUser',
    action: "user_is_block"
  },



  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'GET /api/token':{
    controller: 'api/auth',
    action: "token"
  },
  'POST /api/loginUser':{
    controller: 'api/auth',
    action: "loginUser"
  },
  'POST /api/createGuestUser':{
    controller: 'api/auth',
    action: "createGuestUser"
  },
  'POST /api/getProfile':{
    controller: 'api/users',
    action: "getProfile"
  },
  'POST /api/logout':{
    controller: 'api/auth',
    action: "logout"
  },
  'POST /api/getUserEditMaster' : {
    controller: 'api/users',
    action: "getUserEditMaster"
  },
  'POST /api/addEducation' : {
    controller: 'api/users',
    action: "addEducation"
  },
  'POST /api/updateEducation' : {
    controller: 'api/users',
    action: "updateEducation"
  },
  'POST /api/deleteEducation' : {
    controller: 'api/users',
    action: "deleteEducation"
  },
  'POST /api/addExperience' : {
    controller: 'api/users',
    action: "addExperience"
  },
  'POST /api/updateExperience' : {
    controller: 'api/users',
    action: "updateExperience"
  },
  'POST /api/deleteExperience' : {
    controller: 'api/users',
    action: "deleteExperience"
  },
  'POST /api/addProject' : {
    controller: 'api/users',
    action: "addProject"
  },
  'POST /api/updateProject' : {
    controller: 'api/users',
    action: "updateProject"
  },
  'POST /api/deleteProject' : {
    controller: 'api/users',
    action: "deleteProject"
  },
  'GET /api/getSocialsList' : {
    controller: 'api/users',
    action: "getSocialsList"
  },
  'POST /api/addSocial' : {
    controller: 'api/users',
    action: "addSocial"
  },
  'POST /api/profileUpdate' : {
    controller: 'api/users',
    action: "profileUpdate"
  },
  'POST /api/checkLoginid' : {
    controller: 'api/users',
    action: "checkLoginid"
  },
  'POST /api/feedList' : {
    controller: 'api/feed',
    action: "feedList"
  },
  'POST /api/feedDetails' : {
    controller: 'api/feed',
    action: "feedDetails"
  },
  'POST /api/feedAdd' : {
    controller: 'api/feed',
    action: "feedAdd"
  },
  'POST /api/getfeeddata' : {
    controller: 'api/feed',
    action: "getfeeddata"
  },
  'POST /api/updateFeeds' : {
    controller: 'api/feed',
    action: "updateFeeds"
  },
  'POST /api/deleteFeedmedia' : {
    controller: 'api/feed',
    action: "deleteFeedmedia"
  },
  'POST /api/addComment' : {
    controller: 'api/feed',
    action: "addComment"
  },
  'POST /api/addfeedLike' : {
    controller: 'api/feed',
    action: "addfeedLike"
  },
  'POST /api/pollAnswer' : {
    controller: 'api/feed',
    action: "pollAnswer"
  },
  'POST /api/feedCommentList': {
    controller: 'api/feed',
    action: "feedCommentList",
  },
  'POST /api/addLikeOnComment' : {
    controller: 'api/feed',
    action: "addLikeOnComment"
  },
  'POST /api/peopleYouKnow' : {
    controller: 'api/users',
    action: "peopleYouKnow"
  },
  'POST /api/sendConnectionRequest' : {
    controller: 'api/users',
    action: "sendConnectionRequest"
  },
  'POST /api/cancelConnectionRequest' : {
    controller: 'api/users',
    action: "cancelConnectionRequest"
  },
  'POST /api/rejectConnectionRequest' : {
    controller: 'api/users',
    action: "rejectConnectionRequest"
  },
  'POST /api/acceptConnectionRequest' : {
    controller: 'api/users',
    action: "acceptConnectionRequest"
  },
  'POST /api/pendingReceivedInvitationList' : {
    controller: 'api/users',
    action: "pendingReceivedInvitationList"
  },
  'POST /api/pendingSentInvitationList': {
    controller: 'api/users',
    action: "pendingSentInvitationList"
  },
  'POST /api/myConnectionList' : { 
    controller: 'api/users',
    action: "myConnectionList"
  },
  'POST /api/followUnfollow' : { 
    controller: 'api/users',
    action: "followUnfollow"
  },
  'POST /api/followList' : { 
    controller: 'api/users',
    action: "followList"
  },
  'POST /api/updateProfileImage' : { 
    controller: 'api/users',
    action: "updateProfileImage"
  },
  'POST /api/updateProfileCover' : { 
    controller: 'api/users',
    action: "updateProfileCover"
  },
  'POST /api/SendEmailVerifyCode' : {
    controller: 'api/verify',
    action: "SendEmailVerifyCode"
  },
  'POST /api/SendPhoneVerifyCode' : {
    controller: 'api/verify',
    action: "SendPhoneVerifyCode"
  },
  'POST /api/VerifyPhoneOTP' : {
    controller: 'api/verify',
    action: "VerifyPhoneOTP"
  },
  'POST /api/VerifyEmailOTP' : {
    controller: 'api/verify',
    action: "VerifyEmailOTP"
  },
  'POST /api/GetVerifyRequestData' : {
    controller: 'api/verify',
    action: "GetVerifyRequestData"
  },
  'GET /api/getDocType': {
    controller: 'api/verify',
    action: "getDocType"
  },
  'POST /api/saveVerified': {
    controller: 'api/verify',
    action: "saveVerified"
  },
  'POST /api/updateVerifyRecord': {
    controller: 'api/verify',
    action: "updateVerifyRecord"
  },
  'POST /api/storeEducationForVerify': {
    controller: 'api/verify',
    action: "storeEducationForVerify"
  },
  'POST /api/storeExperienceForVerify': {
    controller: 'api/verify',
    action: "storeExperienceForVerify"
  },
  'POST /api/getVerifiedList': {
    controller: 'api/verify',
    action: "getVerifiedList"
  },
  'POST /api/getVerifiedListWithFilter': {
    controller: 'api/verify',
    action: "getVerifiedListWithFilter"
  },
  'POST /api/getOneVerifyData': {
    controller: 'api/verify',
    action: "getOneVerifyData"
  },
  'POST /api/sendVerifyDataRequest': {
    controller: 'api/verify',
    action: "sendVerifyDataRequest"
  },
  'POST /api/masterJobPostDrop' : {
    controller: 'api/job',
    action: "masterJobPostDrop"
  },
  'POST /api/saveJobPost' : {
    controller: 'api/job',
    action: "saveJobPost"
  },
  'POST /api/myJobs' : {
    controller: 'api/job',
    action: "myJobs"
  },
  'POST /api/jobApply' : {
    controller: 'api/job',
    action: "jobApply"
  },
  'POST /api/create_blog' : {
    controller: 'api/blog',
    action: "create_blog"
  },
  'POST /api/getBlogCatagory' : {
    controller: 'api/blog',
    action: "getBlogCatagory"
  },
  'POST /api/blogList' : {
    controller: 'api/blog',
    action: "blogList"
  },
  'POST /api/myBlogList' : {
    controller: 'api/blog',
    action: "myBlogList"
  },
  'POST /api/jobsList' : {
    controller: 'api/job',
    action: "jobsList"
  },
  'GET /api/getUserPrivacy' : {
    controller: 'api/privacy',
    action: "getUserPrivacy"
  },
  'POST /api/StorePrivacySetting' : {
    controller: 'api/privacy',
    action: "StorePrivacySetting"
  },
  'POST /api/dataVerify' : {
    controller: 'api/verify',
    action: "dataVerify"
  },
  'POST /api/sendDataAccessRequest' : {
    controller: 'api/verify',
    action: "sendDataAccessRequest"
  },
  'POST /api/completeDataAccessList' : {
    controller: 'api/verify',
    action: "completeDataAccessList"
  },
  'POST /api/pendingDataAccessList' : {
    controller: 'api/verify',
    action: "pendingDataAccessList"
  },
  
  'POST /api/authorizeList' : {
    controller: 'api/verify',
    action: "authorizeList"
  },
  'POST /api/dataAccessRequestHistoryList' : {
    controller: 'api/verify',
    action: "dataAccessRequestHistoryList"
  },
  'POST /api/completedVerifyRequestList' : {
    controller: 'api/verify',
    action: "completedVerifyRequestList"
  },
  'POST /api/getOneVerifyRequestData' : {
    controller: 'api/verify',
    action: "getOneVerifyRequestData"
  },
  'POST /api/ignoreVerifyRequest' : {
    controller: 'api/verify',
    action: "ignoreVerifyRequest"
  },
  'POST /api/CancelUserVerifyRequest' : {
    controller: 'api/verify',
    action: "CancelUserVerifyRequest"
  },
  'POST /api/pendingVerifyRequestList' : {
    controller: 'api/verify',
    action: "pendingVerifyRequestList"
  },
  'POST /api/notificationCount' : {
    controller: 'api/notification',
    action: "notificationCount"
  },
  'POST /api/notificationList' : {
    controller: 'api/notification',
    action: "notificationList"
  },
  'POST /api/mastertables' : {
    controller: 'api/users',
    action: "mastertables"
  },
  'POST /api/userListForVerifyRequest' : {
    controller: 'api/users',
    action: "userListForVerifyRequest"
  },    
  'POST /api/pendingAccessDocumentRequests' : {
    controller: 'api/verify',
    action: "pendingAccessDocumentRequests"
  },
  'POST /api/completeDataAccessRequest' : {
    controller: 'api/verify',
    action: "completeDataAccessRequest"
  },
  'POST /api/deleteVerifyRecords' : {
    controller: 'api/verify',
    action: "deleteVerifyRecords"
  },
  'POST /api/companyList' : {
    controller: 'api/verify',
    action: "companyList"
  },
  'POST /api/ForgotPasswordSendOtp' : {
    controller: 'api/users',
    action: "ForgotPasswordSendOtp"
  },
  'POST /api/changePasswordWithOtp' : {
    controller: 'api/users',
    action: "changePasswordWithOtp"
  },
  'POST /api/useReferral' : {
    controller: 'api/users',
    action: "useReferral"
  },
  'POST /api/referAfriend' : {
    controller: 'api/users',
    action: "referAfriend"
  },
  'POST /api/mywallet' : {
    controller: 'api/users',
    action: "mywallet"
  },
  'POST /api/walletData' : {
    controller: 'api/users',
    action: "walletData"
  },
  'POST /api/resendRequestData' : {
    controller: 'api/verify',
    action: "resendRequestData"
  },
  'POST /api/cancelRequestData' : {
    controller: 'api/verify',
    action: "cancelRequestData"
  },
  'POST /api/AuthorizeDataPdf' : {
    controller: 'api/verify',
    action: "AuthorizeDataPdf"
  },
  'POST /api/createfeedspams' : {
    controller: 'api/feed',
    action: "createfeedspams"
  },
  'POST /api/createUser' : {
    controller: 'api/auth',
    action: "createUser"
  },
  'POST /api/authorizeAllowDeny' : {
    controller: 'api/verify',
    action: "authorizeAllowOrDeny"
  },
  'POST /api/VerifyByUser' : {
    controller: 'api/verify',
    action: "VerifyByUser"
  },
  'POST /api/verifyRequestedToUser' : {
    controller: 'api/verify',
    action: "verifyRequestedToUser"
  },
  'POST /api/messageHistory' : {
    controller: 'api/message',
    action: "messageHistory"
  },
  'POST /api/messageConversation' : {
    controller: 'api/message',
    action: "messageConversation"
  },
  'POST /api/search' : {
    controller: 'api/search',
    action: "searchRecords"
  },
  'POST /api/searchBlogs' : {
    controller: 'api/search',
    action: "searchBlogs"
  },
  'POST /api/searchJob' : {
    controller: 'api/search',
    action: "searchJob"
  },
  'POST /api/searchUsers' : {
    controller: 'api/search',
    action: "searchUsers"
  },
  'POST /api/searchCompanies' : {
    controller: 'api/search',
    action: "searchCompanies"
  },
  'POST /api/feedDelete' : {
    controller: 'api/feed',
    action: "feedDelete"
  },
  'POST /api/company_detail' : {
    controller: 'api/company',
    action: "company_detail"
  },
  'POST /api/updateComment' : {
    controller: 'api/feed',
    action: "updateComment"
  },
  'POST /api/deleteComment' : {
    controller: 'api/feed',
    action: "deleteComment"
  },
  'POST /api/getFollowesList' : {
    controller: 'api/company',
    action: "getFollowesList"
  },
  
  /* Verified routes */
  'GET /get-verified': {
  controller: 'verify',
  action: "getVerified"
  },
  
  'POST /getVerifiedList': {
    controller: 'verify',
    action: "getVerifiedList"
  },
  
  'POST /save-verified': {
	controller: 'verify',
	action: "saveVerified"
  },
  
  /*
  'GET /getVerifyData/:id': {
	controller: 'verify',
	action: "getVerifyData"
  },
  
  'GET /saveData/:data/:type':{
    controller: 'verify',
    action: "saveData"
  },
  
  'GET /sendVerifyData/:id/:verifier/:verifiername': {
	controller: 'verify',
	action: "sendVerifyData"
  },*/
  
  'GET /authenticate': {
    controller: 'verify',
    action: "GetVerifyRequestData"
  },

  'POST /authenticate/getList': {
	  controller: 'verify',
	  action: "GetVerifyRequestList"
  },
  
  'POST /authenticate/getcomplatedList': {
	  controller: 'verify',
	  action: "GetCompletedVerifyRequestList"
  },
  
  'GET /authenticate/ignore-verify-request/:id': {
	  controller: 'verify',
	  action: "IgnoreVerifyRequest"
  },

/*  'GET /getVerificationData/:id': {
	  controller: 'verify',
	  action: "getVerificationData"
  },
  
  'GET /saveVerifyData/:id/:comments': {
	controller: 'verify',
	action: "saveVerifyData"
  }, */

  'GET /comparedata/:id/:user_id': {
	controller: 'verify',
	action: "compareData"
  },
  
  'GET /verifydata/:user/:datatype/:data': {
    controller: 'verify',
    action: 'verifydata'
  },

  'GET /data-access-request': {
      controller: 'verify',
      action: 'dataAccessRequest'
  },

  'POST /resendORcancelrequestdata/:id/:type': {
    controller: 'verify',
    action: 'resendORcancelrequestdata'
  },

  'GET /authorizedatapdf/:id': {
      controller: 'verify',
      action: 'AuthorizeDataPdf'
  },
  
  'POST /store-data-access-request': {
    controller: 'verify',
    action: 'StoreDataAccessRequest'
  },

  'POST /authorize/dataAccessList': {
      controller: 'verify',
      action: 'dataAccessList'
  },
  
  'GET /authorize': {
    controller: 'verify',
    action: 'AuthorizeData'
  },

  'POST /authorize/getDataTables': {
    controller: 'verify',
    action: 'getDataTables'
  },

  'POST /authorize/allowdeny': {
    controller: 'verify',
    action: 'authorizeAllowDeny'
  },

  'GET /scan-to-get-verified': {
    controller: 'verify',
    action: 'scantoGetVerified'
  },
  
  'GET /data-access-report': {
	view: 'verification/data-access-report'
  },
  
  'GET /compare-data': {
	view: 'verification/compare-data'
  },
  

  'POST /send_email_verify_code': {
    controller: 'verify',
    action: 'SendEmailVerifyCode'
  },

  'POST /send_phone_verify_code': {
    controller: 'verify',
    action: 'SendPhoneVerifyCode'
  },

  'POST /verify_phone_otp': {
    controller: 'verify',
    action: 'VerifyPhoneOTP'
  },

  'GET /verify_email_otp/:otp': {
    controller: 'verify',
    action: 'VerifyEmailByLink'
  },

   'POST /verify-email': {
    controller: 'verify',
    action: 'VerifyEmailOTP'
  },

  'POST /store_education_for_verify': {
    controller: 'verify',
    action: "storeEducationForVerify"
    },
  
  'POST /store_experience_for_verify': {
    controller: 'verify',
    action: "storeExperienceForVerify"
    },
  
  'GET /one_one_verify_data/:id': {
    controller: 'verify',
    action: "getOneVerifyData"
    },
  
  'POST /store_user_verify_request': {
    controller: 'verify',
    action: "StoreUserVerifyDataRequest"
    },
  
  'GET /cancel_verify_request/:id': {
    controller: 'verify',
    action: "CancelUserVerifyRequest"
    },
  
  'GET /get-one-verify-request-data/:id': {
      controller: 'verify',
      action: "getOneVerifyRequestData"
    },
  
  /* 'GET /test-blockchain': {
      controller: 'verify',
      action: "testBlock"
  }, */

  'POST /verify-request-blockchain': {
      controller: 'verify',
      action: "verifyRequestByBlockchain"
  },

  /* job route */
  '/jobs':{
    controller: 'job',
    action: "jobs"
  },
  
  '/job-post':{
    controller: 'job',
    action: "postJob"
  },

  '/jobs/receivedapplication':{
    controller: 'job',
    action: "received_application"
  },

  'POST /job/book-mark' : {
    controller: 'job',
    action: "bookMark"
  },
  'GET /jobs/bookmark':{
    controller: 'job',
    action: "bookMarkedJob"
  },
  'GET /jobs/myjob':{
    controller: 'job',
    action: "myJob"
  },
  'GET /jobs/myapplication':{
    controller: 'job',
    action: "myApplication"
  },
  'GET /jobs/:slug':{
    controller: 'job',
    action: "jobDetail"
  },


  /* Company Team Members*/
  'POST /company-team-member':{
    controller: 'companies',
    action: "StoreTeamMembers"
  },
  /* send email invitation */
  'POST /send-email-invitation':{
    controller: 'users',
    action: "Send_Email_Invitation"
  },

  /* 'GET /education-verify-cron':{
    controller:'verify',
    action:'Education_Verify_Cron'
  },

  'GET /experience-verify-cron':{
    controller:'verify',
    action:'Experience_Verify_Cron'
  },

  'GET /project-verify-cron':{
    controller:'verify',
    action:'Project_Verify_Cron'
  } */
  
  'GET /download_document/:doc_url':{
    controller:'verify',
    action:'download_document'
  },
  
  'GET /verify-document-cron':{
    controller:'verify',
    action:'VerifyDocumentCron'
  },

  'GET /verification-history':{
    controller:'verify',
    action:'VerifyHistory'
  },

  'POST /update-verify-data':{
    controller:'verify',
    action:'UpdateVerifyRecord'
  },

  'GET /delete-verify-data/:id':{
    controller:'verify',
    action:'DeleteVerifyRecords'
  },

  'GET /notification_collection':{
    controller:'collectionUpdate',
    action:'notification_collection'
  },


  'GET /country-wise-document/:id':{
    controller:'verify',
    action:'CountryWiseDocument'
  },

  'POST /getverify/fileupload':{
    controller: 'verify',
    action: "uploadFiles"
  },


  'POST /compare-bockchain-hash': {
  controller: 'verify',
  action: "CompareBlockchainHash"
  },

  
  'GET /remove-team-member/:id':{
    controller: 'companies',
    action: "RemoveTeamMember"
  },

  'GET /get-team-member-data/:id':{
    controller: 'companies',
    action: "GetOneTeamMember"
  },

  'POST /update-team-member': {
    controller: 'companies',
    action: "UpdateTeamMembers"
  },

 
  'POST /search-jobs-ajax': {
    controller: 'job',
    action: "getJobsListAjax"
  },

  'GET /user-slug-cron':{
    controller: 'users',
    action: "UpdateUserSlug"
  },

  'GET /company-slug-cron':{
    controller: 'users',
    action: "UpdateCompanySlug"
  },

   'GET /job/edit/:id': {
    controller: 'job',
    action: "editJob"
  },

  'POST /job/update': {
    controller: 'job',
    action: "updateJob"
  },

  'GET /job/delete/:id': {
    controller: 'job',
    action: "deleteJobData"
  },

  'POST /load-more-jobs':{
    controller: 'job',
    action: "load_more_jobs"
  },

  'GET /error':{
    controller: 'pages',
    action: "errorFound"
  },

  'GET /update-user-name':{
    controller: 'userprofile',
    action: "CronUpdateUserName"
  },

   'POST /api/blockUsersList' : {
    controller: 'api/users',
    action: "getBlockUserslist"
  },

  'POST /api/unblockUser' : {
    controller: 'api/users',
    action: "unblockUser"
  },
  
 'POST /api/blockUser' : {
    controller: 'api/users',
    action: "blockUser"
  },
  
  'POST /api/closeMyAccount':{
    controller: 'api/users',
    action: "closeMyAccount"
  },

   'GET /api/closeAccountReasons':{
    controller: 'api/users',
    action: "closeAccountReasons"
  },

  'GET /api/getMySocialLinks':{
    controller: 'api/users',
    action: "getMySocialLinks"
  },
  
  'POST /api/ChangeCompanyStatus':{
    controller: 'api/company',
    action: "ChangeCompanyStatus"
  },
  
  'GET /devloginonly':{
	controller: 'auth',
	action: "devloginonly",
  },
};