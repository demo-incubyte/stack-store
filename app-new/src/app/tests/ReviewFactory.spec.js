describe("ReviewFactory", function () {
  beforeEach(module("FullstackGeneratedApp"));
  beforeEach(module("$$UpgradeModule"));

  var ReviewFactory, $httpBackend, $rootScope;

  beforeEach(inject(function (_ReviewFactory_, _$httpBackend_, _$rootScope_) {
    ReviewFactory = _ReviewFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  describe("initialization", function () {
    it("should have a getOneDreamReviews function", function () {
      expect(typeof ReviewFactory.getOneDreamReviews).toBe("function");
    });

    it("should have an addReview function", function () {
      expect(typeof ReviewFactory.addReview).toBe("function");
    });
  });

  describe("getOneDreamReviews", function () {
    it("should retrieve reviews for a specific dream", function () {
      var dreamId = 1;
      var mockReviews = [{ id: 1, comment: "Great dream!" }];
      $httpBackend.expectGET("/api/dreams/" + dreamId + "/reviews").respond(mockReviews);

      var reviews;
      ReviewFactory.getOneDreamReviews(dreamId).then(function (data) {
        reviews = data;
      });
      $httpBackend.flush();

      expect(reviews).toEqual(mockReviews);
    });
  });

  describe("addReview", function () {
    it("should add a review for a specific dream", function () {
      var review = { dreamId: 1, userId: 2, comment: "Loved it!" };
      $httpBackend.expectPOST("/api/dreams/" + review.dreamId + "/reviews", review, function (headers) {
        return headers.user === review.userId.toString();
      }).respond(201, review);

      var promise = ReviewFactory.addReview(review);
      $httpBackend.flush();

      promise.then(function (response) {
        expect(response.status).toBe(201);
      }).catch(function () {
        fail("The request should not be rejected");
      });
    });

    it("should handle errors when adding a review fails", function () {
      var review = { dreamId: 1, userId: 2, comment: "Loved it!" };
      $httpBackend.expectPOST("/api/dreams/" + review.dreamId + "/reviews", review).respond(500);

      var promise = ReviewFactory.addReview(review);
      $httpBackend.flush();

      promise.then(function () {
        fail("The request should be rejected");
      }).catch(function (error) {
        expect(error.status).toBe(500);
      });
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});