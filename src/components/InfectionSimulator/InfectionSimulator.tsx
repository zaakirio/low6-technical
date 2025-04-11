import React, { useState, useEffect } from 'react';
import { 
    coordinates, 
    InfectionState, 
    instantiateGrid, 
    instantiateInfection, 
    infectCells,
    getCellCounts 
} from '../../gameLogic';
import GameConfigModal from '../GameConfig/GameConfig';
import styles from './InfectionSimulator.module.css';

const InfectionSimulator: React.FC = () => {
    const [showConfig, setShowConfig] = useState(true);
    const [gridSize, setGridSize] = useState<number>(3);
    const [recoveryTime, setRecoveryTime] = useState<number>(2);
    const [initialInfected, setInitialInfected] = useState<coordinates[]>([]);
    const [state, setState] = useState<InfectionState | null>(null);

    const handleStartGame = (config: {
        gridSize: number;
        recoveryTime: number;
        initialInfected: coordinates[];
    }) => {
        setGridSize(config.gridSize);
        setRecoveryTime(config.recoveryTime);
        setInitialInfected(config.initialInfected);
        setShowConfig(false);
    };

    useEffect(() => {
        if (!showConfig) {
            const grid = instantiateGrid(gridSize);
            const initialInfection = instantiateInfection(grid, initialInfected);
            setState({
                grid: initialInfection.grid,
                infectedCells: initialInfection.infectedCells,
                recoveryTime,
                infectionTick: initialInfection.infectionTick
            });
        }
    }, [showConfig, gridSize, initialInfected, recoveryTime]);

    const handleNextTick = () => {
        if (state) {
            const newState = infectCells(state);
            setState(newState);
        }
    };

    const handleReset = () => {
        setShowConfig(true);
        setState(null);
    };

    return (
        <div className={styles.container}>
            <GameConfigModal 
                isOpen={showConfig} 
                onStart={handleStartGame} 
            />

            {state && (
                <>
                    <div className={styles.grid}>
                        {state.grid.map((row, y) => (
                            <div key={y} className={styles.row}>
                                {row.map((cell, x) => (
                                    <div 
                                        key={`${y}-${x}`} 
                                        className={`${styles.cell} ${styles[cell.toLowerCase()]}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.controls}>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleNextTick} className={styles.button}>
                                Next Tick
                            </button>
                            <button onClick={handleReset} className={styles.button}>
                                Reset
                            </button>
                        </div>
                        
                        <div className={styles.stats}>
                            <div>Healthy: {getCellCounts(state.grid).healthy}</div>
                            <div>Infected: {getCellCounts(state.grid).infected}</div>
                            <div>Recovered: {getCellCounts(state.grid).recovered}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InfectionSimulator; 