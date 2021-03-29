// реализация прокрутки слайдов на 3м слайде
let thumb = range.querySelector('.thumb');

thumb.onpointerdown = function(event) {
	event.preventDefault();
	thumb.ondragstart = () => false;

	const shiftX = event.clientX - thumb.getBoundingClientRect().left;

	function onMouseMove(event) {
		const percentProgress = getProgress(event.clientX);
		setProgress(percentProgress);
		
		let currentSlide = document.getElementById('mini-sliders');

		if (percentProgress >= 0 && percentProgress < 25) {
			currentSlide.style.transform = 'translateX(0vw)';
		} else if (percentProgress >= 25 && percentProgress < 75) {
			currentSlide.style.transform = 'translateX(-100vw)';
		} else {
			currentSlide.style.transform = 'translateX(-200vw)';
		}
	}

	function onMouseUp(event) {
		document.removeEventListener('pointerup', onMouseUp);
		document.removeEventListener('pointermove', onMouseMove);

		const progress = getProgress(event.clientX);
		if (progress >= 0 && progress < 25) {
			setProgress(0);
		} else if (progress >= 25 && progress < 75) {
			setProgress(50);
		} else {
			setProgress(100);
		}
	}

	function getProgress(clientX) {
		let newLeft = clientX - shiftX - range.getBoundingClientRect().left;

		if (newLeft < 0) {
			newLeft = 0;
		}

		let rightEdge = range.offsetWidth - thumb.offsetWidth;
		if (newLeft > rightEdge) {
			newLeft = rightEdge;
		}

		return rightEdge !== 0 ? (newLeft * 100) / rightEdge : 0;
	}

	function setProgress(progressPercent) {
		thumb.style.left = `${progressPercent - 2}%`;
		progress.style.width = `${progressPercent}%`;
	}
	
	document.addEventListener('pointermove', onMouseMove);
	document.addEventListener('pointerup', onMouseUp);
}
//end


//реализация методов добавления/удаления класса для точек навигации по слайдам
function activeFirstSlide() {
	first.classList.add('active');
	second.classList.remove('active');
	third.classList.remove('active');
	sliders.style.transform = 'translateY(0vh)';
}

function activeSecondSlide() {
	first.classList.remove('active');
	second.classList.add('active');
	third.classList.remove('active');
	sliders.style.transform = 'translateY(-100vh)';
}

function activeThirdSlide() {
	first.classList.remove('active');
	second.classList.remove('active');
	third.classList.add('active');
	sliders.style.transform = 'translateY(-200vh)';
}
//end

//реализация метода прокрутки слайдов
let allMainSliders = document.querySelectorAll('.slide1').length; 
let direction = null;
let hold = false;

function _scrollY(obj) {
	let slength, plength, pan, step = 100;
	let vh = window.innerHeight / 100;
	let vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
	if ((this !== undefined && this.id === 'sliders') || (obj !== undefined && obj.id === 'sliders')) {
		pan = this || obj;
		plength = parseInt(pan.offsetHeight / vh);
	}
	if (pan === undefined) {
		return;
	}
	plength = plength || parseInt(pan.offsetHeight / vmin);
	slength = parseInt(pan.style.transform.replace('translateY(', ''));
	if (direction === 'up' && Math.abs(slength) < (plength - plength / allMainSliders)) {
		slength = slength - step;
	} else if (direction === 'down' && slength < 0) {
		slength = slength + step;
	} else if (direction === 'top') {
		slength = 0;
	}
	if (!hold) {
		hold = true;
		if (slength === 0) {
			first.classList.add('active');
			second.classList.remove('active');
			third.classList.remove('active');
		} else if (slength === -100) {
			first.classList.remove('active');
			second.classList.add('active');
			third.classList.remove('active');
		} else {
			first.classList.remove('active');
			second.classList.remove('active');
			third.classList.add('active');
		}
		let parallax = -slength * 0.2;
		pan.style.transform = 'translateY(' + slength + 'vh)';
		layer.style.transform = 'translateY(' + parallax + 'px)';
		layer.style.transition = 'all 1s ease';
		setTimeout(function() {
			hold = false;
		}, 1500);

	}
}

sliders.style.transform = 'translateY(0)';
sliders.addEventListener('wheel', function(e) {
	if (e.deltaY < 0) {
		direction = 'down';
	}
	if (e.deltaY > 0) {
		direction = 'up';
	}
	e.stopPropagation();
});
sliders.addEventListener('wheel', _scrollY);
//end