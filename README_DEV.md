# AUTOMATION HUB 🦾

## 📍 Requirements to build and run source code

- NodeJS, Python needs to be installed
<!-- Node gyp also use build tools (choose for C++):
https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools

````bash
npm config set msvs_version 2017
``` -->
- `WINDOWS`, RUN AS ADMIN:
```bash
npm install -g windows-build-tools
````

- `LINUX`:

```bash
sudo apt-get install libxtst-dev libpng++-dev
```

- `ALL OS`:

```bash
npm install -g node-gyp
```

```bash
npm i
```

<i>Go to node_modules/robotjs</i>

```bash
node-gyp rebuild
```

---

## TO BUILD

1. WEB

```bash
cd automation-web
npm run build
```

2. BACK

```bash
cd automation-back
```

Change build target to one of `os` - `windows` / `macos` / `linux`

to one of `arch` -
`x64`, `x32`, `arm64` (if `macos`, then not required)

```bash
"targets": [
      "node16-os-arch"
    ]
```

RUN 🏃‍♂️:

```bash
npm run linux-build
```

OR

```bash
npm run windows-build
```

OR

```bash
npm run mac-build
```

## TO 🏃‍♂️ LOCALLY

- BUILD WEB
- Go to BACK and RUN:

```bash
cd automation-back
```

```bash
npm start
```
