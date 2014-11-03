#!/bin/bash

set -o errexit
set -o pipefail

apt-get -y update
apt-get -y upgrade

apt-get install -y --fix-missing rabbitmq-server mpd libavahi-compat-libdnssd-dev alsa-utils
