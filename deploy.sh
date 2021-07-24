# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the main branch
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      # Runs a single command using the runners shell
      - name: Build dist
        run: |
          set -e
          npm install
          git config --global user.name 'Github Action'
          git config --global user.email 'github@github.com'
          npx @compodoc/compodoc -p tsconfig.json
          cd documentation
          git init
          git add .
          git commit -m 'deploy'
          git checkout -b gh-pages
          git push -f https://github.com/AldeonMoriak/task-tracker-backend.git gh-pages
