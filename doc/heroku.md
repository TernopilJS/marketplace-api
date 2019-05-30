# Deploy on Heroku

Create [free Heroku account](https://dashboard.heroku.com) and create new app from dashboard.

Download, install and login into [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

Set and add the following buildpacks using heroku cli:
```bash
$ heroku buildpacks:set heroku/nodejs -a YOUR_HEROKU_PROJECT_NAME

$ heroku buildpacks:add heroku/jvm -a YOUR_HEROKU_PROJECT_NAME

$ heroku buildpacks:add https://github.com/alex-bezverkhniy/heroku-groovy-buildpack.git -a YOUR_HEROKU_PROJECT_NAME
```

Install [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) and provision it to your heroku app.

Open your heroku app `Settings` from dashboard and set following `Config Vars` from Heroku Postgres credentials:
```js
PGDATABASE
PGHOST
PGPASSWORD
PGPORT
PGUSER
PGSSL: TRUE // set to true
```
Also set the following `Config Vars`:
```
HOST: YOUR_HEROKU_PROJECT_NAME.herokuapp.com
```

### Cloudinary
To upload images or some other multimedia - create free account on [cloudinary](https://cloudinary.com/)
and paste your cloudinary configs into your heroku app `Config Vars`:
```
CLOUDINARY_NAME
CLOUDINARY_KEY
CLOUDINARY_SECRET
```

### Add the heroku remote to the git repository:
```bash
heroku git:remote -a test-new-app-then-remove
```

### Deploy your changes:
```bash
git push heroku master
```
or
```bash
git push heroku local_branch_name:master
```
