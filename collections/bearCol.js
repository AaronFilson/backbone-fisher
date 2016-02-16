app.BearCol = Backbone.Collection.extend({
  model: app.Bear,
  url: '/api/bears',
  completed: function() {
    return this.filter(function( bear ) {
      return bear.get('completed');
    });
  }

});
