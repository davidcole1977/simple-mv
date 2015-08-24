# simple-mv

[![Build Status](https://travis-ci.org/davidcole1977/simple-mv.svg?branch=master)](https://travis-ci.org/davidcole1977/simple-mv) [![Coverage Status](https://coveralls.io/repos/davidcole1977/simple-mv/badge.svg?branch=master&service=github)](https://coveralls.io/github/davidcole1977/simple-mv?branch=master)

> A basic Javascript Model View library

This is intended to be a lightweight Model View library, inspired by BackboneJS and designed to play well with View libraries such as React, Ractive and Knockout.

It's being built as a learning exercise and in all likelyhood you'll be better off using Backbone, but perhaps you'll find it useful.

It's currently very much a work in progress and does not deserve a version number yet. If you use it, it will probably destroy your code and post a flaming turd through your letterbox.

## To do

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
	* destroy()
	* receive and pass through events from child models & collections
* View
	* subclass / extend view
	* add create() / extend() parameters / constructor options
	* method chaining / fluent interface
	* demo of data binding for simple Ractive component
	* Emit custom events
	* apply common prototype & create / extend stuff from model, collections etc.
	* change the name of the bind() method – it's confusing!
* Collection
  * destroy()
  * get, put, push, sort etc.
  * receive and pass through events from child models
* Events / pubsub
  * refactor to use a single default pubsub list instead of each model / collection etc. having its own pubsub list
  * stopListeningTo method
  * generic emitEvent (trigger) method
* Refactor common prototype methods (eg. on(), off()) into common (prototype? module?)
* Common shared extend() method
* Model saver & fetcher factories
* single entry file simple-mv.js
* Take inspiration from BackboneJS
* Write API documentation
* Ensure all pubsub subscriptions are tidied up when components are removed

## Names...

* Mortar
* Copper
* Plumber
* Brick
* Breezeblock
* Glue
* Cement
* Fetch
* Muster
* Mustard
* But EVERY name is already taken! :'(
* (need to get a bit esoteric...)
* Mario / Luigi (plumber)

## Pubsub topics (events) definitions

```js
event_type[:component_id[:datum_name]]

eg.
update_datum
create_model:model_12
remove_datum:model_9:my_datum_name

  EVENT_TYPES: {
    MODEL_CREATE: 'create-model',
    DATUM_UPDATE: 'update-datum',
    DATUM_CREATE: 'create-datum',
    DATUM_REMOVE: 'remove-datum'
  }
```