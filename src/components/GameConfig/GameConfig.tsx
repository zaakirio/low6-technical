import React, { useState } from 'react';
import { coordinates } from '../../gameLogic';
import styles from './GameConfig.module.css';

interface GameConfigModalProps {
    isOpen: boolean;
    onStart: (config: {
        gridSize: number;
        recoveryTime: number;
        initialInfected: coordinates[];
    }) => void;
}

const GameConfigModal: React.FC<GameConfigModalProps> = ({ isOpen, onStart }) => {
    const [gridSize, setGridSize] = useState<number>(3);
    const [recoveryTime, setRecoveryTime] = useState<number>(2);
    const [infectedCoords, setInfectedCoords] = useState<string>('1,1');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const coords = infectedCoords
            .split(';')
            .map(coord => {
                const [x, y] = coord.trim().split(',').map(Number);
                return { x, y };
            })
            .filter(coord => !isNaN(coord.x) && !isNaN(coord.y));

        onStart({
            gridSize,
            recoveryTime,
            initialInfected: coords
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Game Configuration</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>
                            Grid Size:
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={gridSize}
                                onChange={(e) => setGridSize(parseInt(e.target.value))}
                                className={styles.input}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Recovery Time (ticks):
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={recoveryTime}
                                onChange={(e) => setRecoveryTime(parseInt(e.target.value))}
                                className={styles.input}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Initial Infected Cells (x,y; x,y):
                            <input
                                type="text"
                                value={infectedCoords}
                                onChange={(e) => setInfectedCoords(e.target.value)}
                                className={styles.input}
                                placeholder="1,1; 2,2"
                            />
                        </label>
                        <small className={styles.helpText}>
                            Enter coordinates in format: x,y; x,y (e.g., 1,1; 2,2)
                        </small>
                    </div>

                    <button type="submit" className={styles.button}>
                        Start Game
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GameConfigModal; 