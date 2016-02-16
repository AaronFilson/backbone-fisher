app.Bear = Backbone.Model.extend({
  defaults: {
    name: '',
    fishPreference: ''
  },
  toggle: function(){
    // this.save({ completed: !this.get('completed')});
  }
});
