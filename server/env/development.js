module.exports = {
  DATABASE_URI: "postgres://postgres:pass@localhost:5432/fsg",
  SESSION_SECRET: "Optimus Prime is my real dad",
  TWITTER: {
    consumerKey: "INSERT_TWITTER_CONSUMER_KEY_HERE",
    consumerSecret: "INSERT_TWITTER_CONSUMER_SECRET_HERE",
    callbackUrl: "INSERT_TWITTER_CALLBACK_HERE",
  },
  FACEBOOK: {
    clientID: "INSERT_FACEBOOK_CLIENTID_HERE",
    clientSecret: "INSERT_FACEBOOK_CLIENT_SECRET_HERE",
    callbackURL: "INSERT_FACEBOOK_CALLBACK_HERE",
  },
  GOOGLE: {
    clientID:
      "835524316110-vomeom3l2j1nl51mmtat36eqh9q3kqre.apps.googleusercontent.com",
    clientSecret: "Wf5uUMSExMklPWzeOyzM-BRd",
    callbackURL: "http://127.0.0.1:1337/auth/google/callback",
  },
};
