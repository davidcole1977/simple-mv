(function () {

  var expect = require('chai').expect,
      _ = require('lodash'),
      sinon = require('sinon'),
      libDir = process.env.LIB_DIR || 'lib/',
      modulePath = libDir + 'simple-mv',
      mv = require(modulePath);

  describe('simple-mv', function () {

    describe('Model', function () {

      it('exists', function () {
        expect(mv.Model).to.exist;
      });

      describe('static methods', function () {

        describe('isValidatorLike', function () {
          var isValidatorLike, validatorLikeObject, differentKeyNames, differentKeyTypes;

          isValidatorLike = mv.Model.isValidatorLike;

          validatorLikeObject = {
            name: 'foo',
            validator: function () {}
          };
          differentKeyNames = {
            shame: 'foo',
            schmalidator: function () {}
          };
          differentKeyTypes = {
            name: [1,2,3],
            validator: 999
          };

          it('returns true for an object in the form {name: (string), validator: (function)', function () {
            expect(isValidatorLike(validatorLikeObject)).to.be.true;
          });

          it('returns false for an object with different key names', function () {
            expect(isValidatorLike(differentKeyNames)).to.be.false;
          });

          it('returns false for an object with different key types', function () {
            expect(isValidatorLike(differentKeyTypes)).to.be.false;
          });

        });

        describe('extend()', function () {

          describe('extend() options', function () {

            xit('calling with no options returns a constructor that inherits from Model', function () {

            });

          });

        });

      });

      describe('prototype methods', function () {
        var model;

        beforeEach(function () {
          model = new mv.Model();
        });

        describe('get()', function () {

          it('gets the value of a simple string data attribute', function () {
            model.data.foo = {value: 'bar'};
            expect(model.get('foo')).to.equal('bar');
          });

          it('throws an error if no arguments are received', function () {
            expect(model.get.bind(model)).to.throw(Error);
          });

          it('throws an error if the first argument is a number (not a string)', function () {
            expect(model.get.bind(model, 200)).to.throw(Error);
          });

          it('throws an error if the key doesn\'t exist in data', function () {
            expect(model.get.bind(model, 'foo')).to.throw(Error);
          });
          
        });

        describe('set()', function () {

          it('sets the value of a simple string data attribute', function () {
            model.set('foo', 'bar');
            expect(model.data.foo.value).to.equal('bar');
          });

          it('throws an error if the number of arguments is less than two', function () {
            expect(model.set.bind(model)).to.throw(Error);
            expect(model.set.bind(model, 'fee')).to.throw(Error);
          });

          it('throws an error if the first argument is a number (not a string)', function () {
            expect(model.set.bind(model, 200)).to.throw(Error);
          });

        });

        describe('delete()', function () {

          it('deletes a simple string data attribute', function () {
            model.data.foo = {value: 'bar'};
            model.delete('foo');
            expect(model.data.foo).to.be.undefined;
          }); 

          it('throws an error if no arguments are received', function () {
            expect(model.delete.bind(model)).to.throw(Error);
          });

          it('throws an error if the first argument is a number (not a string)', function () {
            expect(model.delete.bind(model, 999)).to.throw(Error);
          });

          it('fails silently if attribute to be deleted does not exist', function () {
            expect(model.delete.bind(model, 'fubar')).to.not.throw(Error);
          });
          
        });

        describe('addValidators()', function () {
          var singleValidatorObject = {
                name: 'foo',
                validator: function () {}
              };

          xit('adds a single validator ', function () {

          });

          xit('adds multiple validators', function () {

          });

          it('throws an error if less than two arguments are received', function () {
            expect(model.addValidators.bind(model)).to.throw(Error);
            expect(model.addValidators.bind(model, 'foo')).to.throw(Error);
          });

          it('throws an error if the first argument is not a string', function () {
            expect(model.addValidators.bind(model, 999, singleValidatorObject)).to.throw(Error);
            expect(model.addValidators.bind(model, {}, singleValidatorObject)).to.throw(Error);
            expect(model.addValidators.bind(model, [1,2,3], singleValidatorObject)).to.throw(Error);
            expect(model.addValidators.bind(model, function(){}, singleValidatorObject)).to.throw(Error);
          });

          it('throws an error if the second argument is not an validator-like object or an array of validator-like objects', function () {
            expect(model.addValidators.bind(model, 'foo', {name: 999, validator: 'bar'})).to.throw(Error);
            expect(model.addValidators.bind(model, 'foo', 999)).to.throw(Error);
            expect(model.addValidators.bind(model, 'foo', [1,2,3])).to.throw(Error);
          });

          it('throws an error if the key doesn\'t exist in data', function () {
            expect(model.addValidators.bind(model, 'doesNotExist', singleValidatorObject)).to.throw(Error);
          });

        });

        // describe('isValid()', function () {

        // });

        // describe('initialise', function () {

        // });

        // describe('save', function () {

        // });

        // describe('fetch', function () {

        // });



      });

    });

  });

})();
