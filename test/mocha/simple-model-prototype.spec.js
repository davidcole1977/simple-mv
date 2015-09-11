(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-model')),
      sharedListenersSpec = require('../lib/shared-listeners-spec.js')(module),
      modelValidators = require(utHelpers.getModulePath('model-validators')),
      appSubsLists = require(utHelpers.getModulePath('./app-subscriptions')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS,
      isString = function (value) { return typeof value === 'string'; },
      hasLengthOfFour = function (value) { return value.length === 4; },
      hasLengthOfFourMsg = 'the length should be four',
      isStringMsg = 'the value should be a string';

  modelValidators.set({
    name: 'isString',
    isValid: isString,
    message: isStringMsg
  });

  modelValidators.set({
    name: 'hasLengthOfFour',
    isValid: hasLengthOfFour,
    message: hasLengthOfFourMsg
  });

  describe('simple-model', function () {

    describe('eventListeners', function () {
      sharedListenersSpec.modelEventListening();
    });

    describe('prototype methods', function () {
      var model;

      beforeEach(function () {
        model = module.create();
      });

      describe('get()', function () {
        it('gets the value of a simple string data attribute', function () {
          model.data.foo = 'bar';
          expect(model.get('foo')).to.equal('bar');
        });

        it('altering a value after getting it leaves the stored version unaltered', function () {
          var datum;

          model.data.foo = {foo: 'bar'};
          datum = model.get('foo');
          datum.foo = 999;

          expect(model.get('foo')).to.deep.equal({foo: 'bar'});
        });

        it('gets nested value by keypath: value in object', function () {
          model.data.how = {
            now: {
              brown: 'cow'
            }
          };

          expect(model.get('how.now.brown')).to.equal('cow');
        });

        it('gets deeply nested value by keypath: value in shallow array', function () {
          model.data.noises = [
            'baa',
            'moo',
            'oink'
          ];

          expect(model.get('noises.2')).to.equal('oink');
        });

        it('gets deeply nested value by keypath: object within array within object', function () {
          model.data.foo = {
            bar: [
              'car',
              'far',
              {
                mar: {
                  tar: 'arr'
                }
              }
            ]
          };

          expect(model.get('foo.bar.2.mar')).to.deep.equal({tar: 'arr'});
        });

        it('throws an error if no arguments are received', function () {
          expect(model.get.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.get.bind(model, notAString)).to.throw(Error);
          });
        });

        it('throws an error if the first argument is a string with zero length', function () {
          expect(model.get.bind(model, '')).to.throw(Error);
        });

        it('throws an error if the key doesn\'t exist in data (shallow value)', function () {
          expect(model.get.bind(model, 'foo')).to.throw(Error);
        });

        it('throws an error if the key doesn\'t exist in data (deep - value within array)', function () {
          model.data.noises = [
            'baa',
            'moo',
            'oink'
          ];

          expect(model.get.bind(model, 'noises.3')).to.throw(Error);
        });

        it('throws an error if the key doesn\'t exist in data (deep - object within array within object)', function () {
          model.data.foo = {
            bar: [
              'car',
              'far',
              {
                mar: 'tar'
              }
            ]
          };

          expect(model.get.bind(model, 'foo.bar.2.nosuchparam')).to.throw(Error);
        });
      });

      describe('set()', function () {
        it('sets the value of a simple string data attribute', function () {
          model.set('foo', 'bar');
          expect(model.data.foo).to.equal('bar');
        });

        it('overrides the value of a previously set simple string data attribute', function () {
          model.set('foo', 'bar');
          model.set('foo', 'woo');
          expect(model.data.foo).to.equal('woo');
        });

        it('sets the data attribute value to null if no value argument is received', function () {
          model.set('foo');
          expect(model.data.foo).to.be.null;
        });

        it('sets deep value by keypath: value in object (shallow parameter already exists)', function () {
          model.data.foo = {};
          model.set('foo.bar', 'baz');
          expect(model.data.foo.bar).to.equal('baz');
        });

        it('sets deep value by keypath: value in object (deep parameter already exists)', function () {
          var expectedData = {
                foo: {
                  'monkey': 'ook',
                  'bar': 'baz',
                  'cow': 'moo'
                }
              };

          model.data.foo = {
            'monkey': 'ook',
            'bar': 'woo',
            'cow': 'moo'
          };
          model.set('foo.bar', 'baz');
          expect(model.data).to.deep.equal(expectedData);
        });

        it('sets deep value by keypath: value in object (no parameters exist)', function () {
          model.set('foo.bar', 'baz');
          expect(model.data.foo.bar).to.equal('baz');
        });

        it('sets deep value by keypath: value in array in object (no parameters exist)', function () {
          model.set('foo.bar.3', 'baz');
          expect(model.data.foo.bar[3]).to.equal('baz');
        });

        it('sets deep value by keypath: value in object in array in object (no parameters exist)', function () {
          model.set('foo.bar.3.woo', 'baz');
          expect(model.data.foo.bar[3].woo).to.equal('baz');
        });

        it('sets deep value by keypath: value in shallow array (parameter already exists)', function () {
          var expectedData = {
                foo: [
                  'foo',
                  'bar',
                  999,
                  'woo'
                ]
              };

          model.data.foo = [
            'foo',
            'bar',
            'baz',
            'woo'
          ];

          model.set('foo.2', 999);
          expect(model.data).to.deep.equal(expectedData);
        });

        it('sets deep value by keypath: object within array within object, leaving other pre-existing parameters unaltered (parameters already exist)', function () {
          var expectedData = {
                foo: [
                  444,
                  555,
                  {
                    boo: 'hoo',
                    woo: 'moo',
                    oops: 'boops'
                  },
                  'bar',
                  999,
                  'woo'
                ],
                bar: [
                  1,
                  2,
                  {
                    look: 'book'
                  }
                ]
              };

          model.data = {
            foo: [
              444,
              555,
              {
                boo: 'hoo',
                woo: 'coo',
                oops: 'boops'
              },
              'bar',
              999,
              'woo'
            ],
            bar: [
              1,
              2,
              {
                look: 'book'
              }
            ]
          };

          model.set('foo.2.woo', 'moo');
          expect(model.data).to.deep.equal(expectedData);
        });

        it('altering the variable originally passed as a value doesn\'t change the stored value', function () {
          var original = {foo: 'bar'};

          model.set('bar', original);
          original.foo = 1000;

          expect(model.get('bar').foo).to.equal('bar');
        });

        it('returns without updating the datum if the shallow value has not changed', function () {
          var setDeepSpy = sinon.spy(model, 'setDeep');

          model.data.foo = 'bar';
          model.set('foo', 'bar');
          
          expect(setDeepSpy.called).to.be.false;
        });

        it('returns without updating the datum if the deep value has not changed', function () {
          var setDeepSpy = sinon.spy(model, 'setDeep');

          model.data.foo = {
            bar: [
              'baa',
              'moo',
              'oink'
            ]
          };
          model.set('foo.bar.2', 'oink');
          
          expect(setDeepSpy.called).to.be.false;
        });

        xit('throws an error if trying to deep set and intermediate datum has non-array (when array is needed) or non-object (when object is needed) value', function () {

        });

        it('throws error and doesn\'t alter the stored value if validation fails', function () {
          model.assignValidator('foo', 'isString');
          model.set('foo', 'bar');
          expect(model.set.bind(model, 'foo', 999)).to.throw(Error);
          expect(model.get('foo')).to.equal('bar');
        });

        it('throws error and doesn\'t alter the stored value if validation fails on deep datum', function () {
          model.assignValidator('foo.bar.woo.hoo', 'isString');
          model.set('foo.bar.woo.hoo', 'bar');
          expect(model.set.bind(model, 'foo.bar.woo.hoo', 999)).to.throw(Error);
          expect(model.get('foo.bar.woo.hoo')).to.equal('bar');
        });

        it('throws an error if no arguments are received', function () {
          expect(model.set.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.set.bind(model, notAString)).to.throw(Error);
          });
        });

        it('throws an error if the first argument is a string with zero length', function () {
          expect(model.set.bind(model, '')).to.throw(Error);
        });

        describe('bug fixes', function () {
          it("\"model.set('foo.bar.1.woo', 'bar');\" sets deep data correctly", function () {
            var expectedData = {
                  foo: {
                    bar: [
                      null,
                      {
                        woo: 'bar'
                      }
                    ]
                  }
                };

            model.set('foo.bar.1.woo', 'bar');
            expect(model.data).to.deep.equal(expectedData);
          });

          it("\"model.set('foo.2.0.woo.1, 'bar');\" sets deep data correctly", function () {
            var expectedData = {
                  foo: [
                    null,
                    null,
                    [
                      {
                        woo: [
                          null,
                          'bar'
                        ]
                      }
                    ]
                  ]
                };

            model.set('foo.2.0.woo.1', 'bar');
            expect(model.data).to.deep.equal(expectedData);
          });
        });

      });

      describe('assignValidator()', function () {
        it('assigns a single validator object to a datum keypath', function () {
          model.assignValidator('foo', 'isString');
          expect(model.validatorsMap.foo).to.deep.equal(['isString']);
        });

        it('assigns multiple validator objects to a datum keypath (separate statements)', function () {
          model.assignValidator('foo', 'isString');
          model.assignValidator('foo', 'hasLengthOfFour');
          expect(model.validatorsMap.foo).to.deep.equal(['isString', 'hasLengthOfFour']);
        });

        it('only assigns the same validator once', function () {
          model.assignValidator('foo', 'isString');
          model.assignValidator('foo', 'isString');
          model.assignValidator('foo', 'isString');
          expect(model.validatorsMap.foo).to.deep.equal(['isString']);
        });

        xit('assigns multiple validator objects to a datum keypath (second argument is array)', function () {

        });

        xit('throws an error if less than two arguments are received', function () {

        });

        xit('throws an error if first argument isn\'t a string', function () {

        });

        xit('throws an error if datum with specified keypath doesn\'t exist', function () {

        });

        xit('throws an error if the second argument isn\'t a validator-like object', function () {

        });
      });

      xdescribe('removeValidator()', function () {
        it('stuff', function () {

        });
      });

      describe('isValid()', function () {
        it('returns true if value passes validation rule (one validator is set)', function () {
          model.set('foo', 'bar');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.true;
        });

        it('returns false if value fails validation rule (one validator is set)', function () {
          model.set('foo', 999);
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.false;
        });

        it('returns true if value passes all validation rules (multiple valiators are set)', function () {
          model.set('foo', 'baar');
          model.assignValidator('foo', 'hasLengthOfFour');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.true;
        });

        it('returns false if value fails one or more validation rules (multiple valiators are set)', function () {
          model.set('foo', 'bar');
          model.assignValidator('foo', 'hasLengthOfFour');
          model.assignValidator('foo', 'isString');
          expect(model.isValid('foo')).to.be.false;
        });

        xit('validates deeply nested value by keypath (success)', function () {

        });

        xit('validates deeply nested value by keypath (failure)', function () {

        });

        xit('validates arguments', function () {

        });
      });

      describe('getRawData()', function () {
        it('returns a raw Javascript object version of the model data without extras', function () {
          model.set('foo', [1,2,3]);
          model.set('bar', {foo: 'bar', bar: 'foo'});
          model.set('woo', 'shoo');

          expect(model.getRawData()).to.deep.equal({
            'foo': [1,2,3],
            'bar': {foo: 'bar', bar: 'foo'},
            'woo': 'shoo'
          });
        });

        it('altering a value after getting the raw data leaves the stored version unaltered', function () {
          var rawData;

          model.set('foo', [1,2,3]);
          model.set('bar', {foo: 'bar', bar: 'foo'});
          rawData = model.getRawData();
          rawData.foo[0] = 'hoo';
          rawData.bar.foo = 'doo';

          expect(model.get('foo')).to.deep.equal([1,2,3]);
          expect(model.get('bar')).to.deep.equal({foo: 'bar', bar: 'foo'});
        });
      });

      describe('remove()', function () {
        it('deletes a simple string data attribute', function () {
          model.data.foo = {value: 'bar'};
          model.remove('foo');
          expect(model.data.foo).to.be.undefined;
        }); 

        it('deletes a deep array entry', function () {
          model.data.foo = {
            woo: [10, 20, 30]
          };

          model.remove('foo.woo.1');
          expect(model.data.foo.woo).to.deep.equal([10, 30]);
        }); 

        it('deletes a deep model attribute', function () {
          var expectedDeepData = {
                coo: 'boo'
              };

          model.data.foo = {
            woo: [
              10,
              {
                coo: 'boo',
                too: 'ooh'
              },
              30
            ]
          };

          model.remove('foo.woo.1.too');
          expect(model.data.foo.woo[1]).to.deep.equal(expectedDeepData);
        }); 

        it('throws an error if no arguments are received', function () {
          expect(model.remove.bind(model)).to.throw(Error);
        });

        it('throws an error if the first argument is not a string', function () {
          utHelpers.everyThingExceptString.forEach(function(notAString) {
            expect(model.remove.bind(model, notAString)).to.throw(Error);
          });
        });

        it('throws error if shallow attribute to be removed does not exist', function () {
          expect(model.remove.bind(model, 'fubar')).to.throw(Error);
        });

        it('throws error and leaves existing data unaltered if deep attribute to be removed does not exist', function () {
          var expectedData = {
                foo: {
                  bar: [
                    'woo',
                    {
                      faa: 'baa'
                    },
                    'ooh'
                  ]
                }
              };

          model.data.foo = {
            bar: [
              'woo',
              {
                faa: 'baa'
              },
              'ooh'
            ]
          };

          expect(model.remove.bind(model, 'foo.bar.1.too')).to.throw(Error);
          expect(model.data).to.deep.equal(expectedData);
        });
      });

      describe('on()', function () {
        var onSpy;

        beforeEach(function () {
          onSpy = sinon.spy();
        });

        it('callback assigned to general datum update event is called with expected params', function () {
          var callbackParams1 = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              },
              callbackParams2 = {
                target: model,
                keypath: 'waa',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'woo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledTwice).to.be.true;
          expect(onSpy.calledWith(callbackParams1)).to.be.true;
          expect(onSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to general datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams1 = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              },
              callbackParams2 = {
                target: model,
                keypath: 'waa',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'baasheep'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledTwice).to.be.true;
          expect(onSpy.calledWith(callbackParams1)).to.be.true;
          expect(onSpy.calledWith(callbackParams2)).to.be.true;
        });

        it('callback assigned to named datum update event is called with expected params', function () {
          var callbackParams = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            keypath: 'foo'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');
          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith(callbackParams)).to.be.true;
        });

        it('callback assigned to named datum update event with specified namespace is called with expected arguments', function () {
          var callbackParams = {
                target: model,
                keypath: 'foo',
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            keypath: 'foo',
            nameSpace: 'baasheep'
          }, onSpy);

          model.set('foo', 'bar');
          model.set('foo', 'boo');
          model.set('waa', 'baa');
          model.set('waa', 'aah');

          expect(onSpy.calledOnce).to.be.true;
          expect(onSpy.calledWith(callbackParams)).to.be.true;
        });
      });

      describe('off()', function () {
        var onSpy1, onSpy2, onSpy3, onSpy4;

        beforeEach(function () {
          onSpy1 = sinon.spy();
          onSpy2 = sinon.spy();
          onSpy3 = sinon.spy();
          onSpy4 = sinon.spy();
        });

        it('removes all non-namespaced subscribers to a general datum update', function () {
          var options = {
                eventType: EVENTS.MODEL.DATUM_UPDATE
              };

          model.on(options, onSpy1);
          model.on(options, onSpy2);
          model.on(options, onSpy3);

          model.off(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(0);

          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(0);
        });

        it('removes all non-namespaced subscribers to a specific datum update', function () {
          var options = {
                eventType: EVENTS.MODEL.DATUM_UPDATE,
                keypath: 'foo'
              };

          model.on(options, onSpy1);
          model.on(options, onSpy2);
          model.on(options, onSpy3);

          // TODO: THIS ASSERTION DOESN'T BELONG HERE
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(3);

          model.off(options);

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(0);

          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id + ':foo'].unNameSpaced).to.have.length(0);
        });

        it('selectively removes only subscribers belonging to a given namespace out of many to a general datum update', function () {
          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, onSpy1);

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          }, onSpy2);

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myOtherNameSpace'
          }, onSpy3);

          model.on({
            eventType: EVENTS.MODEL.DATUM_UPDATE
          }, onSpy4);

          // TODO: THESE ASSERTIONs DON'T BELONG HERE
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.have.length(2);
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);

          model.off({
            eventType: EVENTS.MODEL.DATUM_UPDATE,
            nameSpace: 'myNameSpace'
          });

          model.set('foo', 1);
          model.set('foo', 2);
          model.set('foo', 3);

          expect(onSpy1.callCount).to.equal(0);
          expect(onSpy2.callCount).to.equal(0);
          expect(onSpy3.callCount).to.equal(2);
          expect(onSpy4.callCount).to.equal(2);

          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myNameSpace).to.be.undefined;
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].myOtherNameSpace).to.have.length(1);
          expect(model.subscriptions.internal[EVENTS.MODEL.DATUM_UPDATE + ':' + model.id].unNameSpaced).to.have.length(1);
        });

        xit('validates arguments', function () {

        });
      });

      describe('save', function () {
        it('calls saver function specified in arguments', function () {
          var saver = sinon.spy();
          model.save(saver);
          expect(saver.calledOnce).to.be.true;
        });

        it('if no arguments, calls saver option specified as object create / extend option', function () {
          var saver = sinon.spy();
          model = module.create({
            saver: saver
          });

          model.save();
          expect(saver.calledOnce).to.be.true;
        });

        it('if saver specified in arguments and in object create / extend params, calls save argument and not create param', function () {
          var saverOption = sinon.spy(),
              saverArg = sinon.spy();

          model = module.create({
            saver: saverOption
          });

          model.save(saverArg);
          expect(saverArg.calledOnce).to.be.true;
          expect(saverOption.called).to.be.false;
        });

        xit('saver function has this value of model if specified as argument', function () {

        });

        xit('saver function has this value of model if specified as create option', function () {

        });

        xit('if no arguments and no create option, throws error', function () {

        });

        xit('validates arguments', function () {

        });
      });

      describe('fetch', function () {
        it('calls fetcher function specified in arguments', function () {
          var fetcher = sinon.spy();
          model.fetch(fetcher);
          expect(fetcher.calledOnce).to.be.true;
        });

        it('if no arguments, calls fetcher option specified as object create / extend option', function () {
          var fetcher = sinon.spy();
          model = module.create({
            fetcher: fetcher
          });

          model.fetch();
          expect(fetcher.calledOnce).to.be.true;
        });

        it('if fetcher specified in arguments and in object create / extend params, calls fetch argument and not create param', function () {
          var fetcherOption = sinon.spy(),
              fetcherArg = sinon.spy();

          model = module.create({
            fetcher: fetcherOption
          });

          model.fetch(fetcherArg);
          expect(fetcherArg.calledOnce).to.be.true;
          expect(fetcherOption.called).to.be.false;
        });

        xit('fetcher function has this value of model if specified as argument', function () {

        });

        xit('fetcher function has this value of model if specified as create option', function () {

        });

        xit('if no arguments and no create option, throws error', function () {

        });

        xit('validates arguments', function () {

        });
      });

    });

  });

})();
