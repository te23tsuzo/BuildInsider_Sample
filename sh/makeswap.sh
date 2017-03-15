#/bin/sh

dd if=/dev/zero of=/mnt/swap bs=50MB count=60
mkswap /mnt/swap
swapon /mnt/swap
free
