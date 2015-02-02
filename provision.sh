#!/usr/bin/env bash
export DEBIAN_FRONTEND=noninteractive

sudo aptitude update -q

# nginx 
sudo aptitude install -q -y -f nginx

# php
sudo aptitude install -q -y -f php5-fpm php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcached php5-ming php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl php5-xcache

# git
sudo aptitude install -q -y -f git

# node
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo aptitude install -q -y -f nodejs

# npm
sudo aptitude install -q -y -f npm

# crontab
sudo aptitude install -q -y -f crontab

# build project
cd /vagrant/html
php composer.phar install
sudo crontab -u root /vagrant/html/schedule.cron

sudo rm /etc/nginx/sites-available/default
sudo touch /etc/nginx/sites-available/default

sudo cat >> /etc/nginx/sites-available/default <<'EOF'
server {
  listen   80;

  root /vagrant/html;
  index index.php index.html index.htm;

  # Make site accessible from http://localhost/
  server_name _;

  location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to index.html
    # http://blog.martinfjordvald.com/2011/02/nginx-primer-2-from-apache-to-nginx/ 
    # http://gluephp.com/documentation.html
    try_files $uri $uri/ /index.php$is_args$args;
  }

  location /doc/ {
    alias /usr/share/doc/;
    autoindex on;
    allow 127.0.0.1;
    deny all;
  }

  # redirect server error pages to the static page /50x.html
  #
  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
    root /vagrant/html;
  }

  # pass the PHP scripts to FastCGI server listening on /tmp/php5-fpm.sock
  #
  location ~ \.php$ {
    try_files $uri =404;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
  }

  # deny access to .htaccess files, if Apache's document root
  # concurs with nginx's one
  #
  location ~ /\.ht {
    deny all;
  }
}
EOF

sudo service nginx restart

sudo service php5-fpm restart
