npm install --global @ui5/cli
--------------------------------webapp
--------------------------------package.json
{
  "name": "ui5.walkthrough",
  "version": "1.0.0",
  "description": "UI5 TypeScript Walkthrough",
  "scripts": {
      "start": "ui5 serve -o index.html"
  }
}
--------------------------------webapp/manifest.json
{
  "_version": "1.65.0",
  "sap.app": {
    "id": "ui5.walkthrough",
    "type": "application",
    "title": "UI5 TypeScript Walkthrough",
    "applicationVersion": {
      "version": "1.0.0"
    }
  }
}
--------------------------------cmd
ui5 init
npm install typescript --save-dev
npm install ui5-middleware-livereload ui5-middleware-serveframework ui5-tooling-transpile --save-dev
ui5 use OpenUI5
ui5 add sap.ui.core themelib_sap_horizon
npm install @types/openui5 --save-dev
ui5 add sap.m
npm i -D ui5-middleware-simpleproxy
npm install @ui5/ts-interface-generator --save-dev
npm i -D local-web-server
--------------------------------ui5.yaml
builder:
  customTasks:
  - name: ui5-tooling-transpile-task
    afterTask: replaceVersion
server:
  customMiddleware:
  - name: ui5-tooling-transpile-middleware
    afterMiddleware: compression
  - name: ui5-middleware-serveframework
    afterMiddleware: compression
  - name: ui5-middleware-simpleproxy
    afterMiddleware: compression
    mountPath: /V2
    configuration:
      baseUri: "https://services.odata.org"
  - name: ui5-middleware-livereload
    afterMiddleware: compression
--------------------------------tsconfig.json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "es2022",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "allowJs": true,
    "strict": true,
    "strictNullChecks": false,
    "strictPropertyInitialization": false,
    "rootDir": "webapp",
    "baseUrl": "./",
    "paths": {
      "ui5/walkthrough/*": [
        "webapp/*"
      ]
    }
  },
  "include": [
    "webapp/**/*"
  ]
}
--------------------------------package.json
"scripts": {
    "build": "ui5 build --all --clean-dest",
    "serve-dist": "ws --compress -d dist --open"
  }
--------------------------------.gitignore
node_modules/
package-lock.json
dist/
