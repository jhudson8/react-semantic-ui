var inputComponents = require('../../lib/input'),
    Text = inputComponents.Text,
    Select = inputComponents.Select,
    Control = inputComponents.Control;

describe('Control', function() {
  it('should render', function() {
    var control = new Control({label: 'Test'}, React.DOM.div({}, 'inner content'));
    expect(normalizeReact(control)).to.eql('<div class="field"><label for="*">Test</label><div>inner content</div></div>');
  });
});

describe('Text', function() {
  it('should display as input only without a label', function() {
    var text = new Text({value: 'test'});
    expect(normalizeReact(text)).to.eql('<input value="test">');
  });

  it('should display as field container with a label', function() {
    var text = new Text({value: 'test', label: 'Test'});
    expect(normalizeReact(text)).to.eql('<div class="field"><label for="*">Test</label><input id="*" value="test"></div>');
  });

  it('should wrap in a container div', function() {
    var text = new Text({value: 'test', containerClass: 'foo'}, React.DOM.span({}, 'inner'));
    expect(normalizeReact(text)).to.eql(
      '<div class="field"><div class="foo"><input value="test"><span>inner</span></div></div>');
  });
});

describe('Select', function() {
  it('should render text only options', function() {
    var select = new Select({options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<select><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>');
  });

  it('should render value/label options', function() {
    var select = new Select({options: [
      {value: '1', label: 'one'},
      {value: '2', label: 'two'},
      {value: '3', label: 'three'}
    ]});
    expect(normalizeReact(select)).to.eql(
      '<select><option value="1">one</option><option value="2">two</option><option value="3">three</option></select>');
  });

  it('should mark selected value', function() {
    var select = new Select({value: '1', options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<select><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>');
  });

  it('should wrap with label', function() {
    var select = new Select({label: 'Test', value: '1', options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<div class="field"><label for="*">Test</label><select id="*"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>');
  });

  it('should wrap with containerClass', function() {
    var select = new Select({label: 'Test', value: '1', options: ['1','2','3'], containerClass: 'foo'});
    expect(normalizeReact(select)).to.eql(
      '<div class="field"><label for="*">Test</label><div class="foo"><select id="*"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div></div>');
  });
});
