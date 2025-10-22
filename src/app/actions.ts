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

const WIN_MESSAGES = [
    'Amazing win!',
    'Incredible!',
    'You\'re on fire!',
    'Jackpot!',
    'Lucky spin!',
    'Huge win!',
    'Winner winner!',
    'Fantastic!',
    'Unbelievable!',
    'You\'re a star!'
];

const ANIMATIONS = ['coins', 'fireworks', 'confetti', 'sparkles'];
const SOUNDS = ['cashJingle', 'cheering', 'winFanfare', 'coinsDropping'];

export async function getWinningFeedback(input: WinningFeedbackEnhancementInput): Promise<WinningFeedbackEnhancementOutput> {
    try {
        const randomMessage = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
        const randomAnimation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
        const randomSound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
        
        return {
            feedbackText: randomMessage,
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
