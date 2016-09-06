# S3 Backup Task for MySQL
# Assumes InnoDB tables
# Database User needs the "reload" permission on the database (for --flush-logs in mysqldump)
#
# Stores files in Amazon S3 using the excellent AWS Gem: http://amazon.rubyforge.org/
# For information about Amazon S3: http://aws.amazon.com/s3
#
# Installation
# 1) Install AWS-SDK Gem
# 2) Enter your S3 Bucket, access_key_id and secret_access_key in this file
# 3) Run (rake db:backup)
#
# Inspired by code from:
#   http://blog.craigambrose.com/articles/2007/03/01/a-rake-task-for-database-backups
#   http://www.rubyinside.com/advent2006/15-s3rake.html

namespace :db do
  # require "aws/s3"
  require 'aws-sdk'

  desc "Backup database to Amazon S3"

  task :backup => :environment do
    begin

      s3 = AWS::S3.new(
        :access_key_id     => Rails.application.config.s3_access_key_id,
        :secret_access_key => Rails.application.config.s3_secret_access_key
      )

      bucket = s3.buckets[Rails.application.config.s3_bucket]

      db_config = ActiveRecord::Base.configurations[Rails.env]

      backup_path = "db/backup"
      #File.makedirs(backup_path)

      date = Time.now.strftime("%Y%m%d")
      file_name = "#{Rails.env}_#{db_config['database']}_#{date}.sql.gz"
      backup_file = File.join(backup_path, file_name)
      file_name = "db_backups/#{file_name}"

      sh "mysqldump -u #{db_config['username']} -p#{db_config['password']} --single-transaction --flush-logs --add-drop-table --add-locks --create-options --disable-keys --extended-insert --quick #{db_config['database']} | gzip -c > #{backup_file}"
      puts "Created backup: #{file_name}"

      puts "Storing file in S3: #{bucket.name}/#{file_name}"
      # AWS::S3::S3Object.store(file_name, open(backup_file), Rails.application.config.s3_bucket)
      bucket.objects.create(file_name, File.open(backup_file, "rb"))

      # Delete backup file
      File.delete(backup_file)

      # Only keep 10 backups on Amazon S3
      delete_date = (Time.now - 10.day).strftime("%Y%m%d")
      delete_file_name = "db_backups/#{Rails.env}_#{db_config['database']}_#{delete_date}.sql.gz"
      puts "Delete file in S3: #{bucket.name}/#{delete_file_name}"
      bucket.objects.delete(delete_file_name)

      puts "Backup Complete"
    rescue StandardError => error
      puts error.message
    end
  end
end
