// ============================================================
// Calculus Teaching App — Main Application
// ============================================================

// ===== State =====
const state = {
    completed: JSON.parse(localStorage.getItem('calcCompleted') || '[]'),
    scores: JSON.parse(localStorage.getItem('calcScores') || '{}'),
    currentSection: 'dashboard'
};
function saveState() {
    localStorage.setItem('calcCompleted', JSON.stringify(state.completed));
    localStorage.setItem('calcScores', JSON.stringify(state.scores));
}
function markComplete(section) {
    if (!state.completed.includes(section)) {
        state.completed.push(section);
        saveState();
    }
    updateProgress();
    updateNavStyles();
}
const ALL_SECTIONS = [
    'limits-intro','limits-rules','limits-continuity','limits-quiz',
    'deriv-intro','deriv-rules','deriv-apps','deriv-quiz',
    'integ-intro','integ-techniques','integ-apps','integ-quiz',
    'series-intro','series-tests','series-taylor','series-quiz'
];
function updateProgress() {
    const pct = Math.round((state.completed.length / ALL_SECTIONS.length) * 100);
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-text').textContent = pct + '% Complete';
}
function updateNavStyles() {
    document.querySelectorAll('.nav-link').forEach(link => {
        const sec = link.dataset.section;
        if (state.completed.includes(sec)) link.classList.add('completed');
    });
}

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            state.currentSection = link.dataset.section;
            renderSection(link.dataset.section);
            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('open');
        });
    });
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
    updateProgress();
    updateNavStyles();
    renderSection('dashboard');
});

// ===== Render Math =====
function renderMathIn(el) {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(el, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
}

// ===== Graph Helper =====
function drawGraph(containerId, fns, opts = {}) {
    try {
        const el = document.getElementById(containerId);
        if (!el || typeof functionPlot === 'undefined') return;
        functionPlot({
            target: '#' + containerId,
            width: el.clientWidth || 600,
            height: opts.height || 300,
            xAxis: { domain: opts.xDomain || [-5, 5], label: opts.xLabel || 'x' },
            yAxis: { domain: opts.yDomain || [-5, 5], label: opts.yLabel || 'y' },
            grid: true,
            data: fns
        });
    } catch(e) { console.warn('Graph error:', e); }
}

// ===== Section Router =====
function renderSection(section) {
    const area = document.getElementById('content-area');
    const renderer = sections[section];
    if (renderer) {
        area.innerHTML = renderer();
        renderMathIn(area);
        // Post-render hooks (graphs, quiz logic)
        if (postRender[section]) postRender[section]();
    } else {
        area.innerHTML = '<div class="card"><h2>Coming Soon</h2><p>This section is under development.</p></div>';
    }
}

// ===== Post-render hooks =====
const postRender = {};

// ============================================================
// CONTENT SECTIONS
// ============================================================
const sections = {};

// ---- Dashboard ----
sections['dashboard'] = () => `
<div class="card">
    <h2>Welcome to the Calculus Teaching App!</h2>
    <p>Master calculus step by step. Choose a topic below to begin learning.</p>
</div>
<div class="dashboard-grid">
    <div class="topic-card" onclick="navigate('limits-intro')">
        <div class="icon">📈</div>
        <h3>Limits & Continuity</h3>
        <p>Foundation of calculus</p>
        <div class="mastery-bar"><div class="mastery-fill" style="width:${getMastery(['limits-intro','limits-rules','limits-continuity','limits-quiz'])}%"></div></div>
    </div>
    <div class="topic-card" onclick="navigate('deriv-intro')">
        <div class="icon">📐</div>
        <h3>Derivatives</h3>
        <p>Rates of change</p>
        <div class="mastery-bar"><div class="mastery-fill" style="width:${getMastery(['deriv-intro','deriv-rules','deriv-apps','deriv-quiz'])}%"></div></div>
    </div>
    <div class="topic-card" onclick="navigate('integ-intro')">
        <div class="icon">📊</div>
        <h3>Integrals</h3>
        <p>Accumulation & area</p>
        <div class="mastery-bar"><div class="mastery-fill" style="width:${getMastery(['integ-intro','integ-techniques','integ-apps','integ-quiz'])}%"></div></div>
    </div>
    <div class="topic-card" onclick="navigate('series-intro')">
        <div class="icon">♾️</div>
        <h3>Sequences & Series</h3>
        <p>Infinite sums & expansions</p>
        <div class="mastery-bar"><div class="mastery-fill" style="width:${getMastery(['series-intro','series-tests','series-taylor','series-quiz'])}%"></div></div>
    </div>
</div>
`;
function getMastery(keys) {
    const done = keys.filter(k => state.completed.includes(k)).length;
    return Math.round((done / keys.length) * 100);
}
function navigate(sec) {
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active');
        if (l.dataset.section === sec) l.classList.add('active');
    });
    state.currentSection = sec;
    renderSection(sec);
}

