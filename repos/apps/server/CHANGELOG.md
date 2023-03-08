# server 1.0.0 (2023-03-03)

### Bug Fixes

- move dotenv to prod deps ([f51d4f2](https://github.com/cryptobotnet/cryptobotnet/commit/f51d4f23861e0d811f0f5f4383c3e415b115b906))
- **okx-api:** refactor debug ([8ee0413](https://github.com/cryptobotnet/cryptobotnet/commit/8ee0413c6e47589ebc3717c63a4b066dbfdbeade))
- **server:** price alert styling ([f94d24b](https://github.com/cryptobotnet/cryptobotnet/commit/f94d24bb635ac53a5220713daaf8e145f7bdad08))

### Features

- add shared eslint and ts configs ([0487cf9](https://github.com/cryptobotnet/cryptobotnet/commit/0487cf9c5a97f21c77b7f447b2de3084ce2eec5a))
- **server:** add endpoint to subscribe instrument ([7af8e3f](https://github.com/cryptobotnet/cryptobotnet/commit/7af8e3f0172fc79aca69ffeb20afb75f3cf1290d))
- **server:** add route to unsubscribe from instrument ([0c3eacf](https://github.com/cryptobotnet/cryptobotnet/commit/0c3eacfa0354b64cfccdc0218557284db17c4a3e))
- **server:** rename api to server ([8688ccd](https://github.com/cryptobotnet/cryptobotnet/commit/8688ccd0b9bce0b02c00e248292013785f229f27))
- **server:** subscribe to instrument ([70be264](https://github.com/cryptobotnet/cryptobotnet/commit/70be264ffceba21eaa0451a2164fd7e5841374c7))

### Dependencies

- **redis-client:** upgraded to 1.0.0
- **web-sockets:** upgraded to 1.0.0
- **eslint-config-shared:** upgraded to 1.0.0
- **tsconfig-shared:** upgraded to 1.0.0

# web-sockets 1.0.0 (2023-03-03)

### Bug Fixes

- **web-sockets:** increase throttle timeout ([3a7a301](https://github.com/cryptobotnet/cryptobotnet/commit/3a7a301c581a58d3cbc27c6a1a468a623b8962ff))
- **web-sockets:** replace mark price channel with tickers channel ([7e1772e](https://github.com/cryptobotnet/cryptobotnet/commit/7e1772e2380974550059b4494f173928a78d0354))
- **web-sockets:** throttle sendTelegramPriceAlert ([28deeb1](https://github.com/cryptobotnet/cryptobotnet/commit/28deeb1b052ee2dc637c9eef7336af7bd99be28c))

### Features

- add shared eslint and ts configs ([0487cf9](https://github.com/cryptobotnet/cryptobotnet/commit/0487cf9c5a97f21c77b7f447b2de3084ce2eec5a))
- **web-sockets:** add getConnection ([9879306](https://github.com/cryptobotnet/cryptobotnet/commit/9879306e7dbbecd4fc64fe7f7884cf0af53f4e9e))
- **web-sockets:** add unsuscribe with event emitter ([b018e23](https://github.com/cryptobotnet/cryptobotnet/commit/b018e233fce7f6d3d5dd02b0383f7409ff77f719))
- **web-sockets:** add web-sockets ([1ba1d8e](https://github.com/cryptobotnet/cryptobotnet/commit/1ba1d8eb2e6f821fa04df10593bb1ad3ee9d8b5d))
- **web-sockets:** reconnect on close ([d68fdc5](https://github.com/cryptobotnet/cryptobotnet/commit/d68fdc5629dde003749a0b1aff8a5378593562c5))
- **web-sockets:** throttle onMarkPriceMessage ([6a9d5ab](https://github.com/cryptobotnet/cryptobotnet/commit/6a9d5abf4590686400552d462e715b7d84de5482))

### Dependencies

- **okx-api:** upgraded to 1.0.0
- **redis-client:** upgraded to 1.0.0
- **eslint-config-shared:** upgraded to 1.0.0
- **tsconfig-shared:** upgraded to 1.0.0
