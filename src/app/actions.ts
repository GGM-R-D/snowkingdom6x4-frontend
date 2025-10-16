'use server';

export interface WinningFeedbackEnhancementInput {
    winAmount: number;
    winningSymbols: string[];
    betAmount: number;
}

export interface WinningFeedbackEnhancementOutput {
    feedbackText: string;
    animationType: string;
    soundEffect: string;
}

const DEFAULT_FEEDBACK = {
    feedbackText: 'You won! Congratulations!',
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
            feedbackText: `${randomMessage} You won R${input.winAmount}!`,
            animationType: randomAnimation,
            soundEffect: randomSound
        };
    } catch (error) {
        console.error("Error in getWinningFeedback:", error);
        return {
            ...DEFAULT_FEEDBACK,
            feedbackText: `You won R${input.winAmount}! Congratulations!`
        };
    }
}