// ============================================================
// LIMITS & CONTINUITY
// ============================================================
sections['limits-intro'] = () => `
<div class="card">
    <h2>📈 Introduction to Limits</h2>
    <p>A <strong>limit</strong> describes the value a function approaches as the input gets closer and closer to some number. It's the foundational idea behind all of calculus.</p>

    <div class="key-idea">
        <strong>Core Idea:</strong> We're interested in where a function is <span class="concept-highlight">heading</span>, not necessarily where it is at a specific point.
    </div>

    <h3>Real-World Context</h3>
    <div class="real-world-box">
        <strong>🏃 Running Speed Example:</strong> Imagine you're running faster and faster. As you keep pushing, what <em>top speed</em> are you approaching? Even if you never quite reach it, you're getting closer. That top speed is like a limit—it's the value your speed approaches as time goes on.
    </div>

    <h3>Intuitive Idea</h3>
    <p>Imagine walking toward a wall. You keep halving the distance — you get closer and closer but might never actually touch it. The wall's position is the <em>limit</em> of your position.</p>

    <div class="math-block">
        \\[ \\lim_{x \\to a} f(x) = L \\]
    </div>
    <p style="text-align:center; color:#64748b;"><em>This reads: "The limit of f(x) as x approaches a equals L"</em></p>

    <h3>Example 1 — Simple Substitution</h3>
    <div class="example-box">
        <h4>📍 Find \\(\\lim_{x \\to 2} (3x + 1)\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> Since \\(3x+1\\) is continuous, substitute directly: \\(3(2)+1 = 7\\).</div>
        <div class="step"><strong style="color:#0c4a6e;">Answer:</strong> \\(\\lim_{x \\to 2}(3x+1) = 7\\)</div>
    </div>

    <h3>Example 2 — Indeterminate Form 0/0</h3>
    <div class="example-box">
        <h4>📍 Find \\(\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> Direct substitution gives \\(\\frac{0}{0}\\) — <strong>indeterminate!</strong> ⚠️</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Factor: \\(\\frac{(x-2)(x+2)}{x-2} = x+2\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> Now substitute: \\(2 + 2 = 4\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Answer:</strong> The limit is \\(4\\).</div>
    </div>

    <div class="warning-box">
        <strong>⚠️ Common Mistake:</strong> Never just plug in the number without checking for \\(\\frac{0}{0}\\) or \\(\\frac{\\infty}{\\infty}\\). Always try to simplify first!
    </div>

    <h3>📊 Practice Problems</h3>
    <p><strong>Try the first problem:</strong></p>
    <div class="try-it">
        <p>What is \\(\\lim_{x \\to 3} (x^2 - 1)\\)?</p>
        <input type="number" step="0.01" id="try-limits-1" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-limits-1', 8, 'try-limits-1-result')">Check</button>
        <div id="try-limits-1-result" class="result"></div>
    </div>

    <p><strong>Try a second problem (with factoring):</strong></p>
    <div class="try-it">
        <p>\\(\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = \\,?\\)</p>
        <input type="number" step="0.01" id="try-limits-2" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-limits-2', 2, 'try-limits-2-result')">Check</button>
        <div id="try-limits-2-result" class="result"></div>
    </div>

    <p><strong>Challenge: Try a trickier one!</strong></p>
    <div class="try-it">
        <p>\\(\\lim_{x \\to 5} \\frac{x^2 - 25}{x - 5} = \\,?\\)</p>
        <input type="number" step="0.01" id="try-limits-3" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-limits-3', 10, 'try-limits-3-result')">Check</button>
        <div id="try-limits-3-result" class="result"></div>
    </div>

    <div id="graph-limits-intro" class="graph-container"></div>
    <p style="text-align:center;color:#64748b;font-size:0.85rem;">Notice the hole at \\(x=2\\) but the function approaches \\(y=4\\)</p>

    <br>
    <button class="btn btn-success" onclick="markComplete('limits-intro'); navigate('limits-rules');">Mark Complete & Continue →</button>
</div>
`;
postRender['limits-intro'] = () => {
    drawGraph('graph-limits-intro', [
        { fn: 'x+2', color: '#3b82f6' },
        { fn: '4', fnType: 'points', graphType: 'scatter', color: '#ef4444',
          points: [[2, 4]], attr: { r: 6, 'stroke-width': 2, stroke: '#ef4444', fill: 'white' } }
    ], { xDomain: [-2, 6], yDomain: [-1, 8] });
};

// ---- Limit Laws ----
sections['limits-rules'] = () => `
<div class="card">
    <h2>🧮 Limit Laws & Techniques</h2>
    <p>These rules let you break complex limits into simpler pieces without always computing from the definition.</p>

    <h3>Real-World Application</h3>
    <div class="real-world-box">
        <strong>💰 Compound Interest:</strong> Banks use limit laws to calculate continuous compound interest. As you compound more and more frequently, the final amount approaches a specific limit—that's where the number <em>e</em> comes from!
    </div>

    <h3>Key Limit Laws</h3>
    <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <ul>
            <li><strong style="color: #15803d;">Sum Rule:</strong> \\(\\lim[f(x)+g(x)] = \\lim f(x) + \\lim g(x)\\)</li>
            <li><strong style="color: #15803d;">Product Rule:</strong> \\(\\lim[f(x) \\cdot g(x)] = \\lim f(x) \\cdot \\lim g(x)\\)</li>
            <li><strong style="color: #15803d;">Quotient Rule:</strong> \\(\\lim \\frac{f(x)}{g(x)} = \\frac{\\lim f(x)}{\\lim g(x)}\\) (if denominator \\(\\neq 0\\))</li>
            <li><strong style="color: #15803d;">Power Rule:</strong> \\(\\lim [f(x)]^n = [\\lim f(x)]^n\\)</li>
        </ul>
    </div>

    <h3>The Squeeze Theorem — When Functions Are Trapped</h3>
    <div class="key-idea">
        If a function is <span class="concept-highlight">squeezed</span> between two other functions that both approach the same limit, then the squeezed function must also approach that limit!
    </div>
    <div class="math-block">
        If \\(g(x) \\leq f(x) \\leq h(x)\\) near \\(a\\), and \\(\\lim_{x\\to a}g(x) = \\lim_{x\\to a}h(x) = L\\), then \\(\\lim_{x\\to a}f(x) = L\\).
    </div>

    <h3>Example — Squeeze Theorem in Action</h3>
    <div class="example-box">
        <h4>📍 Find \\(\\lim_{x \\to 0} x^2 \\sin\\left(\\frac{1}{x}\\right)\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> We know that sine oscillates: \\(-1 \\leq \\sin(1/x) \\leq 1\\) (always!)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Multiply all parts by \\(x^2\\) (which is positive): \\(-x^2 \\leq x^2\\sin(1/x) \\leq x^2\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> As \\(x \\to 0\\), both \\(-x^2 \\to 0\\) and \\(x^2 \\to 0\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 4:</strong> The middle expression is <span class="concept-highlight">squeezed</span> between two functions approaching 0</div>
        <div class="step"><strong style="color:#0c4a6e;">Answer:</strong> By the Squeeze Theorem, \\(\\lim_{x \\to 0} x^2\\sin(1/x) = 0\\)</div>
    </div>

    <h3>📊 Practice Problems</h3>
    <p><strong>Simple application of rules:</strong></p>
    <div class="try-it">
        <p>Evaluate \\(\\lim_{x \\to 3} (2x^2 - x + 1)\\) using the limit laws.</p>
        <input type="number" step="0.01" id="try-rules-1" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-rules-1', 16, 'try-rules-1-result')">Check</button>
        <div id="try-rules-1-result" class="result"></div>
    </div>

    <p><strong>Using the quotient rule:</strong></p>
    <div class="try-it">
        <p>\\(\\lim_{x \\to 2} \\frac{x^2 + 3x}{x - 1} = \\,?\\)</p>
        <input type="number" step="0.01" id="try-rules-2" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-rules-2', 10, 'try-rules-2-result')">Check</button>
        <div id="try-rules-2-result" class="result"></div>
    </div>

    <p><strong>Challenge: Product and sum rules combined:</strong></p>
    <div class="try-it">
        <p>\\(\\lim_{x \\to 1} (x + 2) \\cdot (x^2 - 3) = \\,?\\)</p>
        <input type="number" step="0.01" id="try-rules-3" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-rules-3', -4, 'try-rules-3-result')">Check</button>
        <div id="try-rules-3-result" class="result"></div>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('limits-rules'); navigate('limits-continuity');">Mark Complete & Continue →</button>
</div>
`;

