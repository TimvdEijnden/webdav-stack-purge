printenv | grep -v “WEBDAV” >> /home/node/.env
chown root:root /etc/crontabs/root
/usr/sbin/crond -f