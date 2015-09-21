# simple-mv

[![Build Status](https://travis-ci.org/davidcole1977/simple-mv.svg?branch=master)](https://travis-ci.org/davidcole1977/simple-mv) [![Coverage Status](https://coveralls.io/repos/davidcole1977/simple-mv/badge.svg?branch=master&service=github)](https://coveralls.io/github/davidcole1977/simple-mv?branch=master)

> A basic Javascript Model View library

> **This is not likely to be developed futher. I've realised this isn't the path I want to go down and will instead take the learnings from this and will put them into a simplified set of tools designed to play well with React and similar view libraries. See [https://github.com/davidcole1977/simple-tree/](https://github.com/davidcole1977/simple-tree/). This repo wll be preserved for reference only and is unlikely to ever be in a Production-ready state.**

This is intended to be a lightweight Model View library, inspired by BackboneJS and designed to play well with View libraries such as React, Ractive and Knockout.

It's being built as a learning exercise and in all likelyhood you'll be better off using Backbone, but perhaps you'll find it useful.

**[Current tasks on Trello](https://trello.com/b/mZkBqF8w/simple-mv)**

## Set up

## Concepts

### Like BackboneJS, but... well, like BackboneJS

### Models

### Collections

### Views

Views are very dumb and know nothing of templating, the browser DOM. Simple MV is designed to allow you to use whatever view / templating / rendering library you like, so it gives you what you need to feed data into your view and communicate with models and collections – and no more.

Other than methods for listening for changes to models and collections, one thing views do provide is data binding. You can set your view data (viewmodel) to automatically update when specific data is updated in your models and collections.

### Custom components

### Events

## API

### simple-model

#### create()

```js
var model = require('simple-mv').model,
    myModel;

myModel =  model.create({
  data: {
    foo: 'bar',
    woo: [1,2,3,4,5]
  },
  initialise: function () {
    // do custom things when model is created
  }
});
```

#### extend()

```js
var model = require('simple-mv').model,
    myModelClass,
    myModelInstance1,
    myModelInstance2;

myModelClass = model.extend({
  data: {
    foo: 'bar',
    woo: [1,2,3,4,5]
  },
  initialise: function () {
    // do custom things when model is created
  }
});

myModelInstance1 =  myModelClass.create();
myModelInstance2 =  myModelClass.create();
```

#### Properties

TBC...

#### Events

TBC...

#### get()

#### set()

#### remove()

#### getRawData()

#### assignValidator()

#### removeValidator()

#### isValid()

#### on()

#### off()

#### addListener()

#### removeListener()

#### save()

#### fetch()

#### More...

----------------

### simple-collection

#### Properties

TBC...

#### Events

TBC...

#### create()

#### extend()

#### on()

#### off()

#### addListener()

#### removeListener()

#### save()

#### fetch()

#### More...

----------------

### simple-view

#### Properties

TBC...

#### Events

TBC...

#### create()

#### extend()

#### on()

#### off()

#### addListener()

#### removeListener()

#### bindData()

#### unbindData()

----------------

### simple-events

TBC...

----------------

### simple-store

TBC...

----------------

### simple-pubsub

TBC...

----------------

## Releases

## To Do

[Trello simple-mv board](https://trello.com/b/mZkBqF8w/simple-mv)

### Next up:

objects as children of other objects

model events bubble up to parent models / collections automatically. parent models subscribe to all child model events when initially added set(), and unsubscribe when remove()d. events naming config needs a tweak:

```js
EVENT_TYPES: {
  MODEL: {
    DATUM_UPDATE: ''
  },
  VIEW: {
    // etc.
  }
}
```

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
  * method to construct topic names
  * stopListeningTo method
  * generic emitEvent (trigger) method
  * addListener(), removeListener(), on() and off() share way too much code - refactor out the duplication
* Refactor common prototype methods (eg. on(), off()) into common (prototype? module?)
* Common shared extend() method
* Model saver & fetcher factories
* single entry file simple-mv.js
* Take inspiration from BackboneJS
* Write API documentation
* Ensure all pubsub subscriptions are tidied up when components are removed
* Refactor unit tests for efficiency, taking into account recent refactoring – test generic prototype tasks and module methods in detail in separate tests (eg. events, create, extend) and do only essential further testing in specific modules (eg. model, view, collection)

## Names... (the DIFFICULT part)

### Available on npmjs.com

* stickleback
* mortise (mortise lock (key), mortise and tenon joint)
* gaffertape
* dowel
* chops (nickname)
* chocolatl (I Like chocolate, ok?)
* thatch
* wicker
* noose (from rope / knot, tieing things together)
* staircase
* stickle (from stickle bricks, simple construction, glue)
* stein (stone, brick)
* arbeit (work)
* nori (japanese for glue)
* tatami
* gigathor
* wiffwaff

### Not available on npmjs.com

* clamp
* Bamboo
* Balsa
* Mortar
* Copper
* Plumber
* Brick
* Breezeblock
* Glue
* Cement
* Muster
* Lasso
* But EVERY name is already taken! :(
* (need to get a bit esoteric...)
* Mario / Luigi (plumber)
* Armature
* glass (art / construction material, transparency)
* prism
* glaze
* cacao (because I like chocolate)
* temper
* mitre
* dovetail
* domino
* ziptie
* lattice
* catwalk (somewhere your models live. Getit?)
* bowline
* quokka
* escher
* ziggurat
