# Contributing to lozad.js
:sparkles:First off, thanks for taking the time to contribute!:sparkles:

Now, take a moment to be sure your contributions make sense to everyone else.
These are just guidelines, not rules.
Use your best judgment, and feel free to propose changes to this document in a pull request.

## How can I contribute?

### Using Lozad.js?
Share with us, and we'll mention it on the project homepage. When adding site to the *list of sites using Lozad.js*, please mention where to verify this in the PR description.

### Improve documentation

As a user of Lozad.js, you're the perfect candidate to help us improve our documentation. Typo corrections, error fixes, better explanations, more examples, etc. Open issues for things that could be improved. Anything. Even improvements to this document.

### Improve issues

Some issues are created with missing information, not reproducible, or plain invalid. Help make them easier to resolve. Handling issues takes a lot of time that we could rather spend on fixing bugs and adding features.

### Give feedback on issues

We're always looking for more opinions on discussions in the issue tracker. It's a good opportunity to influence the future direction of Lozad.js

## Reporting Issues

- Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](https://github.com/ApoorvSaxena/lozad.js/issues).
- If not, just open a [new clear and descriptive issue](https://github.com/ApoorvSaxena/lozad.js/issues/new).
- Use a clear and descriptive title.
- Include as much information as possible: Steps to reproduce the issue, error message, Browser version, operating system, etc.
- The more time you put into an issue, the more we will.

## Submitting pull requests

- Non-trivial changes are often best discussed in an issue first, to prevent you from doing unnecessary work.
- For ambitious tasks, you should try to get your work in front of the community for feedback as soon as possible. Open a pull request as soon as you have done the minimum needed to demonstrate your idea. At this early stage, don't worry about making things perfect, or 100% complete. Add a [WIP] prefix to the title, and describe what you still need to do. This lets reviewers know not to nit-pick small details or point out improvements you already know you need to make.
- New features should be accompanied with tests and documentation.
- Don't include unrelated changes.
- Lint and test before submitting the pull request.
- Make the pull request from a [topic branch](https://github.com/dchelimsky/rspec/wiki/Topic-Branches), not master.
- Use a clear and descriptive title for the pull request and commits.
- Write a convincing description of why we should land your pull request. It's your job to convince us. Answer "why" it's needed and provide use-cases.
- You might be asked to do changes to your pull request. There's never a need to open another pull request. [Just update the existing one.](https://github.com/RichardLitt/docs/blob/master/amending-a-commit-guide.md)

## Code Style
Follow the [xo](https://github.com/sindresorhus/xo) style.
Using two spaces for identation and no [semicolons](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding).

## Commit Message Emoji

Every commit is important.
So let's celebrate each and every commit with a corresponding emoji! :smile:

### Which Emoji to Use? :confused:

Commit Type | Emoji
----------  | -------------
Initial Commit | :tada: `:tada:`
Improve the format/structure of the code | :art: `:art:`
Improving performance | :racehorse: `:racehorse:`
Writing docs | :memo: `:memo:`
Fix a bug | :bug: `:bug:`
Remove code or files | :fire: `:fire:`
Fix CI build | :green_heart: `:green_heart:`
Deal with security | :lock: `:lock:`
Upgrade dependencies | :arrow_up: `:arrow_up:`
Downgrading dependencies | :arrow_down: `:arrow_down:`
Add tests | :umbrella: `:umbrella:`
Improving accessibility | :wheelchair: `:wheelchair:`
Add new features | :sparkles: `:sparkles:`
Refactoring | :package: `:package:`
Other | [Be creative](http://www.emoji-cheat-sheet.com/)

## Scripts
The follow scripts are available when you develop.

- `npm run lint` - Lint the files.
- `npm run build` - Build the package.
- `npm run test` - Test.