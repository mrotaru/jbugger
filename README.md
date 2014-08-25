# jBugger

Easy client-side feedback gathering tool.

Collects the following information:

- browser name and version
- operating system
- resolution (viewport size)

In addition, if `config.customInfo` is a function, it will be called and the
returned value will also be added to the `info` object. The collected
information is sent via an Ajax `POST` request.  

No external dependencies. Supports IE8 and above.
