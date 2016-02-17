app.BearCol = Backbone.Collection.extend({
  model: app.Bear,
  url: 'http://localhost:3000/api/bears',
  completed: function() {
    return this.filter(function( bear ) {
      return bear.get('completed');
    });
  }

});
