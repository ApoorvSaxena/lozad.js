**lozad.js** is written in JavaScript.

#Setup
1. [Fork **lozad.js**](https://help.github.com/articles/fork-a-repo) and clone it on your system.
2. Create a new branch out off `master` for your fix/feature. `git checkout new-feature master`

#Things to remember

- Do not fix multiple issues in a single commit. Keep them one thing per commit so that they can be picked easily incase only few commits require to be merged.
- Before submitting a patch, rebase your branch on upstream `master` to make life easier for the merger.
- **DO NOT** add the library build (`dist/lozad.min.js`) in your commits.