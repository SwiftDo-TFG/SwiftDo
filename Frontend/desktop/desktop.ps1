cd ../
npm install
npx expo export -p web
rm -r ./desktop/dist
cp -r ./dist ./desktop
cd desktop
npm install
npm run make