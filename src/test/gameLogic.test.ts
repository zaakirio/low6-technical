import { describe, it, expect } from 'vitest';
import {
    instantiateGrid,
    instantiateInfection,
    infectCells,
    getCellCounts,
    CellState,
    InfectionState
} from '../gameLogic';

describe('Game Logic Tests', () => {
    describe('instantiateGrid', () => {
        it('should create a grid of specified size filled with healthy cells', () => {
            const size = 3;
            const grid = instantiateGrid(size);
            
            expect(grid).toHaveLength(size);
            grid.forEach(row => {
                expect(row).toHaveLength(size);
                row.forEach(cell => expect(cell).toBe('H'));
            });
        });
    });

    describe('instantiateInfection', () => {
        it('should infect specified cells and initialize timers', () => {
            const grid = instantiateGrid(3);
            const infectedCells = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
            const result = instantiateInfection(grid, infectedCells);

            expect(result.grid[0][0]).toBe('I');
            expect(result.grid[1][1]).toBe('I');
            expect(result.grid[0][1]).toBe('H');
            expect(result.infectedCells).toEqual(infectedCells);
            expect(result.infectionTick.size).toBe(2);
            expect(result.infectionTick.get('0,0')).toBe(0);
            expect(result.infectionTick.get('1,1')).toBe(0);
        });
    });

    describe('infectCells', () => {
        it('should spread infection to adjacent cells', () => {
            const grid = instantiateGrid(3);
            const infectedCells = [{ x: 1, y: 1 }];
            const initialInfection = instantiateInfection(grid, infectedCells);
            const initialState: InfectionState = {
                ...initialInfection,
                recoveryTime: 3
            };

            const nextState = infectCells(initialState);

            // Center cell should still be infected
            expect(nextState.grid[1][1]).toBe('I');
            // Adjacent cells should be infected
            expect(nextState.grid[0][1]).toBe('I');
            expect(nextState.grid[1][0]).toBe('I');
            expect(nextState.grid[1][2]).toBe('I');
            expect(nextState.grid[2][1]).toBe('I');
        });

        it('should recover cells after specified recovery time', () => {
            const grid = instantiateGrid(3);
            const infectedCells = [{ x: 1, y: 1 }];
            const initialInfection = instantiateInfection(grid, infectedCells);
            const initialState: InfectionState = {
                ...initialInfection,
                recoveryTime: 2
            };

            const stateAfterFirstTick = infectCells(initialState);
            expect(stateAfterFirstTick.grid[1][1]).toBe('I');

            const stateAfterSecondTick = infectCells(stateAfterFirstTick);
            expect(stateAfterSecondTick.grid[1][1]).toBe('R');
        });

        it('should not infect recovered cells', () => {
            const grid = instantiateGrid(3);
            const infectedCells = [{ x: 1, y: 1 }];
            const initialInfection = instantiateInfection(grid, infectedCells);
            const initialState: InfectionState = {
                ...initialInfection,
                recoveryTime: 1
            };

            const stateAfterFirstTick = infectCells(initialState);
            expect(stateAfterFirstTick.grid[1][1]).toBe('R');

            const newInfectedCell = { x: 0, y: 1 };
            stateAfterFirstTick.grid[0][1] = 'I';
            stateAfterFirstTick.infectedCells = [newInfectedCell];
            stateAfterFirstTick.infectionTick.set('0,1', 0);

            const stateAfterSecondTick = infectCells(stateAfterFirstTick);
            expect(stateAfterSecondTick.grid[1][1]).toBe('R'); 
        });
    });

    describe('getCellCounts', () => {
        it('should correctly count cell states', () => {
            const grid: CellState[][] = [
                ['H', 'I', 'R'],
                ['I', 'H', 'I'],
                ['R', 'R', 'H']
            ];

            const counts = getCellCounts(grid);
            expect(counts.healthy).toBe(3);
            expect(counts.infected).toBe(3);
            expect(counts.recovered).toBe(3);
        });
    });
}); 