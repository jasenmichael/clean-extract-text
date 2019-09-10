#!/bin/bash

convert -quiet $1 +repage - |\
convert -respect-parenthesis \( - -colorspace gray -type grayscale -normalize \) \( -clone 0 -colorspace gray -negate -lat 30x30+12% -contrast-stretch 0 \) -compose copy_opacity -composite -fill white -opaque none -alpha off -sharpen 0x2 $2 &&
rm -rf tmp/tmp.mpc && rm -rf tmp/tmp.cache
# exit 0