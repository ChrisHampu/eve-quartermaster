(function() {
  var InternalOAuthError, VerificationError, constants,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  InternalOAuthError = require('passport-oauth2').InternalOAuthError;

  constants = require('./constants');

  VerificationError = require('./errors/VerificationError');

  module.exports = function(oAuth2Strategy) {
    var EveOnlineStrategy;
    EveOnlineStrategy = (function(_super) {
      __extends(EveOnlineStrategy, _super);

      function EveOnlineStrategy(options, _verifyCallback) {
        this._verifyCallback = _verifyCallback;
        if (!options || !options.callbackURL) {
          throw new TypeError('EveOnlineStrategy requires a callbackURL option');
        }
        if (options == null) {
          options = new Object();
        }
        if (options.authorizationURL == null) {
          options.authorizationURL = constants.defaultAuthorizationURL;
        }
        if (options.tokenURL == null) {
          options.tokenURL = constants.defaultTokenURL;
        }
        if (options.verifyURL == null) {
          options.verifyURL = constants.defaultVerifyURL;
        }
        this._verifyURL = options.verifyURL;
        EveOnlineStrategy.__super__.constructor.call(this, options, this._verifyOAuth2);
        this._oauth2.useAuthorizationHeaderforGET(true);
        this.name = 'eveonline';
      }

      EveOnlineStrategy.prototype.userProfile = function(accessToken, done) {
        return this._oauth2.get(this._verifyURL, accessToken, (function(_this) {
          return function(error, body, response) {
            return _this._parseCharacterInformation(error, body, response, done);
          };
        })(this));
      };

      EveOnlineStrategy.prototype._verifyOAuth2 = function(accessToken, refreshToken, characterInformation, done) {
        return this._verifyCallback(characterInformation, done);
      };

      EveOnlineStrategy.prototype._parseCharacterInformation = function(error, body, response, done) {
        var exception, responseBody;
        if (error) {
          done(new InternalOAuthError(constants.fetchCharacterInformationError, error));
        }
        try {
          responseBody = JSON.parse(body);
          if (responseBody.error) {
            return done(new VerificationError(responseBody.error, responseBody.error_description));
          }
          return done(null, responseBody);
        } catch (_error) {
          exception = _error;
          return done(exception);
        }
      };

      return EveOnlineStrategy;

    })(oAuth2Strategy);
    return EveOnlineStrategy;
  };

}).call(this);
