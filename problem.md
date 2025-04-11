"Infection Spread Simulator" Problem
 
Problem Statement:
 
You're tasked with implementing an infection spread simulator in a 2D grid. Each cell in the grid represents a person who can be in one of three states:

H: Healthy

I: Infected

R: Recovered
 
Each turn (or "tick"), the infection spreads from infected people to adjacent healthy people (up/down/left/right). Infected people take n turns to recover. Once recovered, they can't be infected again.

Implement the core simulation logic.
 
Requirements:

Create a 2D grid of size rows x cols, with initial states.

Accept a list of initially infected coordinates.
 
Accept a recovery time n.
 
Simulate the infection spread over time.

After each tick, return the updated grid.

Allow querying the number of infected/healthy/recovered individuals at any point.
 
Example Input:
 
const grid = [

  ['H', 'H', 'H'],

  ['H', 'I', 'H'],

  ['H', 'H', 'H']

];
 
const recoveryTime = 2; // infected recover after 2 ticks

Tick 1:

[

  ['H', 'I', 'H'],

  ['I', 'I', 'I'],

  ['H', 'I', 'H']

]
 
Tick 2:

[

  ['I', 'I', 'I'],

  ['I', 'R', 'I'],

  ['I', 'I', 'I']

]
 
Tick 3:

[

  ['I', 'R', 'I'],

  ['R', 'R', 'R'],

  ['I', 'R', 'I']

]
 