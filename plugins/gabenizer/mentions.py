#!/bin/python2
# Script that replies to username mentions.

import time
import os
import cPickle
import sys
import traceback
import numpy

from PIL import Image
from urlparse import urlparse

import gabenizer


IMG = "http://i.4cdn.org/r9k/1463377581531.jpg"

def main():
        image = gabenizer.process_image(IMG, 'gabenface.png')
        image.save("whatfuck.png")
                


if __name__ == "__main__":
    main()

    
    
