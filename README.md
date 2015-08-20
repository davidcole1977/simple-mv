# simple-mv

[![Build Status](https://travis-ci.org/davidcole1977/simple-mv.svg?branch=master)](https://travis-ci.org/davidcole1977/simple-mv) [![Coverage Status](https://coveralls.io/repos/davidcole1977/simple-mv/badge.svg?branch=master&service=github)](https://coveralls.io/github/davidcole1977/simple-mv?branch=master)

> A basic Javascript Model View library

This is very much work in progress and not anywhere near usable yet.

### To do

* Model
	* add model initialise and destroy events
	* add create() / extend() parameters / constructor options
	* save() and fetch() methods with associated events & callbacks
	* local storage and/or indexedDB store and fetch 'plugins'
	* subclass / extend model
	* on() method for adding event listener to self – eg. model.on('save', eventHandler); model.on('datum_update:myDatumName', eventHandler)
	* collections of models
	* models / collections as datum attributes of parent model, with event bubbling
	* method chaining / fluent interface
	* arbitrary setting / getting data values at any level of model data
	* full validation, with validate events
* View
	* Tidy up the view.bind() method. It's FUGLY. Will likely need to be separarated into some separate functions, which might be able to be shared with view.receiveBindEvent() and addEventListener()
	* subclass / extend view
	* add create() / extend() parameters / constructor options
	* method chaining / fluent interface
	* demo of data binding for simple Ractive component
* Take inspiration from BackboneJS
* Write API documentation
