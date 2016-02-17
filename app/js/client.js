'use strict';
var app = {}; //namespace for bear Client app
var $ = require('jquery');
var _ = require('underscore');
require('backbone');
require(__dirname + '/models/bear');
require(__dirname + '/collections/bearCol');

// instance of the Collection
app.oneBearCollection = new app.BearCol();

// renders individual bear (li)
app.BearView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#bear-template').html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    this.input = this.$('.edit');
    return this; // enable chained calls
  },
  initialize: function(){
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this); // remove: Convenience Backbone's function for removing the view from the DOM.
  },
  events: {
    'dblclick label' : 'edit',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit' : 'close',
    'click .toggle': 'toggleCompleted',
    'click .destroy': 'destroy'
  },
  edit: function(){
    this.$el.addClass('editing');
    this.input.focus();
  },
  close: function(){
    var value = this.input.val().trim();
    if(value) {
      this.model.save({title: value});
    }
    this.$el.removeClass('editing');
  },
  updateOnEnter: function(e){
    if(e.which == 13){
      this.close();
    }
  },
  toggleCompleted: function(){
    this.model.toggle();
  },
  destroy: function(){
    this.model.destroy();
  }
});

// renders the full list of bears calling BearView for each one.
app.AppView = Backbone.View.extend({
  el: '#app',
  initialize: function () {
    this.input = this.$('#new-bear');
    app.oneBearCollection.on('add', this.addAll, this);
    app.oneBearCollection.on('reset', this.addAll, this);
    app.oneBearCollection.fetch(); // Loads list from local storage
  },
  events: {
    'keypress #new-bear': 'createBearOnEnter'
  },
  createBearOnEnter: function(e){
    if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
      return;
    }
    app.oneBearCollection.create(this.newAttributes());
    this.input.val(''); // clean input box
  },
  addOne: function(bear){
    var view = new app.BearView({model: bear});
    $('#bear-list').append(view.render().el);
  },
  addAll: function(){
    this.$('#bear-list').html(''); // clean the bear list
    // filter bear item list
    switch(window.filter){
      case 'pending':
        _.each(app.oneBearCollection.remaining(), this.addOne);
        break;
      case 'completed':
        _.each(app.oneBearCollection.completed(), this.addOne);
        break;
      default:
        app.oneBearCollection.each(this.addOne, this);
        break;
    }
  },
  newAttributes: function(){
    return {
      title: this.input.val().trim(),
      completed: false
    }
  }
});

    //--------------
    // Routers
    //--------------

    app.Router = Backbone.Router.extend({
      routes: {
        '*filter' : 'setFilter'
      },
      setFilter: function(params) {
        console.log('app.router.params = ' + params);
        if(params){
          window.filter = params.trim() || '';
        }

        app.oneBearCollection.trigger('reset');
      }
    });

    //--------------
    // Initializers
    //--------------

    app.router = new app.Router();
    Backbone.history.start();
    app.appView = new app.AppView();
