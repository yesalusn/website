describe('officersFactory', function() {
    var svc,
        $q,
        $rootScope,
        $httpBackend,
        restUrl = '/officers',
        response;

    beforeEach(module('acmApp'));

    beforeEach(function() {
        inject(function(_$q_, _officersService_, _$rootScope_, _$httpBackend_) {
            svc = _officersService_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('service should be injected', function() {
        expect(svc).toBeDefined();
    });

    describe('getOfficers() as a function', function() {
        var promise;

        beforeEach(function() {
            spyOn(svc, 'getOfficers').and.returnValue($q.when([{ name: 'Chief Wiggum' }]));
        });

        it('should have a property for getOfficers() that returns a promise containing an array of objects', function() {
            promise = svc.getOfficers();
            $rootScope.$digest();
            promise.then(function(res) {
                expect(res).toBe([{ name: 'Chief Wiggum' }]);
            }, function(res) {
               expect(res).not.toBeDefined();
            });
        });
    })

    describe('getOfficers() as a rest call', function() {

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should make a GET call to /officers and return the promise', function() {
            $httpBackend.expectGET(restUrl).respond([{ name: 'Officer Wiggum' }]);
            promise = svc.getOfficers();
            $httpBackend.flush();
            promise.then(function(res) {
                expect(res[0].name).toBe('Officer Wiggum');
            }, function() {
                fail();
            })
        });

        it('should make a POST call to /officers when saveOfficer is called without an id set', function() {
            $httpBackend.expectPOST(restUrl).respond('success');
            var promise = svc.saveOfficer({name: "Test Officer"});
            $httpBackend.flush();
            promise.then(function(res) {
                expect(res).toBe(true);
            }), function () {
                fail();
            }
        });

        it('should make a PUT call to /officers/:id when saveOfficer is called with an _id set', function() {
            $httpBackend.expectPUT(restUrl + '/123456').respond('success');
            var promise = svc.saveOfficer({_id: "123456", name: "Test Officer"});
            $httpBackend.flush();
            promise.then(function(res) {
                expect(res).toBe(true);
            }), function () {
                fail();
            }
            
        });

    })


});
