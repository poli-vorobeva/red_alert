### This is a copy of the game Red Alert. Group project
   -  WebSocket server. Creating rooms for the game, adding and removing users, the ability to watch the game as spectator.
   -  Multiplayer and singleplayer. 
   -  Bots with game logic
   -  Written game scenario, adding new objects, battles, killing units and buildings. Units have a logic, when the enemy approaches, they attack him, when they lose their target, they look for a new one.
   -  Different units have different target, attack power, radius (depending on unit type)
   -  The algorithm for moving units has been implemented
   -  Disadvantages: non-optimized image, display speed decreases over time. We were unable to optimize the canvas, which is why the project was not completed

This project has been created using **webpack-cli**, you can now run

```
npm run build
```

or

```
yarn build
```

to bundle your application
