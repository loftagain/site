   document.addEventListener('DOMContentLoaded', () => {
        const { Engine, Render, Runner, Bodies, Composite, World, Body, Events } = Matter;

        const marbleContainer = document.getElementById('marble-container');
        const engine = Engine.create();
        const world = engine.world;

        const render = Render.create({
            element: marbleContainer,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // create walls to act as the jar boundaries
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true, render: { visible: false } });
        const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } });
        const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true, render: { visible: false } });

        World.add(world, [ground, leftWall, rightWall]);

        const marbles = [];
        // add colors that are randomly picked from for each ball
        const colors = ['rgba(155, 155, 155, 0.7)', 'rgba(10, 10, 10, 0.7)'];

        function createMarble(isInteractive = false) {
            const radius = 75; // marble size
            const color = colors[Math.floor(Math.random() * colors.length)];
            const marble = Bodies.circle(Math.random() * window.innerWidth, -50, radius, {
                restitution: 0.8, // bounciness
                render: {
                    fillStyle: color,
                    strokeStyle: 'rgba(255, 255, 255, 0.5)',
                    lineWidth: 5,
                    shadowBlur: 20,
                    shadowColor: 'rgba(255, 255, 255, 0.5)' // light scattering effect, was meant for frost
                }
            });

            if (isInteractive) {
                marble.isInteractive = true;
            }

            World.add(world, marble);
            marbles.push(marble);
        }

        // generate initial marbles
        const numberOfMarbles = 6;
        for (let i = 0; i < numberOfMarbles - 1; i++) {
            createMarble();
        }
        // add one interactive marble
        createMarble(true);

        let lastScrollTop = 0;
        let lastTime = Date.now();

        // scroll event listener to make marbles bounce
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.scrollY;
            const currentTime = Date.now();
            const scrollDelta = currentScrollTop - lastScrollTop;
            const timeDelta = currentTime - lastTime;

            const scrollSpeed = Math.abs(scrollDelta / timeDelta); // Scroll speed in pixels per millisecond

            marbles.forEach(marble => {
                const horizontalForce = (Math.random() - 0.5) * 0.02;
                const verticalForce = Math.min(scrollSpeed * 0.02, 0.03); // Reduce sensitivity and cap the maximum vertical force
                Body.applyForce(marble, marble.position, { x: horizontalForce, y: -verticalForce });
            });

            lastScrollTop = currentScrollTop;
            lastTime = currentTime;
        });

        // adjusting canvas size on window resize
        window.addEventListener('resize', () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
        });

        // Check for stopped interactive marble
        Events.on(engine, 'afterUpdate', () => {
            marbles.forEach(marble => {
                if (marble.isInteractive && marble.speed < 0.1) {
                    marble.render.fillStyle = 'rgba(255, 255, 0, 1)';
                    marble.render.strokeStyle = 'rgba(255, 255, 0, 1)';
                    marble.render.lineWidth = 10;

                    const newsLink = document.getElementById('news-link');
                    newsLink.style.left = `${marble.position.x - 40}px`;
                    newsLink.style.top = `${marble.position.y - 10}px`;
                    newsLink.style.display = 'block';

                    marble.isInteractive = false; // Only glow and reveal once

                    // Make marble clickable
                    marble.render.isInteractive = true;

                    // Add click event listener
                    render.canvas.addEventListener('click', (event) => {
                        const mouseX = event.clientX;
                        const mouseY = event.clientY;
                        const distX = mouseX - marble.position.x;
                        const distY = mouseY - marble.position.y;
                        const distance = Math.sqrt(distX * distX + distY * distY);
                        if (distance < marble.circleRadius) {
                            // Spin the marble and reveal a different color
                            marble.render.fillStyle = 'rgba(0, 255, 0, 1)'; // Change color to yellow
                            Body.setAngularVelocity(marble, 0.1); // Apply spin
                        }
                    });
                }
            });
        });
    });