// UI Enhancements

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <ul>
            <li><a href="#limits">Limits</a></li>
            <li><a href="#derivatives">Derivatives</a></li>
            <li><a href="#integrals">Integrals</a></li>
            <li><a href="#series">Series</a></li>
        </ul>
    `;
    document.body.insertBefore(nav, document.body.firstChild);

    const main = document.querySelector('main');
    main.innerHTML += `
        <section id="limits">
            <h2>Limits</h2>
            <div id="limits-content"></div>
        </section>
        <section id="derivatives">
            <h2>Derivatives</h2>
            <div id="derivatives-content"></div>
        </section>
        <section id="integrals">
            <h2>Integrals</h2>
            <div id="integrals-content"></div>
        </section>
        <section id="series">
            <h2>Sequences & Series</h2>
            <div id="series-content"></div>
        </section>
    `;
});