var formComponents = require('../../lib/form'),
    Button = formComponents.Button,
    window2, document2;

describe('Button', function() {
  var _applyLoadingState = formComponents.applyLoadingState;
  afterEach(function() {
    formComponents.defaultClassSignature('button', 'ui button');
    formComponents.applyLoadingState = _applyLoadingState;
  });

  it('should display initial state', function() {
    var button = new Button(),
        domString = React.renderComponentToString(button);
    expect(hasClass(['ui', 'button'], domString)).to.eql(true);
    expect(noClass('loading', domString)).to.eql(true);
  });

  it('should handle loading events', function() {
    var button = new Button({loading: true});
    expect(hasClass(['ui', 'button', 'loading'], button)).to.eql(true);

    button = new Button({loading: true});
    expect(hasClass(['ui', 'button', 'loading'], button)).to.eql(true);
  });

  it('should display disabled', function() {
    var button = new Button({disabled: true});
    expect(hasClass(['ui', 'button', 'disabled'], button)).to.eql(true);
  });

  it('should override default button class names', function() {
    formComponents.defaultClassSignature('button', 'foo');
    var button = new Button({disabled: true}),
        domString = React.renderComponentToString(button);
    expect(hasClass(['foo'], domString)).to.eql(true);
    expect(noClass(['ui', 'button'], domString)).to.eql(true);
  });

  it('should override loading behavior', function() {
    formComponents.applyLoadingState = function(className) {
      return className + ' bar';
    };
    var button = new Button({loading: true}),
        domString = React.renderComponentToString(button);
    expect(hasClass(['bar'], domString)).to.eql(true);
    expect(noClass(['loading'], domString)).to.eql(true);
  });

  it('should add additional classes', function() {
    var button = new Button({className: 'test'});
    expect(hasClass(['ui', 'button', 'test'], button)).to.eql(true);
  });

  it('should add icons', function() {
    var button = new Button({icon: 'foo'}, 'inner content');
        domString = React.renderComponentToString(button);
    expect(domString.indexOf('<i class="icon foo"') >= 0).to.eql(true);
  });
});
