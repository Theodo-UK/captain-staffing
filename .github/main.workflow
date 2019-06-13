workflow "CI" {
  resolves = [
    "Lint",
    "Test",
    "Build",
  ]
  on = "push"
}

workflow "CD" {
  on = "push"
  resolves = [
    "Deploy",
  ]
}

action "Install dependencies" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Dev environment" {
  uses = "Borales/actions-yarn@master"
  args = "env:dev"
}

action "Prod environment" {
  uses = "Borales/actions-yarn@master"
  args = "env:prod"
}

action "Lint" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies", "Dev environment"]
  args = "lint"
}

action "Test" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies", "Dev environment"]
  args = "test"
}

action "Build" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies", "Prod environment"]
  args = "build"
}

action "Deploy" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = ["Build", "Master"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "build/"
  }
}
