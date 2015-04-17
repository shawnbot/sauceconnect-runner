# sauceconnect-runner
Run [Sauce Connect] around any script, Node or not.

1. Install it with npm:

    ```sh
    npm install [-g] sauceconnect-runner
    ```

2. Set your [Sauce Labs] username and access key as environment variables:

    ```sh
    export SAUCE_USERNAME=your-username
    export SAUCE_ACCESS_KEY=your-access-key
    ```

2. Run your Selenium tests with Sauce Connect in the background:

    ```sh
    sc-run npm test
    ```

## How does it work?
If you run `sc-run` without any arguments, it simply runs the appropriate
[Sauce Connect] binaries for your system and keeps the connection open so you
can run Selenium tests on Sauce Labs against `localhost`.

If you run it with arguments, it will attempt to spawn them as a child process
and close the Sauce Connect tunnel when the child exits. That's it!

[Sauce Connect]: https://docs.saucelabs.com/reference/sauce-connect/
[Sauce Labs]: https://saucelabs.com/
