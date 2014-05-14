var inputComponents = rsui.input,
    Text = inputComponents.Text,
    TextArea = inputComponents.TextArea,
    Select = inputComponents.Select,
    RadioGroup = inputComponents.RadioGroup,
    Dropdown = inputComponents.Dropdown;

describe('Text', function() {
  it('should display as input only without a label', function() {
    var text = new Text({value: 'test'});
    expect(normalizeReact(text)).to.eql('<input type="text" class="" value="test">');
  });

  it('should display as field container with a label', function() {
    var text = new Text({value: 'test', label: 'Test'});
    expect(normalizeReact(text)).to.eql('<div class="field"><label for="*">Test</label><input id="*" type="text" class="" value="test"></div>');
  });

  it('should wrap in a container div', function() {
    var text = new Text({value: 'test', containerClass: 'foo'}, React.DOM.span({}, 'inner'));
    expect(normalizeReact(text)).to.eql(
      '<div class="foo"><input type="text" class="" value="test"><span>inner</span></div>');
  });
});

describe('TextArea', function() {
  it('should display with a value', function() {
    var text = new TextArea({defaultValue: 'test', className: "foo"});
    expect(normalizeReact(text)).to.eql('<textarea class="foo" value="test">test</textarea>');
  });
});

describe('Checkbox', function() {
  it('should display with a value', function() {
    var checkbox = new inputComponents.Checkbox({value: 'abc', defaultValue: true, className: "foo"});
    expect(normalizeReact(checkbox)).to.eql('<div class="ui checkbox"><input class="foo" value="abc" type="checkbox" checked></div>');
  });
  it('should display with a label', function() {
    var checkbox = new inputComponents.Checkbox({value: 'abc', label: "Label", defaultValue: true, className: "foo"});
    expect(normalizeReact(checkbox)).to.eql('<div class="ui checkbox"><input class="foo" id="*" value="abc" type="checkbox" checked><label for="*">Label</label></div>');
  });
});

describe('RadioGroup', function() {
  it('should render text only options', function() {
    var radioGroup = new RadioGroup({options: ['1','2','3']});
    expect(normalizeReact(radioGroup)).to.eql(
      '<div class="grouped fields inline"><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="1"><label for="*">1</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="2"><label for="*">2</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="3"><label for="*">3</label></div></div></div>');
  });

  it('should render value/label options', function() {
    var radioGroup = new RadioGroup({options: [
      {value: '1', label: 'one'},
      {value: '2', label: 'two'},
      {value: '3', label: 'three'}
    ]});
    expect(normalizeReact(radioGroup)).to.eql(
      '<div class="grouped fields inline"><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="1"><label for="*">one</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="2"><label for="*">two</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="3"><label for="*">three</label></div></div></div>');
  });

  it('should mark selected value', function() {
    var radioGroup = new RadioGroup({value: '1', options: ['1','2','3']});
    expect(normalizeReact(radioGroup)).to.eql(
      '<div class="grouped fields inline"><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="1" checked><label for="*">1</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="2"><label for="*">2</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="3"><label for="*">3</label></div></div></div>');
  });

  it('should wrap with label', function() {
    var radioGroup = new RadioGroup({label: 'Test', value: '1', options: ['1','2','3']});
    expect(normalizeReact(radioGroup)).to.eql(
      '<div class="field"><label for="*">Test</label><div class="grouped fields inline"><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="1" checked><label for="*">1</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="2"><label for="*">2</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="3"><label for="*">3</label></div></div></div></div>');
  });

  it('should wrap with containerClass', function() {
    var radioGroup = new RadioGroup({label: 'Test', value: '1', options: ['1','2','3'], containerClass: 'foo'});
    expect(normalizeReact(radioGroup)).to.eql(
      '<div class="field"><label for="*">Test</label><div class="foo grouped fields inline"><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="1" checked><label for="*">1</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="2"><label for="*">2</label></div></div><div class="field"><div class="ui radio checkbox"><input id="*" type="radio" value="3"><label for="*">3</label></div></div></div></div>');
  });
});