// ---- Continuity ----
sections['limits-continuity'] = () => `
<div class="card">
    <h2>🔗 Continuity — Functions Without Breaks</h2>
    <p>A function \\(f\\) is <span class="concept-highlight">continuous at \\(x = a\\)</span> if you can draw it without lifting your pencil at that point.</p>

    <h3>Real-World Example</h3>
    <div class="real-world-box">
        <strong>🚗 Speed on a Highway:</strong> Your car's speed should increase smoothly—not jump from 30 mph to 60 mph instantly. If it did, that's a discontinuity. In the real world, speed changes continuously.
    </div>

    <h3>The Three Conditions for Continuity</h3>
    <div style="background: #eff6ff; border: 2px solid #3b82f6; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <ol>
            <li>\\(f(a)\\) is <strong style="color: #0c4a6e;">defined</strong> (the point exists)</li>
            <li>\\(\\lim_{x \\to a} f(x)\\) <strong style="color: #0c4a6e;">exists</strong> (function approaches a value)</li>
            <li>\\(\\lim_{x \\to a} f(x) = f(a)\\) (the limit <strong style="color: #0c4a6e;">equals</strong> the function value)</li>
        </ol>
    </div>

    <h3>Types of Discontinuity</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
        <div style="background: #fff7ed; border: 2px solid #f97316; padding: 1rem; border-radius: 8px;">
            <strong style="color: #ea580c;">🕳️ Removable (Hole)</strong><br>
            <small>Limit exists but \\(f(a)\\) is undefined or wrong value. You could "fill the hole."</small>
        </div>
        <div style="background: #fce7f3; border: 2px solid #ec4899; padding: 1rem; border-radius: 8px;">
            <strong style="color: #be185d;">↗️ Jump</strong><br>
            <small>Left and right limits exist but are different. An actual gap in the graph.</small>
        </div>
        <div style="background: #f3e8ff; border: 2px solid #a855f7; padding: 1rem; border-radius: 8px;">
            <strong style="color: #6b21a8;">📈 Infinite</strong><br>
            <small>Function goes to \\(\\pm\\infty\\) (vertical asymptote).</small>
        </div>
        <div style="background: #fee2e2; border: 2px solid #ef4444; padding: 1rem; border-radius: 8px;">
            <strong style="color: #991b1b;">⚡ Oscillating</strong><br>
            <small>Function wiggles wildly (rare in basic calculus).</small>
        </div>
    </div>

    <h3>Example — Removable Discontinuity</h3>
    <div class="example-box">
        <h4>📍 Is \\(f(x) = \\frac{x^2 - 1}{x - 1}\\) continuous at \\(x = 1\\)?</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> \\(f(1) = \\frac{0}{0}\\) → <strong>undefined</strong> ❌ Condition 1 <span class="concept-highlight">fails</span></div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Simplify: \\(\\frac{(x-1)(x+1)}{x-1} = x+1\\) for \\(x \\neq 1\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> \\(\\lim_{x\\to 1}(x+1) = 2\\) → limit <strong>exists</strong> ✅</div>
        <div class="step"><strong style="color:#0c4a6e;">Conclusion:</strong> <span class="concept-highlight">Removable discontinuity</span> — it's a hole at \\((1, 2)\\)</div>
    </div>

    <h3>📊 Practice Problems</h3>
    <div class="try-it">
        <p><strong>Question 1:</strong> Is \\(f(x) = x^2 + 3\\) continuous at \\(x = 2\\)?</p>
        <select id="try-cont-1" style="padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 6px;">
            <option value="">-- Select Answer --</option>
            <option value="yes">Yes, it is continuous</option>
            <option value="no">No, it has a discontinuity</option>
        </select>
        <button class="btn" onclick="checkSelectAnswer('try-cont-1', 'yes', 'try-cont-1-result')">Check</button>
        <div id="try-cont-1-result" class="result"></div>
    </div>

    <div class="try-it">
        <p><strong>Question 2:</strong> At what type of discontinuity does \\(f(x) = \\frac{1}{x}\\) have at \\(x=0\\)?</p>
        <select id="try-cont-2" style="padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 6px;">
            <option value="">-- Select Answer --</option>
            <option value="removable">Removable (hole)</option>
            <option value="jump">Jump discontinuity</option>
            <option value="infinite">Infinite (vertical asymptote)</option>
        </select>
        <button class="btn" onclick="checkSelectAnswer('try-cont-2', 'infinite', 'try-cont-2-result')">Check</button>
        <div id="try-cont-2-result" class="result"></div>
    </div>

    <div id="graph-continuity" class="graph-container"></div>

    <br>
    <button class="btn btn-success" onclick="markComplete('limits-continuity'); navigate('limits-quiz');">Mark Complete & Take the Quiz →</button>
</div>
`;
postRender['limits-continuity'] = () => {
    drawGraph('graph-continuity', [
        { fn: 'x+1', color: '#3b82f6' }
    ], { xDomain: [-3, 5], yDomain: [-1, 6], xLabel: 'x', yLabel: 'f(x)' });
};

