let body = document.querySelector('body');
let container = document.querySelector('.container');
let content = document.querySelector('.content');

// Red or blue???
if (Math.random()<.5) {
	container.dataset.color = 'red';
} else {
	container.dataset.color = 'blue';
}

// Draw in paths
for (let element of document.querySelectorAll('[data-connections]')) {
	let connections = element.dataset.connections.split(',');
	let origin = element.dataset.pos.split(',');
	origin = [parseInt(origin[0]), parseInt(origin[1])];
	for (let id of connections) {
		let connection = document.querySelector("#"+id);
		let target = connection.dataset.pos.split(',');
		target = [parseInt(target[0]), parseInt(target[1])];
		const dimensions = [Math.abs(target[0]-origin[0])+2, Math.abs(target[1]-origin[1])+2];

		// Fix position if target is left or above origin
		let pos = [origin[0], origin[1]];
		let yPos = [0, dimensions[1]];
		if (target[0] < origin[0]) {
			pos[0] = target[0];
		}
		if (target[1] < origin[1]) {
			pos[1] = target[1];
		}
		if ((target[0] < origin[0] && target[1] > origin[1]) || (target[0] > origin[0] && target[1] < origin[1])) {
			yPos = [dimensions[1], 0];
		}

		let path = document.createElementNS('http://www.w3.org/2000/svg','svg');
		path.classList.add('path');
		path.style.left = `calc(50% + ${pos[0]}px)`;
		path.style.top = `calc(50% + ${pos[1]}px)`;
		path.setAttribute('width', dimensions[0]);
		path.setAttribute('height', dimensions[1]);
		path.setAttribute('viewBox', `0 0 ${dimensions[0]} ${dimensions[1]}`);

		let line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute('x1',0);
		line.setAttribute('y1',yPos[0]);
		line.setAttribute('x2',dimensions[0]);
		line.setAttribute('y2',yPos[1]);
		line.setAttribute("stroke", "var(--color)");
		line.setAttribute("stroke-width", "1");
		path.append(line);

		content.appendChild(path);
	}
}

// Animate elements in and position them
function initializePositions() {
	let delay = 100;
	let i = 0;
	let links = document.querySelectorAll('.link');
	for (let link of links) {
		let pos = link.dataset.pos.split(',');
		let zIndex = links.length-i;
		setTimeout(() => {
			link.style.transform = `translate(-50%, -50%) scale(1) rotate(${Math.random()*10-5}deg)`;
			link.style.left = `calc(50% + ${pos[0]}px)`;
			link.style.top = `calc(50% + ${pos[1]}px)`;
			link.style.zIndex = zIndex;
		}, delay = 100*i);
		i++
	}

	// Fade in paths
	setTimeout(() => {
		for (let path of document.querySelectorAll('.path')) {
			path.style.opacity = 1;
		}

		container.addEventListener('mousemove', (e) => {setTarget(e)})

		// Add interactivity
		let target = [0,0];
		function setTarget(e) {
			target = [(e.clientX/window.innerWidth)*2-1, (e.clientY/window.innerHeight)*2-1];
		}

		let pos = [0, 0];
		let modifier = 15;
		setInterval(() => {
			let delta = [target[0] - pos[0], target[1] - pos[1]];
			pos[0] += delta[0]/modifier;
			pos[1] += delta[1]/modifier;
			content.style.transform = `translate(${-80*pos[0]}%, ${-50*pos[1]}%)`
			body.style.backgroundPosition = `${-80*pos[0]}% ${-50*pos[1]}%`
		}, 10)


		for (let link of document.querySelectorAll('.link')) {
			link.addEventListener("mouseenter", slowDown);
			link.addEventListener("mouseleave", speedUp);
		}
		function slowDown() {
			modifier = 30;
		}
		function speedUp() {
			modifier = 15;
		}
	}, delay+1000)
}
initializePositions();