var ExampleContainer = React.createClass({
  render: function() {
    var code = this.props.code;
    try {
      var component = this.props.factory();
    } catch (e) {
      console.error(e);
      throw e;
    }
    
    return React.DOM.div({className: 'example-container'},
      React.DOM.h4({className: 'ui header'}, this.props.title),
      React.DOM.pre({className: 'ui segment'}, React.DOM.code(undefined, code)),
      React.DOM.div({}, component)
    );
  }
});

function showTitle(title, semUiLink) {
  $('#header').html('<h2><a href="' + semUiLink + '">' + title + '</a></span></h2>');

}

function showExample(title, code) {
  var el = document.createElement('div'),
      transformed = JSXTransformer.transform('/** @jsx React.DOM */\n' + code).code;
  $('#example').append(el);
  React.renderComponent(new ExampleContainer({
    title: title,
    code: code,
    factory: function() {
      eval(transformed);
      return component;
    }
  }), el);
}
