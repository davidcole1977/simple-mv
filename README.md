# simple-mv

[![Build Status](https://travis-ci.org/davidcole1977/simple-mv.svg?branch=master)](https://travis-ci.org/davidcole1977/simple-mv) [![Coverage Status](https://coveralls.io/repos/davidcole1977/simple-mv/badge.svg?branch=master&service=github)](https://coveralls.io/github/davidcole1977/simple-mv?branch=master)

> A basic Javascript Model View library

This is very much work in progress and not anywhere near usable yet.

### To do

* simplify model events (publications), so that there are no separarate datum events, just model events – a datum event will be replaced with a model event, with an event type of 'datum-update' (or create, remove etc.), with an event object that contains everything needed.
