FROM node:8-alpine

COPY ./cron/root /etc/crontabs/root
COPY ./scripts /home/node/scripts

RUN cd /home/node/scripts && npm install
RUN mkdir /var/log/cron/ && touch /var/log/cron/cron.log

RUN chmod +x /home/node/scripts/start.sh && chown root:root /home/node/scripts/start.sh

CMD  /home/node/scripts/start.sh