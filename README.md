# simple-mv

[![Build Status](https://travis-ci.org/davidcole1977/simple-mv.svg?branch=master)](https://travis-ci.org/davidcole1977/simple-mv) [![Coverage Status](https://coveralls.io/repos/davidcole1977/simple-mv/badge.svg?branch=master&service=github)](https://coveralls.io/github/davidcole1977/simple-mv?branch=master)

> A basic Javascript Model View library

This is very much work in progress and not anywhere near usable yet.

### To do

* Model
	* save() and fetch() methods with associated events & callbacks
	* local storage and/or indexedDB store and fetch 'plugins'
	* collections of models
	* models / collections as datum attributes of parent model, with event bubbling
	* method chaining / fluent interface
	* arbitrary setting / getting data values at any level of model data
	* set and get data directly, without using get() / set()
	* full validation, with validate events
	* Emit custom events
* View
	* subclass / extend view
	* add create() / extend() parameters / constructor options
	* method chaining / fluent interface
	* demo of data binding for simple Ractive component
	* Emit custom events
	* apply common prototype & create / extend stuff from model, collections etc.
* Collection
  * do stuff
* Refactor common prototype methods (eg. on(), off()) into common (prototype? module?)
* Model saver & fetcher factories
* single entry file simple-mv.js
* Take inspiration from BackboneJS
* Write API documentation