// ============================================================
// DERIVATIVES
// ============================================================
sections['deriv-intro'] = () => `
<div class="card">
    <h2>📐 What is a Derivative?</h2>
    <p>The <strong>derivative</strong> measures how fast a function changes — it's the <em>instantaneous rate of change</em>.</p>

    <h3>Real-World Applications 🌍</h3>
    <div class="real-world-box">
        <strong>🚗 Speedometer:</strong> Your speedometer shows <em>instantaneous speed</em>—that's a derivative! It's how fast your position changes <em>right now</em>.<br>
        <strong>💉 Medicine Dosing:</strong> Doctors need to know how fast a drug concentration changes in your bloodstream, so they can give safe doses.
    </div>

    <h3>Visual Intuition</h3>
    <p>The derivative at a point is the <span class="concept-highlight">slope of the tangent line</span> at that point.</p>

    <h3>The Limit Definition</h3>
    <div class="math-block">
        \\[ f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} \\]
    </div>
    <p style="text-align:center; color:#64748b;"><em>Change in output ÷ Change in input as the input change gets tiny</em></p>

    <h3>Example — From the Definition</h3>
    <div class="example-box">
        <h4>📍 Find \\(f'(x)\\) for \\(f(x) = x^2\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> Set up: \\(\\frac{f(x+h)-f(x)}{h} = \\frac{(x+h)^2 - x^2}{h}\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Expand: \\(= \\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h}\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> Cancel: \\(= 2x + h\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 4:</strong> Take limit as \\(h \\to 0\\): \\(\\lim_{h\\to 0}(2x+h) = 2x\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Answer:</strong> \\(f'(x) = 2x\\)</div>
    </div>

    <div class="key-idea">
        <strong>Key Takeaway:</strong> For \\(f(x) = x^2\\), the slope at any point \\(x\\) is \\(2x\\). At \\(x=1\\), slope is 2. At \\(x=3\\), slope is 6.
    </div>

    <div id="graph-deriv-intro" class="graph-container"></div>
    <p style="text-align:center;color:#64748b;font-size:0.85rem;"><strong style="color:#3b82f6;">Blue:</strong> \\(f(x)=x^2\\) | <strong style="color:#ef4444;">Red:</strong> \\(f'(x)=2x\\)</p>

    <h3>📊 Practice Problems</h3>
    <div class="try-it">
        <p><strong>Question 1:</strong> Using the definition, if \\(f(x) = 3x\\), what is \\(f'(2)\\)?</p>
        <input type="number" step="0.01" id="try-deriv-1" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-deriv-1', 3, 'try-deriv-1-result')">Check</button>
        <div id="try-deriv-1-result" class="result"></div>
    </div>

    <div class="try-it">
        <p><strong>Question 2:</strong> For \\(f(x) = x^2\\), what is the slope of the tangent line at \\(x = 3\\)?</p>
        <input type="number" step="0.01" id="try-deriv-2" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-deriv-2', 6, 'try-deriv-2-result')">Check</button>
        <div id="try-deriv-2-result" class="result"></div>
    </div>

    <div class="try-it">
        <p><strong>Challenge:</strong> If \\(f(x) = x^3\\), what is \\(f'(1)\\)? (Hint: expand \\((x+h)^3 = x^3 + 3x^2h + 3xh^2 + h^3\\))</p>
        <input type="number" step="0.01" id="try-deriv-3" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-deriv-3', 3, 'try-deriv-3-result')">Check</button>
        <div id="try-deriv-3-result" class="result"></div>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('deriv-intro'); navigate('deriv-rules');">Mark Complete & Continue →</button>
</div>
`;
postRender['deriv-intro'] = () => {
    drawGraph('graph-deriv-intro', [
        { fn: 'x^2', color: '#3b82f6' },
        { fn: '2*x', color: '#ef4444' }
    ], { xDomain: [-4, 4], yDomain: [-5, 10] });
};

// ---- Derivative Rules ----
sections['deriv-rules'] = () => `
<div class="card">
    <h2>⚡ Derivative Rules — Shortcuts to Save Time</h2>
    <p>Using the limit definition every time is slow. These <span class="concept-highlight">shortcut rules</span> let you compute derivatives instantly!</p>

    <h3>Real-World Impact</h3>
    <div class="real-world-box">
        <strong>⚙️ Engineering:</strong> Engineers need to find optimal designs (min material, max strength). Without derivative rules, this would take forever. With them, seconds!
    </div>

    <h3>The Essential Rules</h3>
    <div style="display: grid; gap: 1rem; margin: 1rem 0;">
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem; border-radius: 0 8px 8px 0;">
            <strong style="color: #1e40af;">Power Rule:</strong> \\(\\frac{d}{dx}[x^n] = nx^{n-1}\\)
            <br><small>Example: \\(\\frac{d}{dx}[x^5] = 5x^4\\)</small>
        </div>
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; border-radius: 0 8px 8px 0;">
            <strong style="color: #15803d;">Constant Multiple:</strong> \\(\\frac{d}{dx}[cf(x)] = c \\cdot f'(x)\\)
            <br><small>Example: \\(\\frac{d}{dx}[3x^2] = 3 \\cdot 2x = 6x\\)</small>
        </div>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 0 8px 8px 0;">
            <strong style="color: #92400e;">Sum Rule:</strong> \\((f+g)' = f' + g'\\)
            <br><small>Example: \\(\\frac{d}{dx}[x^2 + x] = 2x + 1\\)</small>
        </div>
    </div>

    <h3>Product Rule — For Products of Functions</h3>
    <div class="key-idea">
        \\((fg)' = f'g + fg'\\)
        <br><em>Derivative of first × second + first × derivative of second</em>
    </div>
    <div class="example-box">
        <h4>📍 Find the derivative of \\(f(x) = x^2 \\sin(x)\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> Identify \\(u = x^2\\) (first) and \\(v = \\sin(x)\\) (second)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Find derivatives: \\(u' = 2x\\) and \\(v' = \\cos(x)\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> Apply rule: \\(f'(x) = (2x)\\sin(x) + x^2\\cos(x)\\)</div>
    </div>

    <h3>Chain Rule — For Composite Functions</h3>
    <div class="key-idea">
        \\(\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)\\)
        <br><em>Outer derivative × Inner derivative</em>
    </div>
    <div class="example-box">
        <h4>📍 Find the derivative of \\(f(x) = (3x+1)^5\\)</h4>
        <div class="step"><strong style="color:#0c4a6e;">Step 1:</strong> Outer function: \\(u^5\\) where \\(u = 3x+1\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 2:</strong> Outer derivative: \\(5u^4\\). Inner derivative: \\(3\\)</div>
        <div class="step"><strong style="color:#0c4a6e;">Step 3:</strong> Combine: \\(f'(x) = 5(3x+1)^4 \\cdot 3 = 15(3x+1)^4\\)</div>
    </div>

    <h3>📊 Practice Problems</h3>
    <div class="try-it">
        <p><strong>Power Rule:</strong> Find \\(\\frac{d}{dx}[x^4]\\)</p>
        <input type="number" step="0.01" id="try-rules-2-1" placeholder="f'(x) = ">
        <button class="btn" onclick="alert('Hint: Use Power Rule with n=4. Your answer should be a formula like 4x^3, but enter it as an expression at x=1')">Show Hint</button>
    </div>

    <div class="try-it">
        <p><strong>Power rule at a point:</strong> If \\(f(x)=5x^3-2x+1\\), what is \\(f'(1)\\)?</p>
        <input type="number" step="0.01" id="try-rules-2-2" placeholder="f'(1) = ">
        <button class="btn" onclick="checkTryIt('try-rules-2-2', 13, 'try-rules-2-2-result')">Check</button>
        <div id="try-rules-2-2-result" class="result"></div>
    </div>

    <div class="try-it">
        <p><strong>Product Rule:</strong> If \\(f(x) = x \\cdot e^x\\), what is \\(f'(0)\\)?</p>
        <input type="number" step="0.01" id="try-rules-2-3" placeholder="f'(0) = ">
        <button class="btn" onclick="checkTryIt('try-rules-2-3', 1, 'try-rules-2-3-result')">Check</button>
        <div id="try-rules-2-3-result" class="result"></div>
    </div>

    <div class="try-it">
        <p><strong>Challenge - Chain Rule:</strong> If \\(f(x) = (x^2 + 1)^3\\), what is \\(f'(1)\\)?</p>
        <input type="number" step="0.01" id="try-rules-2-4" placeholder="f'(1) = ">
        <button class="btn" onclick="checkTryIt('try-rules-2-4', 48, 'try-rules-2-4-result')">Check</button>
        <div id="try-rules-2-4-result" class="result"></div>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('deriv-rules'); navigate('deriv-apps');">Mark Complete & Continue →</button>
</div>
`;

