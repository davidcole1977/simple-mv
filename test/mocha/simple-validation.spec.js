(function () {

  var expect = require('chai').expect,
      sinon = require('sinon'),
      libDir = process.env.LIB_DIR || 'lib/',
      modulePath = libDir + 'simple-validation',
      module = require(modulePath);

  describe('simple-validation', function () {

    describe('ValidatorList', function () {
      var validatorList,
          everyType = [
            '',
            123,
            {},
            null,
            [],
            function () {}
          ],
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
          everyThingExceptArray = [
            123,
            'foo',
            null,
            {},
            function () {}
          ],
          dummyValidatorFunction = function () {},
          anotherDummyValidatorFunction = function () {},
          validatorOptions1 = {
            name: 'foo',
            func: dummyValidatorFunction,
            message: 'bar'
          },
          storedValidator1 = {
            func: dummyValidatorFunction,
            message: 'bar'
          },
          overwriteValidatorOptions = {
            name: 'foo',
            func: anotherDummyValidatorFunction,
            message: 'foo'
          },
          storedOverwrittenValidator = {
            func: anotherDummyValidatorFunction,
            message: 'foo'
          },
          validatorOptions2 = {
            name: 'bar',
            func: anotherDummyValidatorFunction,
            message: 'foo'
          },
          storedValidator2 = {
            func: anotherDummyValidatorFunction,
            message: 'foo'
          },
          exampleValidatorList = {
            foo: dummyValidatorFunction,
            bar: anotherDummyValidatorFunction
          };

      beforeEach(function () {
        validatorList = module.create();
      });

      describe('create()', function () {
        it('sets default validators', function () {
          var newValidatorList = module.create([validatorOptions1, validatorOptions2]);
          expect(newValidatorList.validators).to.deep.equal({
            foo: storedValidator1,
            bar: storedValidator2
          });
        });

        it('throws error if argument is not an array', function () {
          everyThingExceptArray.forEach(function(variable) {
            expect(module.create.bind(null, variable)).to.throw(Error);
          });
        });

        it('throws error if a value in the argument array is not a valid validator options object', function () {
          everyType.forEach(function(variable) {
            expect(module.create.bind(null, [validatorOptions1, variable])).to.throw(Error);
          });
        });

        describe('set()', function () {
          it('sets a new validator object', function () {
            validatorList.set(validatorOptions1);
            expect(validatorList.validators.foo).to.deep.equal(storedValidator1);
          });

          it('overwrites an existing validator object', function () {
            validatorList.validators.foo = storedValidator1;
            validatorList.set(overwriteValidatorOptions);
            expect(validatorList.validators.foo).to.deep.equal(storedOverwrittenValidator);
          });

          it('throws an error when no arguments are received', function () {
            expect(validatorList.set.bind(validatorList)).to.throw(Error);
          });

          it('throws an error when argument is not a validator options-like object', function () {
            everyType.forEach(function(variable) {
              expect(validatorList.set.bind(validatorList, variable)).to.throw(Error);
            });
          });
        });

        describe('get()', function () {
          it('returns an existing validator object', function () {
            validatorList.validators.foo = storedValidator1;
            expect(validatorList.get('foo')).to.equal(storedValidator1);
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
            validatorList = module.create([
              validatorOptions1,
              validatorOptions2
            ]);
          });

          describe('remove()', function () {
            it('removes one of the list of previously set validators', function () {
              validatorList.remove('bar');
              expect(validatorList.validators).to.deep.equal({foo: storedValidator1});
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
                foo: storedValidator1,
                bar: storedValidator2
              });
            });
          });

        });

      });

    });

  });

})();
