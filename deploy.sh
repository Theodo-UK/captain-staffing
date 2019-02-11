#!/bin/bash
npm run env:save
npm run env:prod
npm run build
git checkout -B gh-pages
git add -f build
git commit -n -am "Rebuild website"
git filter-branch -f --prune-empty --subdirectory-filter build
git push -f origin gh-pages
git checkout -
npm run env:restore
