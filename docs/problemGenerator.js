// Dynamic Problem Generator

export function generateProblem(topic) {
    switch (topic) {
        case 'limits':
            return {
                question: 'Evaluate the limit: \( \lim_{x \to 2} (x^2 - 4)/(x - 2) \)',
                solution: 'The limit is 4.'
            };
        case 'derivatives':
            return {
                question: 'Find the derivative of \( f(x) = x^2 + 3x + 5 \)',
                solution: 'The derivative is \( f'(x) = 2x + 3 \).'
            };
        case 'integrals':
            return {
                question: 'Compute the integral: \( \int x^2 \, dx \)',
                solution: 'The integral is \( \frac{1}{3}x^3 + C \).'
            };
        case 'series':
            return {
                question: 'Determine if the series \( \sum_{n=1}^\infty \frac{1}{n^2} \) converges.',
                solution: 'The series converges to \( \frac{\pi^2}{6} \).'
            };
        default:
            return {
                question: 'Topic not found.',
                solution: 'No solution available.'
            };
    }
}