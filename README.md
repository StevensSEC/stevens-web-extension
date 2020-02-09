# Stevens Web Extension
A portable, centralized hub for collecting, analyzing, and presenting data for Stevens students.

## Features
- Simple installation using your browser (Chrome, Firefox, etc.)
- Schedule tasks to complete automatically
- Use as a simple digital data store

## Contributing
**Downloads**
* [Visual Studio Code (VSCode)](https://code.visualstudio.com/download): code editor, supports everything needed for this project including Git integration, TypeScript support, and more
* [*Git](https://git-scm.com/downloads): CLI (command line interface) that allows you to work with other developers through repositories
* [*Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable): package installer for JavaScript modules (parallelized npm)

_* = required_

**Chrome Extensions**
* [Getting Started](https://developer.chrome.com/extensions/getstarted)
* [Chrome APIs](https://developer.chrome.com/extensions/api_index)
* [Example: Refined Github](https://github.com/sindresorhus/refined-github)

**Project Languages & Configuration**
* [TypeScript](https://www.typescriptlang.org/docs/home.html)
* [HTML](https://www.w3schools.com/html/)
* [Code Formatting & Linting](https://blog.theodo.com/2019/08/why-you-should-use-eslint-prettier-and-editorconfig-together/)

**Using Github**
* [Git Model](https://nvie.com/posts/a-successful-git-branching-model/): read this article to understand how working on features affects the repository and its contributors
* Git Terminology
    * Commit: a change to the codebase described by a message
    * Branch: a collection of files that your project uses to operate (`master` is the default branch with the latest changes)
    * Pull request (PR): a series of commits to be merged into a branch
## Project Setup
* Install [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions for VSCode
    * These extensions automatically format the code according to project specifications as you type
* If you have not already, clone (make a copy on your computer) the repository: `git clone https://github.com/StevensSEC/stevens-web-extension.git`
* Run `yarn install` to download all packages for the project
    * Use `yarn run` to see available commands for the project
    * You will likely be using `yarn dev` to run the project locally
## Steps to Making Changes
1. Get the latest code from the master branch: `git pull master`
2. Create a new branch: `git checkout -b <feature_name> master` (`-b` creates the branch, checkout switches to it)
    - Make sure you are on the master branch, and do not forget to pull from the remote (web) repository
3. Make any change(s): `git add -A` (alternatively, `git add <filename>`) followed by `git commit -m <message>` (the message should be one sentence describing your changes)
    - Try to do this step every time you make a change that has an impact on the project
4. Make a pull request to be reviewed: `git push origin <feature_name>`
    - Be sure to open the pull request using the link that shows up (`https://github.com/.../pull/new/<feature_name>`)
    - This will show up on the repository [here](https://github.com/adapap/stevens-web-extension/pulls)
5. Allow for someone to review your code, and then the change will be merged! Congratulations!

**Contact**

*Slack Workspace Link*
