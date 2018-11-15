module.exports.email = {
  service: 'Zoho',
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, //ssl
  auth: {user: 'noreply@lynked.world', pass: 'Lynked.World@1q2w'},
  from: '"Lynked.World" <noreply@lynked.world>',
  testMode: false
};