var layout = rsui.layout;

describe('Loader', function() {
  var Loader = layout.Loader;
  it('should render normally when not in a loading state', function() {
    var loader = new Loader({className: 'foo'}, 'inner content');
    expect(normalizeReact(loader)).to.eql('<div class=\"foo\">inner content</div>');
  });

  it('should render loading indicator when in loading state', function() {
    var loader = new Loader({className: 'foo', loading: true}, 'inner content');
    expect(normalizeReact(loader)).to.eql('<div class=\"ui segment foo\"><div class=\"ui active inverted dimmer\"><div class=\"ui loader\"></div></div><span>inner content</span></div>');
  });

  it('should render loading indicator custom type', function() {
    var loader = new Loader({className: 'foo', type: 'bar', loading: true}, 'inner content');
    expect(normalizeReact(loader)).to.eql('<div class=\"ui segment foo\"><div class=\"ui active bar\"><div class=\"ui loader\"></div></div><span>inner content</span></div>');
  });
});


describe('Steps', function() {
  var Steps = layout.Steps;
  var stepData = [
    {key: '1', label: 'One'},
    {key: '2', label: 'Two', disabled: true},
    {key: '3', label: 'Three'}
  ];
  it('should select the first step by default', function() {
    var steps = new Steps({steps: stepData});
    expect(normalizeReact(steps)).to.eql('<div class=\"ui steps\"><div class=\"ui step active\">One</div><div class=\"ui step disabled\">Two</div><div class=\"ui step\">Three</div></div>');
  });
  it('should select the active step if provided', function() {
    var steps = new Steps({active: '3', steps: stepData});
    expect(normalizeReact(steps)).to.eql('<div class=\"ui steps\"><div class=\"ui step\">One</div><div class=\"ui step disabled\">Two</div><div class=\"ui step active\">Three</div></div>');
  });
});


describe('Paginator', function() {
  var Paginator = layout.Paginator;
  it('should render with default behavior', function() {
    var paginator = new Paginator({totalPages: 9});
    expect(normalizeReact(paginator)).to.eql('<div class=\"ui pagination menu\"><div class=\"icon disabled item\"><i class=\"left arrow icon\"></i></div><div class=\"active item\">1</div><a class=\"item\" href=\"#2\">2</a><a class=\"item\" href=\"#3\">3</a><div class=\"disabled item\">...</div><a class=\"item\" href=\"#9\">9</a><a class=\"icon item\"><i class=\"right arrow icon\"></i></a></div>');
  });
  it('should render with larger radius', function() {
    var paginator = new Paginator({totalPages: 9, radius: 2});
    expect(normalizeReact(paginator)).to.eql('<div class=\"ui pagination menu\"><div class=\"icon disabled item\"><i class=\"left arrow icon\"></i></div><div class=\"active item\">1</div><a class=\"item\" href=\"#2\">2</a><a class=\"item\" href=\"#3\">3</a><a class=\"item\" href=\"#4\">4</a><a class=\"item\" href=\"#5\">5</a><a class=\"item\" href=\"#6\">6</a><a class=\"item\" href=\"#7\">7</a><div class=\"disabled item\">...</div><a class=\"item\" href=\"#9\">9</a><a class=\"icon item\"><i class=\"right arrow icon\"></i></a></div>');
  });
});