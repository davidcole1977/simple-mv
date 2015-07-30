(function () {

  var expect = require('chai').expect,
      sinon = require('sinon'),
      libDir = process.env.LIB_DIR || 'lib/',
      modulePath = libDir + 'simple-validation',
      mvValidation = require(modulePath);

  describe('simple-validation', function () {

    describe('ValidatorSet', function () {
      var validatorSet,
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
          dummyValidatorFunction = function () {};

      beforeEach(function () {
        validatorSet = new mvValidation.ValidatorSet();
      });

      describe('constructor', function () {

        xit('options set default validators', function () {

        });

      });

      describe('prototype.setValidator', function () {

        xit('sets a new validator function', function () {

        });

        xit('overwrites an existing validator function', function () {

        });

        it('throws an error when first argument is not a string', function () {
          everyThingExceptString.forEach(function(variable) {
            expect(validatorSet.setValidator.bind(validatorSet, variable, dummyValidatorFunction)).to.throw(Error);
          });
        });

        it('throws an error when first argument is a string with a length of zero', function () {
          expect(validatorSet.setValidator.bind(validatorSet, '', dummyValidatorFunction)).to.throw(Error);
        });

        it('throws an error when second argument is not a function', function () {
          everyThingExceptFunction.forEach(function(variable) {
            expect(validatorSet.setValidator.bind(validatorSet, 'foo', variable)).to.throw(Error);
          });
        });

        it('throws an error when fewer than two arguments are received', function () {
          expect(validatorSet.setValidator.bind(validatorSet, 'foo')).to.throw(Error);
        });

      });

      describe('prototype.getValidator', function () {

        it('returns an existing validator function', function () {
          validatorSet.validators.foo = dummyValidatorFunction;
          expect(validatorSet.getValidator('foo')).to.equal(dummyValidatorFunction);
        });

        it('returns null when requested validator doesn\'t exist', function () {
          expect(validatorSet.getValidator('foo')).to.be.null;
        });

        it('throws an error when argument is not a string', function () {
          everyThingExceptString.forEach(function(variable) {
            expect(validatorSet.getValidator.bind(validatorSet, variable)).to.throw(Error);
          });
        });

        it('throws an error when argument is a string with a length of zero', function () {
          expect(validatorSet.getValidator.bind(validatorSet, '')).to.throw(Error);
        });

        it('throws an error when no arguments are received', function () {
          expect(validatorSet.getValidator.bind(validatorSet)).to.throw(Error);
        });

      });

    });

  });

})();
