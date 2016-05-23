#!/bin/python2
# Script that replies to username mentions.

import time
import os
import cPickle
import sys
import traceback
import numpy
import sys

from PIL import Image
from urlparse import urlparse

import gabenizer


IMG = "http://i.4cdn.org/r9k/1463377581531.jpg"

def main():
		
        image = gabenizer.process_image(sys.argv[1], './plugins/gabenizer/gabenface.png')
        image.save("./plugins/gabenizer/whatfuck.png")
                


if __name__ == "__main__":
    main()

    
    
