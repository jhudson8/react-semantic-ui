Form
====

A form control which reacts to a loading state

Properties
----------
- ***loading***: true if the form is in a loading state
- ***className***: additional form class name ("ui form segment") will already be applied

Overrides
---------
- ***classNames.Form***: class name to be added to all; default is ```segment```
- ***mixins.Form***: default mixins that should be applied

Example
--------
    var Form = rsui.form.Form;
    <Form className="my-class" loading={isLoading} onSubmit={handleSubmit}> ... </Form>