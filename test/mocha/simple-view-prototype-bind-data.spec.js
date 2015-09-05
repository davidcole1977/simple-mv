(function () {
  'use strict';

  var expect = require('chai').expect,
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-view')),
      modelSubs = require(utHelpers.getModulePath('app-subscriptions')),
      sm = require(utHelpers.getModulePath('simple-model')),
      GLOBAL_CONFIG = require(utHelpers.getModulePath('global-config')),
      EVENTS = GLOBAL_CONFIG.EVENTS;

  
  describe('simple-view', function () {

    describe('prototype methods', function () {

      xdescribe('method()', function () {
        it('stuff', function () {
        
        });
      });

      describe('bindData()', function () {
        var view, model;

        beforeEach(function () {
          view = module.create();
          model = sm.create();
        });

        describe('binding a whole single model to the whole view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bindData({target: model});
            expect(view.data).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({target: model});

            expect(view.data).to.deep.equal({
              foo: 'boo',
              bar: 'car'
            });
          });

          it('view data reflects state of model with deep data', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({target: model});

            expect(view.data).to.deep.equal({
              foo: {
                boo: [
                  null,
                  {
                    woo: 'boo'
                  }
                ]
              },
              bar: {
                car: {
                  woo : 'car'
                }
              }
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({target: model});

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              foo: 'hoo',
              bar: 'far'
            });
          });

          it('view data updates correspondingly when deep model data updates', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({target: model});

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              foo: {
                boo: [
                  null,
                  {
                    woo: 'hoo'
                  }
                ]
              },
              bar: {
                car: {
                  woo : 'far'
                }
              }
            });
          });

          it('view data updates when model datums are created (bound before model datums exist)', function () {
            view.bindData({target: model});

            model.set('foo', 'boo');
            model.set('bar', 'car');

            expect(view.data).to.deep.equal({
              foo: 'boo',
              bar: 'car'
            });
          });

          it('view data updates when deep model datums are created (bound before model datums exist)', function () {
            view.bindData({target: model});

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              foo: {
                boo: [
                  null,
                  {
                    woo: 'hoo'
                  }
                ]
              },
              bar: {
                car: {
                  woo : 'far'
                }
              }
            });
          });

          xit('what happens when a datum is removed?', function () {

          });
        });

        describe('binding a whole model to a named view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bindData({
              target: model,
              viewDatum: 'foo'
            });

            expect(view.data.foo).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: {
                foo: 'boo',
                bar: 'car'
              }
            });
          });

          it('view data reflects state of model with deep data (bound to shallow view keypath)', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: {
                foo: {
                  boo: [
                    null,
                    {
                      woo: 'boo'
                    }
                  ]
                },
                bar: {
                  car: {
                    woo : 'car'
                  }
                }
              }
            });
          });

          it('view data reflects state of model with deep data (bound to deep view keypath (array entry))', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo.foo.1'
            });

            expect(view.data).to.deep.equal({
              woo: {
                foo: [
                  null,
                  {
                    foo: {
                      boo: [
                        null,
                        {
                          woo: 'boo'
                        }
                      ]
                    },
                    bar: {
                      car: {
                        woo : 'car'
                      }
                    }
                  }
                ]
              }
            });
          });

          it('view data reflects state of model with deep data (bound to deep view keypath (object param))', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo.foo'
            });

            expect(view.data).to.deep.equal({
              woo: {
                foo: {
                  foo: {
                    boo: [
                      null,
                      {
                        woo: 'boo'
                      }
                    ]
                  },
                  bar: {
                    car: {
                      woo : 'car'
                    }
                  }
                }
              }
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: 'hoo',
                bar: 'far'
              }
            });
          });

          it('view data updates correspondingly when deep model data updates (bound to shallow view keypath)', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: {
                  boo: [
                    null,
                    {
                      woo: 'hoo'
                    }
                  ]
                },
                bar: {
                  car: {
                    woo : 'far'
                  }
                }
              }
            });
          });

          it('view data updates correspondingly when deep model data updates (bound to deep view keypath (object param))', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo.foo'
            });

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: {
                  foo: {
                    boo: [
                      null,
                      {
                        woo: 'hoo'
                      }
                    ]
                  },
                  bar: {
                    car: {
                      woo : 'far'
                    }
                  }
                }
              }
            });
          });

          it('view data updates correspondingly when deep model data updates (bound to deep view keypath (array entry))', function () {
            model.set('foo.boo.1.woo', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              viewDatum: 'woo.foo.1'
            });

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: [
                  null,
                  {
                    foo: {
                      boo: [
                        null,
                        {
                          woo: 'hoo'
                        }
                      ]
                    },
                    bar: {
                      car: {
                        woo : 'far'
                      }
                    }
                  }
                ]
              }
            });
          });

          it('view data updates when model datums are created (bound before model datums exist)', function () {
            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            model.set('foo', 'boo');
            model.set('bar', 'car');

            expect(view.data).to.deep.equal({
              woo: {
                foo: 'boo',
                bar: 'car'
              }
            });
          });

          it('view data updates when deep model datums are created (bound before model datums exist) (bound to shallow view keypath)', function () {
            view.bindData({
              target: model,
              viewDatum: 'woo'
            });

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: {
                  boo: [
                    null,
                    {
                      woo: 'hoo'
                    }
                  ]
                },
                bar: {
                  car: {
                    woo : 'far'
                  }
                }
              }
            });
          });

          it('view data updates when deep model datums are created (bound before model datums exist) (bound to deep view keypath)', function () {
            view.bindData({
              target: model,
              viewDatum: 'woo.foo.1'
            });

            model.set('foo.boo.1.woo', 'hoo');
            model.set('bar.car.woo', 'far');

            expect(view.data).to.deep.equal({
              woo: {
                foo: [
                  null,
                  {
                    foo: {
                      boo: [
                        null,
                        {
                          woo: 'hoo'
                        }
                      ]
                    },
                    bar: {
                      car: {
                        woo : 'far'
                      }
                    }
                  }
                ]
              }
            });
          });

          xit('what happens when a datum is removed?', function () {

          });
        });

        describe('binding a named model datum to the whole view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo'
            });

            expect(view.data).to.deep.equal({});
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo'
            });

            expect(view.data).to.deep.equal('boo');
          });

          it('view data reflects state of model with deep data (bound to shallow datum)', function () {
            model.set('foo.boo.1.woo.hoo.1', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo'
            });

            expect(view.data).to.deep.equal({
              boo: [
                null,
                {
                  woo: {
                    hoo: [
                      null,
                      'boo'
                    ]
                  }
                }
              ]
            });
          });

          it('view data reflects state of model with deep data (bound to deep datum)', function () {
            model.set('foo.boo.1.woo.hoo.1', 'boo');
            model.set('bar.car.woo', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1'
            });

            expect(view.data).to.deep.equal({
              woo: {
                hoo: [
                  null,
                  'boo'
                ]
              }
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal('hoo');
          });

          it('view data updates correspondingly when deep model data updates (bound to deep datum)', function () {
            model.set('foo.boo.1.woo.hoo.1', 'roo');
            model.set('bar.car.woo', 'tar');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1'
            });

            model.set('foo.boo.1.woo.hoo.1', 'boo');
            model.set('bar.car.woo', 'car');

            expect(view.data).to.deep.equal({
              woo: {
                hoo: [
                  null,
                  'boo'
                ]
              }
            });
          });

          it('view data updates when model datums are created (bound before model datums exist)', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo'
            });

            model.set('foo', 'boo');
            model.set('bar', 'car');

            expect(view.data).to.deep.equal('boo');
          });

          // THIS
          it('view data updates when deep model datums are created (bound before model datums exist)', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1'
            });

            model.set('foo.boo.1.woo.hoo.1', 'boo');
            model.set('bar.car.woo', 'car');

            expect(view.data).to.deep.equal({
              woo: {
                hoo: [
                  null,
                  'boo'
                ]
              }
            });
          });

          xit('what happens when a datum is removed?', function () {

          });
        });

        describe('binding a named model datum to a named view data parameter', function () {
          it('view data reflects state of model with no data', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: null
            });
          });

          it('view data reflects state of model with data', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'woo'
            });

            expect(view.data).to.deep.equal({
              woo: 'boo'
            });
          });

          it('view data reflects state of model with deep data (deep view datum bound to deep model datum)', function () {
            model.set('foo.boo.1.woo.hoo.1', 'roo');
            model.set('bar.car.woo', 'tar');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1',
              viewDatum: 'arg.1.2'
            });

            expect(view.data).to.deep.equal({
              arg: [
                null,
                [
                  null,
                  null,
                  {
                    woo: {
                      hoo: [
                        null,
                        'roo'
                      ]
                    } 
                  }
                ]
              ]
            });
          });

          it('view data updates correspondingly when model data updates', function () {
            model.set('foo', 'boo');
            model.set('bar', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'woo'
            });

            model.set('foo', 'hoo');
            model.set('bar', 'far');

            expect(view.data).to.deep.equal({
              woo: 'hoo'
            });
          });

          it('view data updates correspondingly when model data updates (deep view datum bound to deep model datum)', function () {
            model.set('foo.boo.1', 'roo');
            model.set('bar.car.woo', 'tar');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1',
              viewDatum: 'arg.1.2'
            });

            model.set('foo.boo.1', 'boo');
            model.set('bar.car.woo', 'car');

            expect(view.data).to.deep.equal({
              arg: [
                null,
                [
                  null,
                  null,
                  'boo'
                ]
              ]
            });
          });

          it('view data updates when model datums are created (bound before model datums exist)', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo',
              viewDatum: 'woo'
            });

            model.set('foo', 'boo');
            model.set('bar', 'car');

            expect(view.data).to.deep.equal({
              woo: 'boo'
            });
          });

          it('view data updates when model datums are created (bound before model datums exist) (deep view datum bound to deep model datum)', function () {
            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1',
              viewDatum: 'arg.1.2'
            });

            model.set('foo.boo.1', 'boo');
            model.set('bar.car.woo', 'car');

            expect(view.data).to.deep.equal({
              arg: [
                null,
                [
                  null,
                  null,
                  'boo'
                ]
              ]
            });
          });

          it('does not attempt to update another (unchanged) keypath bound on the same model when bound datum updated', function () {
            var assignBoundDataSpy;

            model.set('foo.boo', 'boo');
            model.set('bar.car', 'car');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo',
              viewDatum: 'ooh.coo'
            });

            view.bindData({
              target: model,
              targetDatum: 'bar.car',
              viewDatum: 'far.arg'
            });

            assignBoundDataSpy = sinon.spy(view, 'assignBoundData');

            model.set('foo.boo', 'zoo');

            expect(view.data).to.deep.equal({
              ooh: {
                coo: 'zoo'
              },
              far: {
                arg: 'car'
              }
            });

            expect(assignBoundDataSpy.calledOnce).to.be.true;
          });

          it('deep data binding: updates data when the child datum of bound parent datum is updated', function () {
            model.set('foo.boo.1.hoo.doo', 'roo');
            model.set('bar.car.woo', 'tar');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1',
              viewDatum: 'arg.1.2'
            });

            model.set('foo.boo.1.hoo.doo', 'boo');
            model.set('bar.car.woo', 'car');

            expect(view.data).to.deep.equal({
              arg: [
                null,
                [
                  null,
                  null,
                  {
                    hoo: {
                      doo: 'boo'
                    }
                  }
                ]
              ]
            });
          });

          it('deep data binding: updates only the child datum when the child datum of bound parent datum is updated', function () {
            var assignBoundDataSpy;

            model.set('foo.boo.1.hoo.doo', 'roo');

            view.bindData({
              target: model,
              targetDatum: 'foo.boo.1',
              viewDatum: 'arg.1.2'
            });

            assignBoundDataSpy = sinon.spy(view, 'assignBoundData');

            model.set('foo.boo.1.hoo.doo', 'boo');

            console.log('assignBoundDataSpy.args[0]', assignBoundDataSpy.args[0]);

            expect(assignBoundDataSpy.calledWith('arg.1.2.hoo.doo', 'boo')).to.be.true;
          });

          xit('multiple bindings to multiple models at multiple levels...', function () {

          });

          xit('what happens when a datum is removed?', function () {

          });
        });

        xdescribe('validate arguments', function () {
          it('stuff', function () {
          
          });
        });
        
      }); // describe('bindData()', function () {

      xdescribe('unbindData()', function () {
        it('stuff', function () {
        
        });

        it('cleans up subscriptions', function () {
        
        });
      });

    });

  });

})();
