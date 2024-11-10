### `waitFor`

Provided `@testing-libary/react`, it keeps running the callback function repeatedly (with a small delay between attempts) until the assertion(s) inside it passes. The default behavior is to wait up to 1000ms (configurable via the `timeout` option), else the test automatically fails.

**For example:**

``` typeScript
await waitFor(() => {
  expect(screen.getByText('Item 1')).toBeInTheDocument();
  expect(screen.getByText('Item 2')).toBeInTheDocument();
});
```

`waitFor` in the above code block, will call the passed callback repeatedly until _all_ assertions pass at the same time or until the timeout is reached. If one or more assertions fail within the callback, it will keep trying again until everything passes or it times out.
