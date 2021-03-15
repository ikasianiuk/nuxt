#!/bin/sh

npm run import-translations

rm "src/common/locales/EN CONTENT.json"

git add src/common/*

git commit -m "[Auto] Update Translations"

echo 'translations updated'

