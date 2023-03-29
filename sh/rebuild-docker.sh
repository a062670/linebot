cd /var/projects/linebot/
sudo git fetch
sudo git reset --hard HEAD
sudo git merge '@{u}'

sudo docker stop linebot
sudo docker rm linebot
sudo docker rmi -f linebot

sudo docker build -t linebot .

cd /var/projects/linebot/docker/
sudo docker-compose up -d
