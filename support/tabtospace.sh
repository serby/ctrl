files=`find . -type f -name "*.js" -o -name "*.jade" -o -name "*.json"`
for file in $files
do
  expand -t 2 "$file" > /tmp/expandtmp && mv /tmp/expandtmp "$file"
done