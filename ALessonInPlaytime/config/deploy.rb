# require 'bundler/capistrano'
# load 'deploy/assets'

set :application, "A Lesson In Playtime"

set :scm, :git
set :repository,  "https://jkoomjian@bitbucket.org/jkoomjian/alessoninplaytime.git"
# set :repository,  "git@github.com:you-github-username/your-app-repository.git"
set :branch, "master"

set :deploy_to, "/home/wwwadmin/site"
set :user, "wwwadmin"
set :password, Capistrano::CLI.password_prompt("Enter #{user} password: ")
set :group, "wwwadmin"
set :use_sudo, false
set :rails_env, "production"
server "107.170.229.191", :app, :web, :db, :primary => true

set :deploy_via, :copy
set :keep_releases, 5
default_run_options[:pty] = true


namespace :deploy do
  task :start do ; end
  task :stop do ; end

  desc "Symlink shared config files"
  task :symlink_config_files do
    begin
      run "rm -f #{release_path}/config/database.yml"
    rescue Exception => error
    end

    run "ln -s #{deploy_to}/shared/config/database.yml #{current_path}/config/database.yml"
  end

  # BrowserCMS really does not like having the tmp/views dir emptied when we deploy the new version
  # symlink to the tmp/views, which is stored in shared
  desc "Copy over tmp/views dir"
  task :symlink_tmp_views do
    run "ln -s #{deploy_to}/shared/bcms_tmp_views #{deploy_to}/current/tmp/views"
  end

  desc "Restart applicaiton"
  task :restart do
    run "touch #{ File.join(current_path, 'tmp', 'restart.txt') }"
  end
end

after "deploy", "deploy:symlink_config_files"
after "deploy", "deploy:symlink_tmp_views"
after "deploy", "deploy:restart"
after "deploy", "deploy:cleanup"