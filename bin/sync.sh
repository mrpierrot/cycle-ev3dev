#!/bin/bash

ssh_open_conn(){
    port=22
    host=$(hostname -s)
    control_path="$HOME/.ssh/ctl/$host-$1:$port"
    if [[ ! -e $control_path ]]; then
        echo "try to connect to $1"  
        mkdir -p ~/.ssh/ctl
        ssh -nNf -o ControlMaster=yes -o ControlPath="$HOME/.ssh/ctl/%L-%r@%h:%p" $1
    fi
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

command=$1
echo "execute $command"

current_dir="$(cd "$(dirname "$2")"; pwd)/$(basename "$2")"

if [ "$command" = "watch" ]; then
    echo "watch $current_dir";
    echo "distant directory : $3:~/$4"
    ssh_open_conn $3
    echo "connection ok"
    trap "ssh_close_conn $3; exit" SIGINT SIGKILL
    synchronize $current_dir $3 $4
    watch $current_dir $3 $4
elif [ "$command" = "once" ]; then
    echo "read $current_dir";
    echo "distant directory : $3:~/$4"
    ssh_open_conn $3
    echo "connection ok"
    synchronize $current_dir $3 $4
    echo "sync done"
elif [ "$command" = "close" ]; then
    ssh_close_conn $2
fi


