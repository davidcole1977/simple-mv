(function () {

  var expect = require('chai').expect,
      _ = require('lodash'),
      sinon = require('sinon'),
      utHelpers = require('../lib/unit-test-helpers.js'),
      module = require(utHelpers.getModulePath('simple-pubsub'));

  describe('simple-pubsub', function () {
    
    xdescribe('create', function () {
      it('stuff', function () {

      });

    });

    describe('prototype methods', function () {
      var pubsubList;

      beforeEach(function () {
        pubsubList = module.create();
      });

      describe('getSubscriptionCount()', function () {

        it('returns 0 when module is initialised', function () { 
          expect(pubsubList.getSubscriptionCount('my-topic')).to.equal(0);
        });

        it('returns 10 when there are 10 subscribers to the specified topic', function () {
          for (i = 0; i < 10; i += 1) {
            pubsubList.createSubscription('my-topic', function () {});
          }

          expect(pubsubList.getSubscriptionCount('my-topic')).to.equal(10);
        });

        it('returns 5 when 10 subscribers were added to the specified topic, five removed from the specified topic and 20 added to a different topic', function () {
          var mySubs = [];

          for (i = 0; i < 10; i += 1) {
            mySubs.push(pubsubList.createSubscription('my-topic', function () {}));
          }

          for (i = 0; i < 5; i += 1) {
            mySubs[i].unsubscribe();
          }

          for (i = 0; i < 20; i += 1) {
            pubsubList.createSubscription('my-other-topic', function () {});
          }

          expect(pubsubList.getSubscriptionCount('my-topic')).to.equal(5);
        });

        it('returns 0 when 10 subscribers were added to the specified topic and then all unsubscribed', function () {
          var mySubs = [];

          for (i = 0; i < 10; i += 1) {
            mySubs.push(pubsubList.createSubscription('my-topic', function () {}));
          }

          for (i = 0; i < 10; i += 1) {
            mySubs[i].unsubscribe();
          }

          expect(pubsubList.getSubscriptionCount('my-topic')).to.equal(0);
        });

      });

      describe('createSubscription()', function () {
        xit('stuff', function () {

        });

        it('subscription created has an ID attribute that is different from the previous model created', function () {
          var sub1 = pubsubList.createSubscription(),
              sub2 = pubsubList.createSubscription();

          expect(sub1.id).to.have.length.above(0);
          expect(sub1.id).to.not.equal(sub2.id);
        });
      });

      xdescribe('addSubscription()', function () {
        it('stuff', function () {

        });
      });

      xdescribe('removeSubscription()', function () {
        it('stuff', function () {

        });
      });

      xdescribe('subscription', function () {

        describe('unsubscribe()', function () {
          it('stuff', function () {

          });
        });

      });

      describe('publish()', function () {

        it('throws no errors if publish is attempted before any subscribers are available', function () {
          var publishAttempt = pubsubList.publish.bind(pubsubList, 'my-topic');
          expect(publishAttempt).to.not.throw();
        });

        it('calls subscriber callback with correct data when topic with single subscriber is published with data', function () {
          var callback = sinon.spy(),
              mySub = pubsubList.createSubscription('my-topic', callback),
              testData = {foo: 'bar'};

          pubsubList.publish('my-topic', testData);

          expect(callback.calledWith(testData)).to.be.true;
        });

        it('calls subscriber callback with null data if no data is provided passed to publish', function () {
          var callback = sinon.spy(),
              mySub = pubsubList.createSubscription('my-topic', callback);

          pubsubList.publish('my-topic');

          expect(callback.calledWith(null)).to.be.true;
        });

        it('does not call subscriber callback when only subscription to topic is removed and then topic is published', function () {
          var callback = sinon.spy();
              mySub = pubsubList.createSubscription('my-topic', callback),

          mySub.unsubscribe();
          pubsubList.publish('my-topic');

          expect(callback.called).to.be.false;
        });

        it('calls only the correct callbacks when a single topic with multiple subscribers is published and there are subscribers to other topics', function () {
          var callback1 = sinon.spy(),
              callback2 = sinon.spy(),
              callback3 = sinon.spy(),
              callback4 = sinon.spy(),
              callback5 = sinon.spy();

          pubsubList.createSubscription('my-topic-1', callback1);
          pubsubList.createSubscription('my-topic-1', callback2);
          pubsubList.createSubscription('my-topic-1', callback3);

          pubsubList.createSubscription('my-topic-2', callback4);
          pubsubList.createSubscription('my-topic-3', callback5);

          pubsubList.publish('my-topic-1');

          expect(callback1.calledOnce).to.be.true;
          expect(callback2.calledOnce).to.be.true;
          expect(callback3.calledOnce).to.be.true;

          expect(callback4.called).to.be.false;
          expect(callback5.called).to.be.false;
        });

      });

    });

  });

})();
