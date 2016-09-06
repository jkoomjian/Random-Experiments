Installation Instructions:

Before starting:
> Set the env vars in .bashrc
> Verify mysql uses utf8 and innodb as default
  > show variables like 'char%';
  > show variables like 'default_storage_engine';

Steps for setting up this project:
> sudo apt-get install imagemagick
> make sure the server can has imagemagick on it's path: http://www.modrails.com/documentation/Users%20guide%20Nginx.html#passenger_set_cgi_param
> sudo bundle install
> rails g cms:install bcms_blog	# install blog addon
> rake db:migrate
> rake db:seed
* Add member group in cms admin
* Create the blog
* Set up a daily cron job for update_expired_accounts, db backup
* set STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY environment variables

Hardcode:
* pages + urls
* portlet instances
* routes
* lesson category type
* member group