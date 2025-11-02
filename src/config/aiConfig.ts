export const AI_CONFIG = {
    model: 'claude-sonnet-3.5',
    enabled: true,
    defaultSettings: {
        temperature: 0.7,
        maxTokens: 2048
    }
};

export const isClaudeSonnetEnabled = () => AI_CONFIG.enabled;