// ---- Derivative Applications ----
sections['deriv-apps'] = () => `
<div class="card">
    <h2>Applications of Derivatives</h2>

    <h3>1. Finding Extrema (Max & Min)</h3>
    <p>Set \\(f'(x) = 0\\) and solve. These are <strong>critical points</strong>. Use the second derivative test:</p>
    <ul>
        <li>If \\(f''(c) > 0\\): local minimum</li>
        <li>If \\(f''(c) < 0\\): local maximum</li>
    </ul>

    <div class="example-box">
        <p><strong>Find the extrema of \\(f(x) = x^3 - 3x + 2\\)</strong></p>
        <div class="step"><strong>Step 1:</strong> \\(f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1\\)</div>
        <div class="step"><strong>Step 2:</strong> \\(f''(x) = 6x\\)</div>
        <div class="step"><strong>Step 3:</strong> \\(f''(1) = 6 > 0\\) → local min at \\(x=1\\); \\(f''(-1)=-6 < 0\\) → local max at \\(x=-1\\)</div>
    </div>

    <div id="graph-deriv-apps" class="graph-container"></div>
    <p style="text-align:center;color:#64748b;font-size:0.85rem;">\\(f(x) = x^3 - 3x + 2\\) showing local max and min</p>

    <h3>2. Related Rates</h3>
    <p>Use the chain rule to relate rates of change of different quantities with respect to time.</p>

    <h3>3. Linear Approximation</h3>
    <div class="math-block">\\[ f(x) \\approx f(a) + f'(a)(x - a) \\]</div>

    <br>
    <button class="btn btn-success" onclick="markComplete('deriv-apps'); navigate('deriv-quiz');">Mark Complete & Take the Quiz →</button>
</div>
`;
postRender['deriv-apps'] = () => {
    drawGraph('graph-deriv-apps', [
        { fn: 'x^3 - 3*x + 2', color: '#6366f1' }
    ], { xDomain: [-3, 3], yDomain: [-3, 6] });
};

// ============================================================
// INTEGRALS
// ============================================================
sections['integ-intro'] = () => `
<div class="card">
    <h2>What is an Integral?</h2>
    <p>Integration is the reverse of differentiation. It calculates the <strong>accumulated area under a curve</strong>.</p>

    <h3>Indefinite Integral (Antiderivative)</h3>
    <div class="math-block">\\[ \\int f(x)\\,dx = F(x) + C \\quad \\text{where } F'(x) = f(x) \\]</div>

    <h3>Definite Integral</h3>
    <div class="math-block">\\[ \\int_a^b f(x)\\,dx = F(b) - F(a) \\]</div>

    <h3>Example</h3>
    <div class="example-box">
        <p><strong>Compute \\(\\int x^2\\,dx\\)</strong></p>
        <div class="step"><strong>Step 1:</strong> Use the power rule in reverse: add 1 to the exponent, divide by the new exponent.</div>
        <div class="step"><strong>Step 2:</strong> \\(\\int x^2\\,dx = \\frac{x^3}{3} + C\\)</div>
    </div>

    <h3>Example — Definite Integral</h3>
    <div class="example-box">
        <p><strong>Compute \\(\\int_0^2 x^2\\,dx\\)</strong></p>
        <div class="step"><strong>Step 1:</strong> Antiderivative: \\(F(x) = \\frac{x^3}{3}\\)</div>
        <div class="step"><strong>Step 2:</strong> \\(F(2) - F(0) = \\frac{8}{3} - 0 = \\frac{8}{3}\\)</div>
    </div>

    <div id="graph-integ-intro" class="graph-container"></div>
    <p style="text-align:center;color:#64748b;font-size:0.85rem;">The shaded area represents \\(\\int_0^2 x^2\\,dx\\)</p>

    <div class="try-it">
        <h4>Try It!</h4>
        <p>What is \\(\\int_0^3 2x\\,dx\\)?</p>
        <input type="number" id="try-integ-1" placeholder="Your answer">
        <button class="btn" onclick="checkTryIt('try-integ-1', 9, 'try-integ-1-result')">Check</button>
        <div id="try-integ-1-result" class="result"></div>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('integ-intro'); navigate('integ-techniques');">Mark Complete & Continue →</button>
</div>
`;
postRender['integ-intro'] = () => {
    drawGraph('graph-integ-intro', [
        { fn: 'x^2', color: '#3b82f6',
          range: [0, 2], closed: true },
        { fn: 'x^2', color: '#3b82f6' }
    ], { xDomain: [-1, 4], yDomain: [-1, 6] });
};

