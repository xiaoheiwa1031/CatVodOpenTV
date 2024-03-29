cd nodejs
cp src/index.config.js src/index.config.js.bak
sed -i 's#http://192.168.50.60:4567/vod1#VOD1_URL#' src/index.config.js
sed -i 's#http://192.168.50.60:4567/vod#VOD_URL#' src/index.config.js
sed -i 's#http://192.168.50.60:4567/bilibili#BILIBILI_URL#' src/index.config.js
sed -i 's#http://192.168.50.60:4567/youtube#YOUTUBE_URL#' src/index.config.js

npm run build
mv src/index.config.js.bak src/index.config.js
cd ..

cp config_open.json config_open.bak.json
sed -i 's/alist-4945272b-658f-4be7-a20e-98af1c2be973kAUC1tcZ7EsJi4PyovGRwPVReLto0XxKA4QXfciAR4W4G0XwqWRLr1euFY9W2NnE//' \
 config_open.json

node build.js && \
mv config_open.bak.json config_open.json && \
scp cat_open.zip ubuntu@1.117.140.221:/var/www/alist/ && \
mkdir -p Payload/Runner.app/Frameworks/App.framework/flutter_assets/asset/js/ && \
rm -rf Payload/Runner.app/Frameworks/App.framework/flutter_assets/asset/js/* && \
cp -r dist/* Payload/Runner.app/Frameworks/App.framework/flutter_assets/asset/js/ && \
zip -ur /home/harold/Downloads/cat.ipa Payload/Runner.app/Frameworks/App.framework/flutter_assets/asset/js/ && \
cp cat_open.zip /home/harold/workspace/alist-tvbox/data/cat.zip && \
mv cat_open.zip /home/harold/Downloads/ && \
echo "cat.ipa updated"

# mkdir -p assets/flutter_assets/asset/js/ && \
# rm -rf assets/flutter_assets/asset/js/* && \
# cp -r dist/* assets/flutter_assets/asset/js/ && \
# zip -ur /home/harold/Downloads/cat.apk assets/flutter_assets/asset/js/ && \
# echo "cat.apk updated"
