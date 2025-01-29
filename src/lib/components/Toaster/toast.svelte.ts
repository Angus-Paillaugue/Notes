export class MyTween {
	#current: number = $state(0);
	#playState: 'running' | 'paused' = 'paused';
	#interval: ReturnType<typeof setInterval> | null = null;
	#from: number;
	#to: number;
	#duration: number;

	constructor(from: number, to: number, duration: number) {
		this.#from = from;
		this.#to = to;
		this.#duration = duration;
		this.#current = from;
	}

	public play() {
		if (this.#playState === 'running') return;

		const fps = 60; // Aim for ~60 updates per second
		const intervalDelay = 1000 / fps;
		const totalSteps = this.#duration / intervalDelay;
		const stepSize = (this.#to - this.#from) / totalSteps;

		this.#playState = 'running';
		this.#interval = setInterval(() => {
			if (!this.#interval) return;
			if (this.#current >= this.#to) {
				clearInterval(this.#interval);
				return;
			}
			if (this.#playState === 'paused') {
				clearInterval(this.#interval);
				return;
			}
			if (this.#playState === 'running') {
				this.#current += stepSize;
			}
		}, intervalDelay);
	}

	public pause() {
		this.#playState = 'paused';
		if (this.#interval) clearInterval(this.#interval);
	}

	get current() {
		return this.#current;
	}
}