// ---- Integration Techniques ----
sections['integ-techniques'] = () => `
<div class="card">
    <h2>Integration Techniques</h2>

    <h3>1. u-Substitution</h3>
    <p>Reverse of the chain rule. Let \\(u = g(x)\\), then \\(du = g'(x)\\,dx\\).</p>
    <div class="example-box">
        <p><strong>Compute \\(\\int 2x\\cos(x^2)\\,dx\\)</strong></p>
        <div class="step"><strong>Step 1:</strong> Let \\(u = x^2\\), \\(du = 2x\\,dx\\)</div>
        <div class="step"><strong>Step 2:</strong> \\(\\int \\cos(u)\\,du = \\sin(u) + C\\)</div>
        <div class="step"><strong>Answer:</strong> \\(\\sin(x^2) + C\\)</div>
    </div>

    <h3>2. Integration by Parts</h3>
    <div class="math-block">\\[ \\int u\\,dv = uv - \\int v\\,du \\]</div>
    <div class="example-box">
        <p><strong>Compute \\(\\int x e^x\\,dx\\)</strong></p>
        <div class="step"><strong>Step 1:</strong> Let \\(u = x\\), \\(dv = e^x\\,dx\\)</div>
        <div class="step"><strong>Step 2:</strong> Then \\(du = dx\\), \\(v = e^x\\)</div>
        <div class="step"><strong>Step 3:</strong> \\(= xe^x - \\int e^x\\,dx = xe^x - e^x + C\\)</div>
    </div>

    <h3>3. Partial Fractions</h3>
    <p>Decompose rational functions into simpler fractions before integrating.</p>

    <br>
    <button class="btn btn-success" onclick="markComplete('integ-techniques'); navigate('integ-apps');">Mark Complete & Continue →</button>
</div>
`;

// ---- Integral Applications ----
sections['integ-apps'] = () => `
<div class="card">
    <h2>Applications of Integrals</h2>

    <h3>1. Area Between Curves</h3>
    <div class="math-block">\\[ A = \\int_a^b [f(x) - g(x)]\\,dx \\]</div>

    <h3>2. Volume of Revolution (Disk Method)</h3>
    <div class="math-block">\\[ V = \\pi \\int_a^b [f(x)]^2\\,dx \\]</div>

    <h3>Example</h3>
    <div class="example-box">
        <p><strong>Find the area between \\(f(x) = x^2\\) and \\(g(x) = x\\) from \\(x=0\\) to \\(x=1\\).</strong></p>
        <div class="step"><strong>Step 1:</strong> \\(A = \\int_0^1 (x - x^2)\\,dx\\)</div>
        <div class="step"><strong>Step 2:</strong> \\(= \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}\\)</div>
    </div>

    <div id="graph-integ-apps" class="graph-container"></div>

    <br>
    <button class="btn btn-success" onclick="markComplete('integ-apps'); navigate('integ-quiz');">Mark Complete & Take the Quiz →</button>
</div>
`;
postRender['integ-apps'] = () => {
    drawGraph('graph-integ-apps', [
        { fn: 'x^2', color: '#3b82f6' },
        { fn: 'x', color: '#ef4444' }
    ], { xDomain: [-1, 2], yDomain: [-0.5, 2] });
};

// ============================================================
// SEQUENCES & SERIES
// ============================================================
sections['series-intro'] = () => `
<div class="card">
    <h2>Sequences & Series</h2>

    <h3>Sequence</h3>
    <p>A <strong>sequence</strong> is an ordered list of numbers: \\(a_1, a_2, a_3, \\ldots\\)</p>
    <div class="example-box">
        <p><strong>Example:</strong> \\(a_n = \\frac{1}{n}\\) gives: \\(1, \\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\ldots \\to 0\\)</p>
    </div>

    <h3>Series</h3>
    <p>A <strong>series</strong> is the sum of a sequence's terms:</p>
    <div class="math-block">\\[ S = \\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots \\]</div>

    <h3>Geometric Series</h3>
    <div class="math-block">\\[ \\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r} \\quad \\text{if } |r| < 1 \\]</div>
    <div class="example-box">
        <p><strong>Example:</strong> \\(\\sum_{n=0}^{\\infty} \\frac{1}{2^n} = \\frac{1}{1 - 1/2} = 2\\)</p>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('series-intro'); navigate('series-tests');">Mark Complete & Continue →</button>
</div>
`;

// ---- Convergence Tests ----
sections['series-tests'] = () => `
<div class="card">
    <h2>Convergence Tests</h2>
    <p>How do you know if an infinite series adds up to a finite number?</p>

    <h3>Key Tests</h3>
    <ul>
        <li><strong>Divergence Test:</strong> If \\(\\lim a_n \\neq 0\\), the series diverges.</li>
        <li><strong>Ratio Test:</strong> \\(L = \\lim \\frac{|a_{n+1}|}{|a_n|}\\). Converges if \\(L < 1\\), diverges if \\(L > 1\\).</li>
        <li><strong>Root Test:</strong> \\(L = \\lim \\sqrt[n]{|a_n|}\\). Same rules as ratio test.</li>
        <li><strong>Integral Test:</strong> If \\(f(x)\\) is positive & decreasing, \\(\\sum a_n\\) converges iff \\(\\int_1^\\infty f(x)\\,dx\\) converges.</li>
        <li><strong>Comparison Test:</strong> Compare with a known series.</li>
        <li><strong>p-Series:</strong> \\(\\sum \\frac{1}{n^p}\\) converges if \\(p > 1\\).</li>
    </ul>

    <h3>Example — Ratio Test</h3>
    <div class="example-box">
        <p><strong>Does \\(\\sum_{n=1}^{\\infty} \\frac{n!}{n^n}\\) converge?</strong></p>
        <div class="step"><strong>Step 1:</strong> \\(L = \\lim \\frac{(n+1)!/(n+1)^{n+1}}{n!/n^n}\\)</div>
        <div class="step"><strong>Step 2:</strong> Simplify to \\(L = \\lim \\left(\\frac{n}{n+1}\\right)^n = \\frac{1}{e} < 1\\)</div>
        <div class="step"><strong>Answer:</strong> The series converges by the ratio test.</div>
    </div>

    <br>
    <button class="btn btn-success" onclick="markComplete('series-tests'); navigate('series-taylor');">Mark Complete & Continue →</button>
</div>
`;

