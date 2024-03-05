```javascript
describe("fsaPreBuilt", function () {
  beforeEach(module("fsaPreBuilt"));
  beforeEach(module("$$UpgradeModule"));

  var $controller, $rootScope, $scope, $httpBackend, AuthService, Session, AUTH_EVENTS;

  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_, _AuthService_, _Session_, _AUTH_EVENTS_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    AuthService = _AuthService_;
    Session = _Session_;
    AUTH_EVENTS = _AUTH_EVENTS_;
  }));

  describe("AuthService", function () {
    it("should broadcast loginSuccess on successful login", function () {
      var credentials = { username: 'test', password: 'pass' };
      var response = { data: { id: 1, user: { username: 'test', password: 'pass' } } };

      $httpBackend.expectPOST('/login', credentials).respond(200, response);
      sinon.spy($rootScope, '$broadcast');

      AuthService.login(credentials);
      $httpBackend.flush();

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.loginSuccess);
      expect(Session.user).to.equal(response.data.user);

      $rootScope.$broadcast.restore();
    });

    it("should reject with a message on invalid login credentials", function (done) {
      var credentials = { username: 'wrong', password: 'credentials' };
      $httpBackend.expectPOST('/login', credentials).respond(401, { message: 'Invalid login credentials.' });

      AuthService.login(credentials).catch(function (error) {
        expect(error.message).to.equal('Invalid login credentials.');
        done();
      });

      $httpBackend.flush();
    });

    it("should broadcast logoutSuccess on successful logout", function () {
      $httpBackend.expectGET('/logout').respond(200);
      sinon.spy($rootScope, '$broadcast');

      AuthService.logout();
      $httpBackend.flush();

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.logoutSuccess);
      expect(Session.id).to.be.null;
      expect(Session.user).to.be.null;

      $rootScope.$broadcast.restore();
    });
  });

  describe("Session", function () {
    it("should create a session with a user", function () {
      var sessionId = 1;
      var user = { username: 'test', password: 'pass' };

      Session.create(sessionId, user);

      expect(Session.id).to.equal(sessionId);
      expect(Session.user).to.equal(user);
    });

    it("should destroy the session", function () {
      var sessionId = 1;
      var user = { username: 'test', password: 'pass' };

      Session.create(sessionId, user);
      Session.destroy();

      expect(Session.id).to.be.null;
      expect(Session.user).to.be.null;
    });
  });

  describe("AuthInterceptor", function () {
    var AuthInterceptor, responseError;

    beforeEach(inject(function (_AuthInterceptor_) {
      AuthInterceptor = _AuthInterceptor_;
      responseError = {
        status: 401,
        config: {},
        statusText: 'Unauthorized'
      };
    }));

    it("should broadcast notAuthenticated on 401 response status", function () {
      sinon.spy($rootScope, '$broadcast');

      AuthInterceptor.responseError(responseError);

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.notAuthenticated, responseError);

      $rootScope.$broadcast.restore();
    });
  });
});
```