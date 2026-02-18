// LaTeX Rendering Component
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function renderMath(containerId, mathExpression) {
    const container = document.getElementById(containerId);
    if (container) {
        katex.render(mathExpression, container, {
            throwOnError: false
        });
    }
}