# Pacman

Simple pacman, with machine learning.

NEAT algorithm from https://github.com/xviniette/FlappyLearning  
Pacman sprites from https://www.spriters-resource.com/arcade/pacman/sheet/52631/  
Pacman sounds from https://github.com/masonicGIT/pacman

## Install

0. `cd client`
0. `npm install`
0. `cd ../server`
0. `npm install`
0. `npm run dev`
0. go to localhost

## About

Machine learning using neuroevolution to perform pathfinding for pacman.  
Currently, it tries to learn using a single ghost, blinky, and the resulting score is the amount of dots eaten.  
By using current settings, it is able to get around 120 dots eaten at around generation 50-150.  
Given a longer period of time, around 1000 gens, it seems that the network can be improved to around 200 dots.

## Controls

Control volume, pause and resume, and play speed with dat.gui controller.