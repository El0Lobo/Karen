document.addEventListener('DOMContentLoaded', function() {
    paper.setup(document.getElementById('canvas'));
    const canvas = document.getElementById('canvas');
    const canvasOffset = canvas.getBoundingClientRect();
    const connectables = document.querySelectorAll('.connectable');

    let globalWobbleStrength = 1.6; // Initialize wobble strength
    const decay = 0.99; // Decay factor for the wobble strength

    function getAttachmentPoint(element, attachment) {
        const rect = element.getBoundingClientRect();
        switch (attachment) {
            case 'top-left':
                return new paper.Point(rect.left - canvasOffset.left, rect.top - canvasOffset.top);
            case 'top-right':
                return new paper.Point(rect.right - canvasOffset.left, rect.top - canvasOffset.top);
            case 'bottom-left':
                return new paper.Point(rect.left - canvasOffset.left, rect.bottom - canvasOffset.top);
            case 'bottom-right':
                return new paper.Point(rect.right - canvasOffset.left, rect.bottom - canvasOffset.top);
            case 'center':
            default:
                return new paper.Point(rect.left - canvasOffset.left + rect.width / 2, rect.top - canvasOffset.top + rect.height / 2);
        }
    }

    let lastUpdateTime = Date.now();

    function drawRope(from, to, segments = 12, sag = 40) {
        let path = new paper.Path();
        path.strokeColor = 'darkred';
        path.strokeWidth = 5;
        path.strokeCap = 'round';

        const deltaTime = (Date.now() - lastUpdateTime) / 1000;
        lastUpdateTime = Date.now();

        globalWobbleStrength *= Math.pow(decay, deltaTime * 1000 / 16); // Adjust decay based on actual frame rate

        for (let i = 0; i <= segments; i++) {
            let t = i / segments;
            let x = from.x * (1 - t) + to.x * t;
            let sagAmount = i === 0 || i === segments ? 0 : Math.sin(t * Math.PI) * sag * (1 + Math.sin(Date.now() * 0.015) * globalWobbleStrength);
            let y = from.y * (1 - t) + to.y * t + sagAmount;
            path.add(new paper.Point(x, y));
        }
        path.smooth({ type: 'continuous' });
    }

    function updateConnections() {
        paper.project.clear();
        connectables.forEach(element => {
            const connections = element.getAttribute('data-connections').split(',');
            connections.forEach(connection => {
                const [connectionId, attachment] = connection.split(':');
                const toElement = document.getElementById(connectionId.trim());
                if (toElement) {
                    const from = getAttachmentPoint(element, element.getAttribute('data-attachment') || 'center');
                    const to = getAttachmentPoint(toElement, attachment || 'center');
                    drawRope(from, to);
                }
            });
        });
    }

    function animate() {
        updateConnections();
        requestAnimationFrame(animate);
    }

    animate(); // Start the animation loop
});
    // Continuous update loop
    function animate() {
        requestAnimationFrame(animate);
    }

    animate(); // Start the animation loop


document.addEventListener('DOMContentLoaded', function() {
    const button5 = document.getElementById('button5');

    // Set the image URLs
    const staticImage = 'https://github.com/El0Lobo/Karen/raw/main/Stuff%20to%20host/0.png';
    const animatedGif = 'https://github.com/El0Lobo/Karen/raw/main/Stuff%20to%20host/Test4.gif';

    // Change to GIF on hover
    button5.addEventListener('mouseenter', function() {
        button5.src = animatedGif;
    });

    // Change back to static image on mouse leave
    button5.addEventListener('mouseleave', function() {
        button5.src = staticImage;
    });
});
