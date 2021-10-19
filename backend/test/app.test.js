let expect = require("chai").expect;
let request = require("request");

// Test that status and content returns correctly
describe("Status and content returns correctly", function () {
  // Portal page
  describe("'/portal' (Portal page)", function () {
    beforeEach(function (done) {
      this.timeout(10000);
      setTimeout(done, 2500);
    });

    // Token belongs to the username "test"
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJ1c2VyUm9sZXMiOnsiYWRtaW4iOmZhbHNlLCJtYW5hZ2VtZW50IjpmYWxzZSwibm9ybWFsIjp0cnVlfSwiYWNjZXNzIjpbeyJ1bml0IjoiSGFyZHdhcmUgcmV2aWV3cyIsImRpdmlzaW9ucyI6WyJBZG1pbmlzdHJhdGlvbiJdLCJfaWQiOiI2MTY4ODhiZDA4NWQ5ZmMzNTY1ZTllYzgifV19.Ud9IySFnZ3tHzEiEd03zQC827EDkI6eLGY_SJNfLeQU";

    // Status should return 200
    it("status", function (done) {
      request.get("http://localhost:8080/portal", {
          "auth": {
            "bearer": token
          }
        })
        .on("response", function (response) {
          expect(response.statusCode).to.equal(200);
        });
      done();
    });

    // Should return the organisational unit that the user has access to
    it("content", function (done) {
      request({
        method: "GET",
        uri: "http://localhost:8080/all-repositories",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }, function (error, response, body) {
        const result = JSON.parse(body);

        // Retrieve the organisational unit
        const unit = result[0]["unit"];
        expect(unit).to.equal("Hardware reviews");
        done();
      });
    });
  });
});