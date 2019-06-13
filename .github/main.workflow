workflow "CI" {
  resolves = [
    "Lint",
    "Test",
  ]
  on = "push"
}

action "Install dependencies" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Lint" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "lint"
}

action "Test" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "test"
}

workflow "CD" {
  on = "push"
  resolves = [
    "Master",
    "Deploy",
  ]
}

action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Build" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install dependencies"]
  args = "build:ci"
}

action "Deploy" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = ["Build", "Master"]
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "build/"
  }
}
