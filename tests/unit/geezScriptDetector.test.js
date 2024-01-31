// geezScriptDetector.test.js
const GeezScriptDetector = require('../../src/components/TextAreaDetector/textAreaDetector.js');

describe('GeezScriptDetector', () => {
    describe('isGeezScript', () => {
        test('Geez Script Detected', () => {
            const detector = new GeezScriptDetector();
            const result = detector.isGeezScript('አማርኛ');
            expect(result).toBe(true);
        });

        test('No Geez Script', () => {
            const detector = new GeezScriptDetector();
            const result = detector.isGeezScript('EnglishText');
            expect(result).toBe(false);
        });

        test('Mixed Text', () => {
            const detector = new GeezScriptDetector();
            const result = detector.isGeezScript('አማርኛ EnglishText');
            expect(result).toBe(true);
        });

        test('Empty Text', () => {
            const detector = new GeezScriptDetector();
            const result = detector.isGeezScript('');
            expect(result).toBe(false);
        });

        test('Edge Case: Single Geez Character', () => {
            const detector = new GeezScriptDetector();
            const result = detector.isGeezScript('አ');
            expect(result).toBe(true);
        });

        // Add more tests for other cases...
    });
});
