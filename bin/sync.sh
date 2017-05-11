#!/bin/bash

ssh_open_conn(){
    mkdir -p ~/.ssh/ctl
    ssh -nNf -o ControlMaster=yes -o ControlPath="$HOME/.ssh/ctl/%L-%r@%h:%p" $1
    echo "connection ok"
}

ssh_close_conn(){
    ssh -O exit -o ControlPath="$HOME/.ssh/ctl/%L-%r@%h:%p" $1
}

synchronize(){
    rsync -e "ssh -o 'ControlPath=$HOME/.ssh/ctl/%L-%r@%h:%p'" -avq --partial --progress --exclude \".git\" $1 $2:~/$3
}

watch() {
    fswatch -o $1 | while read f; do synchronize $1 $2 $3 && echo "sync done"; done
}

current_dir="$(cd "$(dirname "$1")"; pwd)/$(basename "$1")"
echo "watch $current_dir";
echo "distant directory : $2:~/$3"
ssh_open_conn $2
trap "ssh_close_conn $2; exit" SIGINT SIGKILL
watch $current_dir $2 $3

