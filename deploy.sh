set -e

# build
npx @compodoc/compodoc -p tsconfig.json

# navigate into the build output directory
cd documentation

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add .
git commit -m 'deploy'
git checkout -b gh-pages

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/AldeonMoriak/task-tracker-backend.git gh-pages

cd -