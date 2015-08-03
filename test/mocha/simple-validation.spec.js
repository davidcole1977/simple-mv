(function () {

  var expect = require('chai').expect,
      sinon = require('sinon'),
      libDir = process.env.LIB_DIR || 'lib/',
      modulePath = libDir + 'simple-validation',
      module = require(modulePath);

  describe('simple-validation', function () {

    describe('ValidatorList', function () {
      var validatorList,
          everyThingExceptString = [
            123,
            {},
            null,
            [],
            function () {}
          ],
          everyThingExceptFunction = [
            123,
            'foo',
            {},
            null,
            []
          ],
          everyThingExceptObject = [
            123,
            'foo',
            null,
            [],
            function () {}
          ],
          dummyValidatorFunction = function () {},
          anotherDummyValidatorFunction = function () {};

      beforeEach(function () {
        validatorList = module.create();
      });

      describe('create()', function () {

        it('sets default validators', function () {
          var newValidatorList = module.create({
                foo: dummyValidatorFunction,
                bar: anotherDummyValidatorFunction
              });

          expect(newValidatorList.validators).to.deep.equal({
            foo: dummyValidatorFunction,
            bar: anotherDummyValidatorFunction
          });

        });

        it('throws error if argument is not an object', function () {
          everyThingExceptObject.forEach(function(variable) {
            expect(module.create.bind(null, variable)).to.throw(Error);
          });
        });

        it('throws error if any parameter value in the argument object is not a function', function () {
          everyThingExceptFunction.forEach(function(variable) {
            expect(module.create.bind(null, {foo: function(){}, bar: variable})).to.throw(Error);
          });
        });

        describe('set()', function () {
          it('sets a new validator function', function () {
            validatorList.set('foo', dummyValidatorFunction);
            expect(validatorList.validators.foo).to.equal(dummyValidatorFunction);
          });

          it('overwrites an existing validator function', function () {
            validatorList.validators.foo = dummyValidatorFunction;
            validatorList.set('foo', anotherDummyValidatorFunction);
            expect(validatorList.validators.foo).to.equal(anotherDummyValidatorFunction);
          });

          it('throws an error when first argument is not a string', function () {
            everyThingExceptString.forEach(function(variable) {
              expect(validatorList.set.bind(validatorList, variable, dummyValidatorFunction)).to.throw(Error);
            });
          });

          it('throws an error when first argument is a string with a length of zero', function () {
            expect(validatorList.set.bind(validatorList, '', dummyValidatorFunction)).to.throw(Error);
          });

          it('throws an error when second argument is not a function', function () {
            everyThingExceptFunction.forEach(function(variable) {
              expect(validatorList.set.bind(validatorList, 'foo', variable)).to.throw(Error);
            });
          });

          it('throws an error when fewer than two arguments are received', function () {
            expect(validatorList.set.bind(validatorList, 'foo')).to.throw(Error);
          });
        });

        describe('get()', function () {
          it('returns an existing validator function', function () {
            validatorList.validators.foo = dummyValidatorFunction;
            expect(validatorList.get('foo')).to.equal(dummyValidatorFunction);
          });

          it('returns null when requested validator doesn\'t exist', function () {
            expect(validatorList.get('foo')).to.be.null;
          });

          it('throws an error when argument is not a string', function () {
            everyThingExceptString.forEach(function(variable) {
              expect(validatorList.get.bind(validatorList, variable)).to.throw(Error);
            });
          });

          it('throws an error when argument is a string with a length of zero', function () {
            expect(validatorList.get.bind(validatorList, '')).to.throw(Error);
          });

          it('throws an error when no arguments are received', function () {
            expect(validatorList.get.bind(validatorList)).to.throw(Error);
          });
        });

        describe('method tests using multiple default validators', function () {
          beforeEach(function () {
            validatorList = module.create({
              foo: dummyValidatorFunction,
              bar: anotherDummyValidatorFunction
            });
          });

          describe('remove()', function () {
            it('removes one of the list of previously set validators', function () {
              validatorList.remove('bar');
              expect(validatorList.validators).to.deep.equal({foo: dummyValidatorFunction});
            });

            it('throws an error when argument is not a string', function () {
              everyThingExceptString.forEach(function(variable) {
                expect(validatorList.remove.bind(validatorList, variable)).to.throw(Error);
              });
            });

            it('throws an error when argument is a string with a length of zero', function () {
              expect(validatorList.remove.bind(validatorList, '')).to.throw(Error);
            });

            it('throws an error when no arguments are received', function () {
              expect(validatorList.remove.bind(validatorList)).to.throw(Error);
            });
          });

          describe('removeAll()', function () {
            it('removes all of the list of previously set validators', function () {
              validatorList.removeAll();
              expect(validatorList.validators).to.deep.equal({});
            });
          });

          describe('getAll()', function () {
            it('gets all of the list of previously set validators', function () {
              expect(validatorList.getAll()).to.deep.equal({
                foo: dummyValidatorFunction,
                bar: anotherDummyValidatorFunction
              });
            });
          });

        });

      });

    });

  });

})();
