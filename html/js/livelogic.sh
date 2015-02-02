#!/bin/sh
# Use ps -ef to make sure DirWatcher for LiveLogic is running - if not, run it
if ps -ef | grep "livelogic.js" | grep -v grep;
then
echo "livelogic.js already running."
else
node /vagrant/html/js/livelogic.js
fi