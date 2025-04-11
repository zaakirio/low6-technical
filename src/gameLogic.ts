// export const isInfected = () => {

// }

// export const isHealthy = () => {
    
// }
// export const isRecovered = () => {
    
// }
export type CellState = 'H' | 'I' | 'R';

export type coordinates = {
    x: number;
    y: number;
}

export type InfectionState = {
    grid: CellState[][];
    infectedCells: coordinates[];
    recoveryTime: number;
    infectionTick: Map<string, number>;
}

export const instantiateInfection = (grid: CellState[][], infectedCells: coordinates[]): InfectionState => {
    // Create a deep copy of the grid
    const newGrid = grid.map(row => [...row]);
    const infectionTick = new Map<string, number>();
    
    infectedCells.forEach((cell) => {
        newGrid[cell.y][cell.x] = 'I';
        infectionTick.set(`${cell.y},${cell.x}`, 0);
    });
    
    return { 
        grid: newGrid, 
        infectedCells: [...infectedCells], 
        infectionTick,
        recoveryTime: 0 // This will be set by the caller
    };
}

export const instantiateGrid = (gridSize: number): CellState[][] => {
    return Array.from({length: gridSize}, () => Array(gridSize).fill('H'));
}

//If a cell is infected, it will infect the cells around it
export const infectCells = (state: InfectionState): InfectionState => {
    const { grid, recoveryTime, infectionTick } = state;
    
    // Create deep copies of the state
    const newGrid = grid.map(row => [...row]);
    const newInfectionTick = new Map(infectionTick);
    const newInfectedCells: coordinates[] = [];
    
    const directions = [
        { x: 0, y: -1 },  // up
        { x: 1, y: 0 },   // right
        { x: 0, y: 1 },   // down
        { x: -1, y: 0 }   // left
    ];

    // First, update ticks for all infected cells in the grid
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'I') {
                const key = `${y},${x}`;
                const currentTick = newInfectionTick.get(key) || 0;
                newInfectionTick.set(key, currentTick + 1);

                // Check if cell should recover
                if (currentTick + 1 >= recoveryTime) {
                    newGrid[y][x] = 'R';
                    newInfectionTick.delete(key);
                } else {
                    // If not recovered, add to infected cells for spreading
                    newInfectedCells.push({ x, y });
                }
            }
        });
    });

    // Then, spread infection from all infected cells
    newInfectedCells.forEach(cell => {
        directions.forEach(dir => {
            const newX = cell.x + dir.x;
            const newY = cell.y + dir.y;

            if (newX >= 0 && newX < newGrid.length && newY >= 0 && newY < newGrid.length) {
                if (newGrid[newY][newX] === 'H') {
                    newGrid[newY][newX] = 'I';
                    newInfectionTick.set(`${newY},${newX}`, 0);
                }
            }
        });
    });

    return {
        grid: newGrid,
        infectedCells: newInfectedCells,
        recoveryTime,
        infectionTick: newInfectionTick
    };
}

export const getCellCounts = (grid: CellState[][]): { healthy: number, infected: number, recovered: number } => {
    let healthy = 0, infected = 0, recovered = 0;
    
    grid.forEach(row => {
        row.forEach(cell => {
            switch(cell) {
                case 'H': healthy++; break;
                case 'I': infected++; break;
                case 'R': recovered++; break;
            }
        });
    });

    return { healthy, infected, recovered };
}

