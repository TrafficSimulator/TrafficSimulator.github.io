# TrafficSimulator
## CMSC178 FinalRequirement


A traffic simulator for Cebu and Mandaue City. 

This WebApp has a sample data and map integrated to it. 

To load the map just input "144.png" in the file to be loaded input box and click load.

You can copy and paste the data inside the 144.txt file for a pre-defined path of the map or you can just create a new path.

You can download the sample data and the Cebu and Manduae City maps [here](https://drive.google.com/folderview?id=0B61z34f6mUzrSTZjNmlKcW1XVFU&usp=sharing)

### Instructions to Create Path
  1. Open the Path Maker (index.html)
  2. Input the file name of the map and click "Load Map" Button (note: maps should be placed inside the app's maps folder which is located in /resources/maps)
  3. Add points using "Move Point" Button 
  4. Add Dead points using "Dead Point" Button 
  5. To add branch points user must first click the "Link Mode" button to enable and disable link mode. In this mode user can link branch points from a root point. First point that was clicked will be considered as the root points  and succeeding points clicked will be considered as branched points
  6. To show data user must click the "Show Data" and copy the data. This data will be pasted in the simulator.

  ##note: 
  
      (a) First addition of points will be considered an entry point (this is where cars appear and gets generated), 
    
      (b) succeeding points will be considered as move points (points where cars just passes by) unless specified as dead points, 
    
      (c) Point that is created after a dead point will also be considered as an entry point, 
    
      (d) Entry points will be nullified when it becomes a branch point

### Instructions to Simulate Traffic:
  1. Open Simulator (simulator.html)
  2. Input the file name of the map and load it
  3. To place the path data, user must click the "input data" button and paste the data that you've just copied from the Path maker into the Path Data Box and click Parse Data.
  4. Start the simulation by clicking the "Start" Button

### Instructions to Create Traffic Lights (current implementation requires difficult traffic light creation, this issue will be solve in the next iteration of the WebApp)
  1. Open Path maker and load a map
  2. Click a lane/s which you want your traffic light to control
  3. Click show data and copy the x and y position; the line looks like this --- "x":123,"y":184 ---- this is the point where your traffic light will be located
  4. Open trafficlight.js file in a text editor
  5. Replace the x and y position 
  6. The syntax for the traffic light is ---

          [{"points":[

            [{"x":__,"y":__,"status":__},{"x":__,"y":__,"status":__}], // this points are contolled by traffic light A, and this controls 2 lanes, to add more lanes just copy the syntax of the lane and comma separate it
           
            [{"x":__,"y":__,"status":__},{"x":__,"y":__,"status":__}], // this points are contolled by traffic light B
            
            [{"x":__,"y":__,"status":__},{"x":__,"y":__,"status":__}], // this points are contolled by traffic light C
           
            // Paste the traffic light syntax here
          
          ], "type":0},];
          
        status ---- true if the traffic light is a go signal and false if in stop
        
        type ---- 0 if a 3 lane intersection, if a 4 lane intersection
        
        {"x":__,"y":__,"status":__} ---- this syntax of a lane which contains the attribute of a lane
        
        [{"x":__,"y":__,"status":__},{"x":__,"y":__,"status":__}], ---- to add more traffic lights just copy this syntax and paste it below the last traffic light syntax