describe('Select', function() {
  it('should render text only options', function() {
    var select = new Select({options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<div class="ui dropdown"><select class=""><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>');
  });

  it('should render value/label options', function() {
    var select = new Select({options: [
      {value: '1', label: 'one'},
      {value: '2', label: 'two'},
      {value: '3', label: 'three'}
    ]});
    expect(normalizeReact(select)).to.eql(
      '<div class="ui dropdown"><select class=""><option value="1">one</option><option value="2">two</option><option value="3">three</option></select></div>');
  });

  it('should mark selected value', function() {
    var select = new Select({value: '1', options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<div class="ui dropdown"><select class=""><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div>');
  });

  it('should wrap with label', function() {
    var select = new Select({label: 'Test', value: '1', options: ['1','2','3']});
    expect(normalizeReact(select)).to.eql(
      '<div class="field"><label for="*">Test</label><div class="ui dropdown"><select id="*" class=""><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div></div>');
  });

  it('should wrap with containerClass', function() {
    var select = new Select({label: 'Test', value: '1', options: ['1','2','3'], containerClass: 'foo'});
    expect(normalizeReact(select)).to.eql(
      '<div class="field"><label for="*">Test</label><div class="foo ui dropdown"><select id="*" class=""><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div></div>');
  });
});

describe('Dropdown', function() {
  it('should render text only options', function() {
    var dropdown = new Dropdown({options: ['1','2','3']});
    expect(normalizeReact(dropdown)).to.eql(
      '<div class="ui dropdown floating"><input type="hidden"><div class="text"></div><i class="dropdown icon"></i><div class="menu"><div class="item" data-value="1">1</div><div class="item" data-value="2">2</div><div class="item" data-value="3">3</div></div></div>');
  });

  it('should render value/label options', function() {
    var dropdown = new Dropdown({options: [
      {value: '1', label: 'one'},
      {value: '2', label: 'two'},
      {value: '3', label: 'three'}
    ]});
    expect(normalizeReact(dropdown)).to.eql(
      '<div class="ui dropdown floating"><input type="hidden"><div class="text"></div><i class="dropdown icon"></i><div class="menu"><div class="item" data-value="1">one</div><div class="item" data-value="2">two</div><div class="item" data-value="3">three</div></div></div>');
  });

  it('should mark selected value', function() {
    var dropdown = new Dropdown({value: '1', options: ['1','2','3']});
    expect(normalizeReact(dropdown)).to.eql(
      '<div class="ui dropdown floating"><input type="hidden" value="1"><div class="text"></div><i class="dropdown icon"></i><div class="menu"><div class="item active" data-value="1">1</div><div class="item" data-value="2">2</div><div class="item" data-value="3">3</div></div></div>');
  });

  it('should wrap with label', function() {
    var dropdown = new Dropdown({label: 'Test', value: '1', options: ['1','2','3']});
    expect(normalizeReact(dropdown)).to.eql(
      '<div class="ui dropdown floating"><input type="hidden" value="1"><div class="text">Test</div><i class="dropdown icon"></i><div class="menu"><div class="item active" data-value="1">1</div><div class="item" data-value="2">2</div><div class="item" data-value="3">3</div></div></div>');
  });

  it('should wrap with containerClass', function() {
    var dropdown = new Dropdown({label: 'Test', value: '1', options: ['1','2','3'], containerClass: 'foo'});
    expect(normalizeReact(dropdown)).to.eql(
      '<div class="ui dropdown floating"><input type="hidden" value="1"><div class="text">Test</div><i class="dropdown icon"></i><div class="menu"><div class="item active" data-value="1">1</div><div class="item" data-value="2">2</div><div class="item" data-value="3">3</div></div></div>');
  });
});