// ---- Taylor & Maclaurin ----
sections['series-taylor'] = () => `
<div class="card">
    <h2>Taylor & Maclaurin Series</h2>

    <h3>Taylor Series (centered at \\(a\\))</h3>
    <div class="math-block">\\[ f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n \\]</div>

    <h3>Maclaurin Series (centered at \\(a = 0\\))</h3>
    <p>Common series to memorize:</p>
    <ul>
        <li>\\(e^x = \\sum \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots\\)</li>
        <li>\\(\\sin(x) = \\sum \\frac{(-1)^n x^{2n+1}}{(2n+1)!} = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots\\)</li>
        <li>\\(\\cos(x) = \\sum \\frac{(-1)^n x^{2n}}{(2n)!} = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots\\)</li>
        <li>\\(\\frac{1}{1-x} = \\sum x^n = 1 + x + x^2 + x^3 + \\cdots\\) for \\(|x|<1\\)</li>
    </ul>

    <h3>Example</h3>
    <div class="example-box">
        <p><strong>Find the Maclaurin series for \\(f(x) = e^x\\) up to 4 terms.</strong></p>
        <div class="step"><strong>Step 1:</strong> All derivatives of \\(e^x\\) are \\(e^x\\), and \\(f^{(n)}(0) = 1\\)</div>
        <div class="step"><strong>Step 2:</strong> \\(e^x \\approx 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6}\\)</div>
    </div>

    <div id="graph-taylor" class="graph-container"></div>
    <p style="text-align:center;color:#64748b;font-size:0.85rem;">\\(e^x\\) (blue) vs Taylor approx \\(1+x+x^2/2+x^3/6\\) (red)</p>

    <br>
    <button class="btn btn-success" onclick="markComplete('series-taylor'); navigate('series-quiz');">Mark Complete & Take the Quiz →</button>
</div>
`;
postRender['series-taylor'] = () => {
    drawGraph('graph-taylor', [
        { fn: 'exp(x)', color: '#3b82f6' },
        { fn: '1 + x + x^2/2 + x^3/6', color: '#ef4444' }
    ], { xDomain: [-3, 3], yDomain: [-1, 10] });
};

// ============================================================
// QUIZZES
// ============================================================
function buildQuiz(quizId, questions) {
    let html = `<div class="card"><h2>Quiz</h2><p>Test your understanding! Select the best answer for each question.</p></div>`;
    questions.forEach((q, i) => {
        html += `<div class="quiz-question" id="${quizId}-q${i}">
            <h4>Question ${i+1}: ${q.question}</h4>
            <div class="quiz-options">`;
        q.options.forEach((opt, j) => {
            html += `<div class="quiz-option" data-quiz="${quizId}" data-q="${i}" data-opt="${j}" onclick="answerQuiz(this, ${j === q.answer})">${opt}</div>`;
        });
        html += `</div><div id="${quizId}-q${i}-feedback" class="quiz-feedback" style="display:none"></div></div>`;
    });
    html += `<div id="${quizId}-score" style="display:none"></div>`;
    html += `<button class="btn" onclick="scoreQuiz('${quizId}', ${questions.length})" id="${quizId}-submit" style="margin-top:1rem;">Submit Quiz</button>`;
    return html;
}

function answerQuiz(el, isCorrect) {
    const parent = el.closest('.quiz-question');
    const opts = parent.querySelectorAll('.quiz-option');
    if (opts[0].classList.contains('disabled')) return; // already answered
    opts.forEach(o => {
        o.classList.add('disabled');
        if (o === el) o.classList.add(isCorrect ? 'correct' : 'incorrect');
    });
    // Highlight correct answer
    if (!isCorrect) {
        const correct = parent.querySelector('.quiz-option[data-opt="' + getCorrectIdx(parent) + '"]');
        // We'll mark through scoring
    }
    const fb = parent.querySelector('.quiz-feedback');
    fb.style.display = 'block';
    fb.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
    fb.textContent = isCorrect ? 'Correct! Well done!' : 'Not quite. Review the lesson and try again.';
    el.dataset.answered = isCorrect ? '1' : '0';
}

function getCorrectIdx(parent) {
    // Not needed for display
    return 0;
}

function scoreQuiz(quizId, total) {
    const questions = document.querySelectorAll(`[data-quiz="${quizId}"].correct`);
    const score = questions.length;
    const pct = Math.round((score / total) * 100);
    const scoreDiv = document.getElementById(quizId + '-score');
    scoreDiv.style.display = 'block';
    scoreDiv.innerHTML = `<div class="quiz-score"><h3>Score: ${score}/${total} (${pct}%)</h3><p>${pct >= 70 ? 'Great job! You passed!' : 'Keep studying and try again!'}</p></div>`;
    state.scores[quizId] = pct;
    if (pct >= 70) markComplete(quizId);
    saveState();
}

// ---- Limits Quiz ----
sections['limits-quiz'] = () => buildQuiz('limits-quiz', [
    { question: 'What is \\(\\lim_{x \\to 3} (2x + 1)\\)?',
      options: ['5', '7', '6', '9'], answer: 1 },
    { question: 'When direct substitution gives \\(\\frac{0}{0}\\), what should we do?',
      options: ['Say the limit is undefined', 'Try to simplify by factoring or other methods', 'Automatically give up', 'Guess the answer'], answer: 1 },
    { question: 'Which of the following is the <strong>Sum Rule</strong> for limits?',
      options: ['\\(\\lim[f(x)g(x)] = \\lim f(x) + \\lim g(x)\\)', '\\(\\lim[f(x)+g(x)] = \\lim f(x) + \\lim g(x)\\)', '\\(\\lim[f(x)+g(x)] = \\lim f(x) \\cdot \\lim g(x)\\)', '\\(\\lim[f/g] = \\lim f - \\lim g\\)'], answer: 1 },
    { question: '\\(\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}\\) equals:',
      options: ['0', '1', '2', 'undefined'], answer: 2 },
    { question: 'In the Squeeze Theorem, if \\(g(x) \\leq f(x) \\leq h(x)\\) and \\(\\lim g = \\lim h = 5\\), then:',
      options: ['\\(\\lim f\\) might be 3', '\\(\\lim f = 5\\)', '\\(f(x) = 5\\)', 'We cannot determine \\(\\lim f\\)'], answer: 1 }
]);
postRender['limits-quiz'] = () => { renderMathIn(document.getElementById('content-area')); };

