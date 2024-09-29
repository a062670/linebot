cd /var/projects/linebot/

source sh/.env

# 更新版控
sudo git fetch
sudo git reset --hard HEAD
sudo git merge '@{u}'

# 建立 image
GIT_COMMIT=$(sudo git rev-parse HEAD)
sudo docker build --build-arg GIT_COMMIT=$GIT_COMMIT -t linebot:$GIT_COMMIT .

# 推到 Google Cloud Artifact Registry
sudo docker tag linebot:$GIT_COMMIT $GAR/linebot:$GIT_COMMIT
sudo docker tag linebot:$GIT_COMMIT $GAR/linebot:latest
sudo docker push $GAR/linebot:$GIT_COMMIT
sudo docker push $GAR/linebot:latest

# 清除本地 image
sudo docker rmi -f linebot:$GIT_COMMIT