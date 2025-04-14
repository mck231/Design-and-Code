## Steps to Create a React App

* Download Git.
* Download Node.js (this includes npm, the Node.js package manager).
* Clone the repository:
    * `git clone https://github.com/mck231/Design-and-Code`
* Install Vite:
    * `npm create vite@latest ./`
* Select `React-swc` when prompted.
* Review the starting template.

### Key Files and Configuration

* **package.json**:
    * Show and explain the dependencies, scripts (start, build, etc.).
* **Vite Configuration (vite.config.js)**:
    * Discuss basic configuration.
    * Example: Change the default port to 3000:
        ```javascript
        export default {
          server: {
            port: 3000,
          },
        };
        ```
* **index.html**:
    * Explain that this is the entry point of the application.
    * Show the `<div id="root"></div>` where the React application is mounted.
* **main.jsx**:
    * Explain that this is the main JavaScript file.
    * Show how it renders the `App` component into the `root` element.
* **App.jsx**:
    * Explain that this is the root component of the React application.
    * Introduce JSX.

### JSX

* Explain what JSX is (JavaScript XML).
* Show how JSX allows you to write HTML-like syntax in your JavaScript code.
* Use Babel REPL to demonstrate JSX transformation:
    * [Babel REPL](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBAQgQzGApgJxgXhgCgJRYB8MAPABYCMhAKmQJYQwMwIwBGSqaAhCQPSVCQA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.27.0&externalPlugins=&assumptions=%7B%7D)
    * Show examples of JSX and how it is transformed into JavaScript.

### State

* Introduce the concept of state in React.
* Explain how state allows components to manage and update data.
* You could create a simple example using `useState`.

### Components

* Create a `Header` component.
* Create a `Footer` component.
* Show how to import and use these components in `App.jsx`.

### Deployment with Netlify

* Go to [Netlify Documentation](https://docs.netlify.com/frameworks/react/).
* Explain the deployment process.
* **Netlify Build Settings:**
    * Runtime: Not set
    * Base directory: /
    * Package directory: Not set
    * Build command: `npm run build`
    * Publish directory: `/dist`
    * Functions directory: `netlify/functions`
    * Deploy log visibility: Logs are public
    * Build status: Active