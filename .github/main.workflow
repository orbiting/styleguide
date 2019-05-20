workflow "Publish branches to S3" {
  on = "push"
  resolves = ["upload to S3"]
}

action "exclude master" {
  uses = "actions/bin/filter@46ffca7632504e61db2d4cb16be1e80f333cb859"
  args = "not branch master"
}

action "npm install" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "install"
  needs = ["exclude master"]
}

action "npm test" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "test"
  needs = ["npm install"]
}

action "npm build:lib" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "run build:lib"
  needs = ["npm test"]
}

action "npm pack" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = ["npm build:lib"]
  args = "pack"
}

action "upload to S3" {
  uses = "actions/aws/cli@efb074ae4510f2d12c7801e4461b65bf5e8317e6"
  needs = ["npm pack"]
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  args = "echo $S3_PATH/$PKG_NAME-`echo $GITHUB_REF | cut -d/ -f3`-`echo $GITHUB_SHA | cut -c-7`.tgz > /github/workspace/s3_filename && s3 cp $PKG_NAME-0.0.0-development.tgz s3://`cat /github/workspace/s3_filename` --acl public-read"
  env = {
    PKG_NAME = "project-r-styleguide"
    S3_PATH = "republik-assets-dev/npm"
  }
}

action "Slack notification" {
  uses = "Ilshidur/action-slack@master"
  secrets = ["SLACK_WEBHOOK"]
  args = "{{ GITHUB_ACTOR }} released: https://s3.eu-central-1.amazonaws.com/`cat /github/workspace/s3_filename`"
  env = {
    SLACK_OVERRIDE_MESSAGE = 'true'
  }
}
