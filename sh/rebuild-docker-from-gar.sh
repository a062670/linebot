source /sh/.env

sudo docker stop linebot
sudo docker rm linebot
sudo docker rmi -f linebot

sudo docker pull $GAR/linebot:latest

cd /var/projects/linebot/docker/
sudo docker-compose up -d

sudo docker system prune --force