// ---- Derivatives Quiz ----
sections['deriv-quiz'] = () => buildQuiz('deriv-quiz', [
    { question: 'Using the Power Rule, the derivative of \\(x^6\\) is:',
      options: ['\\(6x^5\\)', '\\(6x^7\\)', '\\(x^5\\)', '\\(6x^6\\)'], answer: 0 },
    { question: 'If \\(f(x) = \\frac{(x+h)^2 - x^2}{h}\\), simplify this expression:',
      options: ['\\(2x + h\\)', '\\(2x\\)', '\\(h^2\\)', '\\(2xh + h^2\\)'], answer: 0 },
    { question: 'What does the derivative measure?',
      options: ['The maximum value of a function', 'The instantaneous rate of change', 'The y-intercept', 'The area under the curve'], answer: 1 },
    { question: 'The Chain Rule states that \\(\\frac{d}{dx}[f(g(x))] =\\):',
      options: ["\\(f'(x) \\cdot g'(x)\\)", "\\(f'(g(x)) \\cdot g'(x)\\)", "\\(f'(g(x))\\)", "\\(g'(f(x))\\)"], answer: 1 },
    { question: "Using the Product Rule on \\(f(x) = x \\cdot e^x\\) at \\(x=0\\), what is \\(f'(0)\\)?",
      options: ['0', '1', 'e', '-1'], answer: 1 }
]);
postRender['deriv-quiz'] = () => { renderMathIn(document.getElementById('content-area')); };

// ---- Integrals Quiz ----
sections['integ-quiz'] = () => buildQuiz('integ-quiz', [
    { question: '\\(\\int x^3\\,dx =\\)',
      options: ['\\(3x^2 + C\\)', '\\(\\frac{x^4}{4} + C\\)', '\\(x^4 + C\\)', '\\(\\frac{x^3}{3} + C\\)'], answer: 1 },
    { question: '\\(\\int_0^1 2x\\,dx =\\)',
      options: ['0', '1', '2', '\\(\\frac{1}{2}\\)'], answer: 1 },
    { question: 'Integration by parts formula is:',
      options: ['\\(\\int u\\,dv = uv - \\int v\\,du\\)', '\\(\\int u\\,dv = uv + \\int v\\,du\\)', '\\(\\int uv = u\'v\'\\)', '\\(\\int u\\,dv = u - v\\)'], answer: 0 },
    { question: 'The Fundamental Theorem of Calculus connects:',
      options: ['Limits and series', 'Derivatives and integrals', 'Sequences and functions', 'Algebra and geometry'], answer: 1 },
    { question: 'The area between two curves \\(f(x)\\) and \\(g(x)\\) is:',
      options: ['\\(\\int f(x)\\,dx\\)', '\\(\\int [f(x) - g(x)]\\,dx\\)', '\\(f(x) \\cdot g(x)\\)', '\\(\\int f(x) \\cdot g(x)\\,dx\\)'], answer: 1 }
]);
postRender['integ-quiz'] = () => { renderMathIn(document.getElementById('content-area')); };

// ---- Series Quiz ----
sections['series-quiz'] = () => buildQuiz('series-quiz', [
    { question: 'A geometric series \\(\\sum ar^n\\) converges when:',
      options: ['\\(|r| > 1\\)', '\\(|r| < 1\\)', '\\(r = 1\\)', '\\(a > r\\)'], answer: 1 },
    { question: 'The p-series \\(\\sum 1/n^p\\) converges when:',
      options: ['\\(p < 1\\)', '\\(p = 1\\)', '\\(p > 1\\)', '\\(p > 0\\)'], answer: 2 },
    { question: 'The Maclaurin series for \\(e^x\\) starts:',
      options: ['\\(x + x^2 + \\ldots\\)', '\\(1 + x + x^2/2! + \\ldots\\)', '\\(1 - x + x^2 - \\ldots\\)', '\\(x - x^3/3! + \\ldots\\)'], answer: 1 },
    { question: 'If \\(\\lim a_n \\neq 0\\), the series:',
      options: ['Converges', 'Diverges', 'May converge', 'Equals zero'], answer: 1 },
    { question: 'A Taylor series centered at \\(a = 0\\) is called:',
      options: ['Laurent series', 'Fourier series', 'Maclaurin series', 'Power series'], answer: 2 }
]);
postRender['series-quiz'] = () => { renderMathIn(document.getElementById('content-area')); };

// ============================================================
// UTILITIES
// ============================================================
function checkTryIt(inputId, correctAnswer, resultId) {
    const val = parseFloat(document.getElementById(inputId).value);
    const res = document.getElementById(resultId);
    if (isNaN(val)) {
        res.textContent = 'Please enter a number.';
        res.style.color = '#f59e0b';
    } else if (Math.abs(val - correctAnswer) < 0.01) {
        res.textContent = 'Correct! Great job!';
        res.style.color = '#16a34a';
    } else {
        res.textContent = 'Not quite — the answer is ' + correctAnswer + '. Try reviewing the example above.';
        res.style.color = '#dc2626';
    }
}

function checkSelectAnswer(selectId, correctValue, resultId) {
    const sel = document.getElementById(selectId);
    const res = document.getElementById(resultId);
    const val = sel.value;
    if (!val) {
        res.textContent = 'Please select an answer.';
        res.style.color = '#f59e0b';
    } else if (val === correctValue) {
        res.textContent = 'Correct! You selected the right answer.';
        res.style.color = '#16a34a';
    } else {
        res.textContent = 'Not quite right. Review the lesson and try again.';
        res.style.color = '#dc2626';
    }
}