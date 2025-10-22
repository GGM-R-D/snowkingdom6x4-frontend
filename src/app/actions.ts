'use server';

export interface WinningFeedbackEnhancementInput {
    winAmount: number;
    winningSymbols: string[];
    betAmount: number;
}

export interface WinningFeedbackEnhancementOutput {
    feedbackText: string;
    winAmount: number;
    animationType: string;
    soundEffect: string;
}

const DEFAULT_FEEDBACK = {
    feedbackText: 'You won!',
    winAmount: 0,
    animationType: 'coins',
    soundEffect: 'cashJingle'
};

// Win messages based on amount ranges
const getWinMessage = (winAmount: number): string => {
    if (winAmount <= 5) {
        return 'Congratulations!';
    } else if (winAmount <= 10) {
        return 'Well done!';
    } else if (winAmount <= 15) {
        return 'Nice win!';
    } else if (winAmount <= 25) {
        return 'Great job!';
    } else if (winAmount <= 50) {
        return 'Excellent!';
    } else if (winAmount <= 100) {
        return 'Outstanding!';
    } else if (winAmount <= 200) {
        return 'Incredible!';
    } else if (winAmount <= 300) {
        return 'Amazing!';
    } else {
        return 'MEGA WIN!';
    }
};

const ANIMATIONS = ['coins', 'fireworks', 'confetti', 'sparkles'];
const SOUNDS = ['cashJingle', 'cheering', 'winFanfare', 'coinsDropping'];

export async function getWinningFeedback(input: WinningFeedbackEnhancementInput): Promise<WinningFeedbackEnhancementOutput> {
    try {
        const winMessage = getWinMessage(input.winAmount);
        const randomAnimation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
        const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
        
        return {
            feedbackText: winMessage,
            winAmount: input.winAmount,
            animationType: randomAnimation,
            soundEffect: randomSound
        };
    } catch (error) {
        console.error("Error in getWinningFeedback:", error);
        return {
            ...DEFAULT_FEEDBACK,
            feedbackText: 'You won!',
            winAmount: input.winAmount
        };
    }
}
